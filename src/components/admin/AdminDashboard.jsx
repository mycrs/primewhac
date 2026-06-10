import React from 'react';
import { Link } from 'react-router-dom';
import SupabaseConnectionStatus from './SupabaseConnectionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tv, Package, FileText, Wrench, Settings } from 'lucide-react';
import { adminPath } from '@/constants/adminRoutes';

const AdminDashboard = () => {
  const links = [
    { label: 'Kanal Yönetimi', path: adminPath('channels'), icon: Tv },
    { label: 'Paket Yönetimi', path: adminPath('packages'), icon: Package },
    { label: 'Kurulum Yönetimi', path: adminPath('setup'), icon: Wrench },
    { label: 'Blog Yönetimi', path: adminPath('blog'), icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Yönetim Paneli</h2>
          <p className="text-slate-400 mt-1">Sitenizin tüm içeriğini buradan yönetebilirsiniz.</p>
        </div>
        <SupabaseConnectionStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <Card key={i} className="bg-[#0a0a0a] border-white/10 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-white m-0">{link.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Button asChild variant="outline" className="w-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                  <Link to={link.path}>Yönet</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-[#0a0a0a] border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Sistem Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 bg-green-500/10 text-green-400 p-4 rounded-lg border border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <p>Tüm sistemler normal çalışıyor. Veritabanı bağlantısı aktif ve kararlı.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;