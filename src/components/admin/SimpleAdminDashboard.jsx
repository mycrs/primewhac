
import React, { useEffect } from 'react';
import { Tv, Package, BookText, Users, ArrowRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="border-white/10 bg-[#131326]">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
    </CardContent>
  </Card>
);

const SimpleAdminDashboard = ({ siteData = {} }) => {
  useEffect(() => {
    console.log("SimpleAdminDashboard mounted. Received siteData keys:", Object.keys(siteData || {}));
  }, [siteData]);

  // Safely access data with optional chaining and fallbacks
  const stats = {
    channels: siteData?.channelsData?.length || 0,
    packages: (siteData?.packagesData?.turkiye?.length || 0) + (siteData?.packagesData?.avrupa?.length || 0),
    blogPosts: siteData?.blogData?.length || 0,
    users: 1 // Self
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hoş Geldiniz, Admin 👋
          </h1>
          <p className="text-gray-400">Yönetim paneline erişim sağladınız.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Toplam Kanal" value={stats.channels} icon={Tv} color="blue" />
        <StatCard title="Aktif Paketler" value={stats.packages} icon={Package} color="purple" />
        <StatCard title="Blog Yazıları" value={stats.blogPosts} icon={BookText} color="green" />
        <StatCard title="Yöneticiler" value={stats.users} icon={Users} color="pink" />
      </div>

      <Card className="border-white/10 bg-[#131326] mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Sistem Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Sistem şu anda sorunsuz çalışıyor. Sol menüyü kullanarak içeriklerinizi yönetebilirsiniz.
            Herhangi bir hata durumunda "Sistem Durumu" panelinden logları inceleyebilirsiniz.
          </p>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Detaylı Rapor <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAdminDashboard;
