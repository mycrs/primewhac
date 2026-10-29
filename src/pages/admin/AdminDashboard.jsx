import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminData } from '@/hooks/useAdminData';
import { Activity, FileText, Package, Database, CheckCircle, XCircle, MessageCircle, Home, AlertTriangle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { fetchAdminExpiringCustomers } from '@/utils/adminCustomersApi';
import { remainingCalendarDaysUntilEnd, formatTrDate } from '@/utils/customerDates';
import { whatsappHrefForCustomer, renewalReminderMessage } from '@/utils/whatsappCustomer';
import { Button } from '@/components/ui/button';
import { adminPath } from '@/constants/adminRoutes';

const AdminDashboard = () => {
  const { session } = useAuth();
  const { fetchBlogPosts, fetchPackages } = useAdminData();
  const [stats, setStats] = useState({ blogs: 0, packages: 0 });
  const [dbStatus, setDbStatus] = useState('checking');
  const [expiringCustomers, setExpiringCustomers] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const blogs = await fetchBlogPosts();
      const packages = await fetchPackages();
      setStats({ blogs: blogs ? blogs.length : 0, packages: packages ? packages.length : 0 });
    };

    const checkDb = async () => {
      try {
        const { error } = await supabase.from('site_content').select('key').limit(1);
        setDbStatus(error ? 'error' : 'connected');
      } catch {
        setDbStatus('error');
      }
    };

    const loadExpiring = async () => {
      const token = session?.access_token;
      const api = await fetchAdminExpiringCustomers(token);
      if (api.customers != null) {
        setExpiringCustomers(api.customers);
        return;
      }
      const { data } = await supabase.from('customers').select('*').eq('status', 'aktif');
      if (!data) {
        setExpiringCustomers([]);
        return;
      }
      const active = data.filter((c) => c.deleted_at == null);
      const soon = active.filter((c) => {
        if (!c.end_date) return false;
        const rem = remainingCalendarDaysUntilEnd(String(c.end_date).slice(0, 10));
        return rem != null && rem >= 0 && rem <= 7;
      });
      setExpiringCustomers(soon);
    };

    loadStats();
    checkDb();
    loadExpiring();
  }, [fetchBlogPosts, fetchPackages, session?.access_token]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0a0a0a] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Toplam Blog Yazısı</CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.blogs}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Aktif Paketler</CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.packages}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Sistem Durumu</CardTitle>
            <Database className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              {dbStatus === 'checking' && <span className="text-yellow-500">Kontrol ediliyor...</span>}
              {dbStatus === 'connected' && <><CheckCircle className="w-5 h-5 text-green-500" /> Bağlı</>}
              {dbStatus === 'error' && <><XCircle className="w-5 h-5 text-red-500" /> Bağlantı Hatası</>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0a0a0a] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            7 gün içinde biten abonelikler
          </CardTitle>
          <CardDescription className="text-slate-400">
            Müşteri listesinden detay ve yenileme için &quot;Müşteriler&quot; menüsünü kullanın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {expiringCustomers.length === 0 ? (
            <p className="text-sm text-slate-500">Yakında bitecek aktif kayıt yok.</p>
          ) : (
            <ul className="space-y-2">
              {expiringCustomers.map((c) => {
                const end = c.end_date ? String(c.end_date).slice(0, 10) : '';
                const rem = end ? remainingCalendarDaysUntilEnd(end) : null;
                const msg = renewalReminderMessage(c.full_name, c.package_name, formatTrDate(end));
                const href = whatsappHrefForCustomer(c, msg);
                return (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-[#0a0a0a]/50 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-white">{c.full_name}</span>
                      <span className="text-slate-400"> · {c.username}</span>
                      <div className="text-xs text-slate-500">
                        Bitiş {formatTrDate(end)}
                        {rem != null && ` · ${rem} gün kaldı`}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="border-slate-600" asChild>
                        <a href={href} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      </Button>
                      <Button size="sm" className="bg-primary" asChild>
                        <Link to={`${adminPath('customers')}/${c.id}`}>Detay</Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0a0a0a] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Hızlı İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to={adminPath('hero')} className="px-4 py-2 bg-primary hover:bg-primary text-white rounded-lg transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" />
            Ana sayfa Hero / slayt
          </Link>
          <Link to={adminPath('blog')} className="px-4 py-2 bg-primary hover:bg-primary text-white rounded-lg transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Blog Yönetimi
          </Link>
          <Link to={adminPath('packages')} className="px-4 py-2 bg-[#141414] hover:bg-[#0a0a0a] text-white rounded-lg transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" />
            Paket Yönetimi
          </Link>
          <Link to={adminPath('customers')} className="px-4 py-2 bg-[#141414] hover:bg-[#0a0a0a] text-white rounded-lg transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Müşteri takip
          </Link>
          <Link to={adminPath('chatbot')} className="px-4 py-2 bg-[#e50914] hover:bg-[#e50914] text-white rounded-lg transition-colors flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            ChatBot Yönetimi
          </Link>
          <Link to={adminPath('settings')} className="px-4 py-2 bg-[#0a0a0a] hover:bg-[#141414] text-white rounded-lg transition-colors flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sistem Ayarları
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
