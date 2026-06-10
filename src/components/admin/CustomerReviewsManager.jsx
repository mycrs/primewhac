import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, X, Trash2, Star, Filter, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_LABEL = {
  pending: 'Bekleyen',
  approved: 'Yayında',
  rejected: 'Reddedildi',
};

const SQL_FIX_HINT =
  'Cursor/VS Code’da supabase/sql_editor_customer_reviews_columns.sql dosyasını açın, içindeki ALTER TABLE … ile başlayan SQL’i kopyalayıp Supabase SQL Editor’e yapıştırıp çalıştırın (dosya yolunu değil, sadece SQL metnini).';

/** PostgREST şema önbelleği / eksik kolon (is_featured, reviewer_email vb.) */
function isCustomerReviewsSchemaColumnError(err, columnSnake) {
  if (!err) return false;
  const msg = String(err.message || err.details || '').toLowerCase();
  const spaced = columnSnake.replace(/_/g, ' ');
  return (
    err.code === 'PGRST204' ||
    msg.includes(columnSnake) ||
    msg.includes(spaced) ||
    (msg.includes('schema cache') && msg.includes('customer_reviews'))
  );
}

const CustomerReviewsManager = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customer_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ variant: 'destructive', title: 'Yüklenemedi', description: error.message });
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const setStatus = async (id, status) => {
    const patch = { status, moderated_at: new Date().toISOString() };
    if (status === 'rejected' || status === 'pending') {
      patch.is_featured = false;
    }
    let { error } = await supabase.from('customer_reviews').update(patch).eq('id', id);
    if (error && isCustomerReviewsSchemaColumnError(error, 'is_featured') && 'is_featured' in patch) {
      const { is_featured: _drop, ...withoutFeatured } = patch;
      ({ error } = await supabase.from('customer_reviews').update(withoutFeatured).eq('id', id));
    }
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Güncellenemedi',
        description: isCustomerReviewsSchemaColumnError(error, 'is_featured')
          ? `is_featured kolonu eksik. ${SQL_FIX_HINT}`
          : error.message,
      });
      return;
    }
    toast({
      title: status === 'approved' ? 'Onaylandı' : 'Reddedildi',
      className: 'bg-[#e50914] text-white border-none',
    });
    fetchRows();
  };

  const toggleFeatured = async (id, currentlyFeatured) => {
    const { error } = await supabase
      .from('customer_reviews')
      .update({ is_featured: !currentlyFeatured })
      .eq('id', id)
      .eq('status', 'approved');
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Öne çıkarma çalışmıyor',
        description: isCustomerReviewsSchemaColumnError(error, 'is_featured')
          ? `Veritabanında is_featured kolonu yok. ${SQL_FIX_HINT}`
          : error.message,
      });
      return;
    }
    toast({
      title: !currentlyFeatured ? 'Öne çıkarıldı' : 'Öne çıkarma kaldırıldı',
      className: 'bg-[#e50914] text-white border-none',
    });
    fetchRows();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu yorumu kalıcı olarak silmek istiyor musunuz?')) return;
    const { error } = await supabase.from('customer_reviews').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Silinemedi', description: error.message });
      return;
    }
    toast({ title: 'Silindi' });
    fetchRows();
  };

  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Müşteri yorumları</h2>
          <p className="text-slate-400 text-sm mt-1">
            Gönderilen yorumlar önce beklemede kalır; yalnızca onayladıklarınız sitede görünür. Yayında olanlar için «Öne çıkar» ile ana sayfa ve yorumlar sayfası slaytına ekleyebilirsiniz.
            {pendingCount > 0 && (
              <span className="text-amber-400 font-medium ml-1">({pendingCount} bekliyor)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] bg-[#131326] border-white/10 text-white">
              <SelectValue placeholder="Filtre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="approved">Yayında</SelectItem>
              <SelectItem value="rejected">Reddedildi</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/10" onClick={fetchRows} disabled={loading}>
            Yenile
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-12">Kayıt yok.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border p-5 ${
                r.status === 'pending'
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : r.status === 'approved'
                    ? 'border-green-500/30 bg-[#0a0a0a]/80'
                    : 'border-red-500/20 bg-[#0a0a0a]/50 opacity-80'
              }`}
            >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-white flex flex-wrap items-center gap-2">
                    {r.author_display_name}
                    {r.status === 'approved' && r.is_featured && (
                      <span className="text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Öne çıkan
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(r.created_at).toLocaleString('tr-TR')} ·{' '}
                    <span className="uppercase">{r.locale}</span> ·{' '}
                    <span
                      className={
                        r.status === 'pending'
                          ? 'text-amber-400'
                          : r.status === 'approved'
                            ? 'text-green-400'
                            : 'text-red-400'
                      }
                    >
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </p>
                </div>
                <div className="flex text-amber-400 gap-0.5" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-slate-600'}`} />
                  ))}
                </div>
              </div>
              {(r.subscription_months != null || r.customer_since_months != null) && (
                <p className="text-xs text-slate-500 mb-2">
                  Paket: {r.subscription_months ?? '—'} ay · Kullanım: {r.customer_since_months ?? '—'} ay
                </p>
              )}
              {r.reviewer_email && (
                <p className="text-xs text-slate-400 mb-2 break-all">
                  E-posta (yalnızca moderasyon):{' '}
                  <a href={`mailto:${r.reviewer_email}`} className="text-primary hover:underline">
                    {r.reviewer_email}
                  </a>
                </p>
              )}
              <p className="text-slate-300 text-sm whitespace-pre-wrap mb-4">{r.body}</p>
              <div className="flex flex-wrap gap-2">
                {r.status !== 'approved' && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setStatus(r.id, 'approved')}
                  >
                    <Check className="w-4 h-4 mr-1" /> Onayla
                  </Button>
                )}
                {r.status !== 'rejected' && (
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-300" onClick={() => setStatus(r.id, 'rejected')}>
                    <X className="w-4 h-4 mr-1" /> Reddet
                  </Button>
                )}
                {r.status === 'approved' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        r.is_featured
                          ? 'border-amber-400/60 text-amber-200 bg-amber-500/10'
                          : 'border-slate-600 text-slate-300'
                      }
                      onClick={() => toggleFeatured(r.id, !!r.is_featured)}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {r.is_featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                    </Button>
                    <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-200" onClick={() => setStatus(r.id, 'pending')}>
                      Beklemeye al
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="text-red-400 ml-auto" onClick={() => remove(r.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviewsManager;
