
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminData } from '@/hooks/useAdminData';
import { Activity, FileText, Package, Database, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AdminDashboard = () => {
  const { fetchBlogPosts, fetchPackages } = useAdminData();
  const [stats, setStats] = useState({ blogs: 0, packages: 0 });
  const [dbStatus, setDbStatus] = useState('checking');

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

    loadStats();
    checkDb();
  }, [fetchBlogPosts, fetchPackages]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Toplam Blog Yazısı</CardTitle>
            <FileText className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.blogs}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Aktif Paketler</CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.packages}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
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

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Hızlı İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <a href="/admin/blog" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Blog Yönetimi
          </a>
          <a href="/admin/packages" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" />
            Paket Yönetimi
          </a>
          <a href="/admin/chatbot" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            ChatBot Yönetimi
          </a>
          <a href="/admin/settings" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sistem Ayarları
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
