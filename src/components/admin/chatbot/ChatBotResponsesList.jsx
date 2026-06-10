import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Search, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const ChatBotResponsesList = ({ refreshTrigger, onEdit }) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Cevaplar yüklenemedi."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu cevabı silmek istediğinize emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from('chatbot_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Cevap silindi."
      });
      fetchResponses();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Cevap silinirken bir hata oluştu."
      });
    }
  };

  const filteredResponses = responses.filter(r => 
    r.keyword.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h4 className="text-xl font-bold text-white">Kayıtlı Otomatik Cevaplar</h4>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cevaplarda ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#0a0a0a]/50 border-slate-700 text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredResponses.length === 0 ? (
        <div className="text-center py-12 bg-[#0a0a0a]/30 rounded-lg border border-slate-800">
          <p className="text-slate-400">Kayıtlı cevap bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredResponses.map(r => (
            <div key={r.id} className="glass-effect rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-600 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 font-semibold text-sm">Anahtar Kelimeler:</span>
                  <span className="text-white font-medium truncate">{r.keyword}</span>
                  {r.active ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full ml-2">
                      <CheckCircle2 className="w-3 h-3" /> Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full ml-2">
                      <XCircle className="w-3 h-3" /> Pasif
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-yellow-400 font-semibold text-sm block mb-1">Botun Cevabı:</span>
                  <p className="text-slate-300 text-sm line-clamp-2">{r.response}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 shrink-0">
                <Button 
                  onClick={() => onEdit(r)} 
                  variant="outline" 
                  size="sm"
                  className="bg-[#0a0a0a] border-slate-700 hover:bg-[#0a0a0a] hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" /> Düzenle
                </Button>
                <Button 
                  onClick={() => handleDelete(r.id)} 
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBotResponsesList;