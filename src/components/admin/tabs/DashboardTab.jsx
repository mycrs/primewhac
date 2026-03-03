import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Tv, Film, Package, Activity, ArrowRight,
  TrendingUp, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, color, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl blur-xl transition-opacity opacity-50 group-hover:opacity-100" />
    <Card className="relative border-white/5 bg-[#131326] hover:bg-[#1A1A32] transition-colors overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
             <div className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
               <TrendingUp className="w-3 h-3" />
               {trend}
             </div>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
        </div>
        {/* Decorative background icon */}
        <Icon className={`absolute -right-4 -bottom-4 w-24 h-24 text-${color}-500/5 group-hover:text-${color}-500/10 transition-colors`} />
      </CardContent>
    </Card>
  </motion.div>
);

const ActivityItem = ({ title, desc, time, type }) => (
  <div className="flex gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
      type === 'success' ? 'bg-green-500/10 text-green-400' :
      type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
      'bg-blue-500/10 text-blue-400'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
       type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
       <Activity className="w-5 h-5" />}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-gray-200 truncate">{title}</h4>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
  </div>
);

export const DashboardTab = ({ siteData }) => {
  const [stats, setStats] = useState({
    channels: 0,
    movies: 0,
    packages: 0,
    users: 0
  });

  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    // Populate stats from siteData
    setStats({
      channels: siteData.channelsData?.length || 0,
      movies: siteData.moviesData?.length || 0,
      packages: (siteData.packagesData?.turkiye?.length || 0) + (siteData.packagesData?.avrupa?.length || 0),
      users: 154 // Static for now, or fetch from DB
    });

    const fetchRequests = async () => {
      const { data } = await supabase
        .from('test_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setRecentRequests(data);
    };

    fetchRequests();
  }, [siteData]);

  // Simple Chart Visualization (CSS Bars)
  const chartData = [65, 45, 75, 55, 85, 95, 70];
  const maxVal = Math.max(...chartData);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz, Admin 👋</h1>
          <p className="text-gray-400">Panel genel durum özeti ve istatistikler.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Activity className="w-4 h-4 mr-2" />
            Rapor Al
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Kanal" 
          value={stats.channels} 
          icon={Tv} 
          color="blue"
          trend="+12%"
          delay={0.1}
        />
        <StatCard 
          title="Film Arşivi" 
          value={stats.movies} 
          icon={Film} 
          color="purple"
          trend="+5%"
          delay={0.2}
        />
        <StatCard 
          title="Aktif Paketler" 
          value={stats.packages} 
          icon={Package} 
          color="green"
          delay={0.3}
        />
        <StatCard 
          title="Kayıtlı Kullanıcı" 
          value={stats.users} 
          icon={Users} 
          color="pink"
          trend="+24"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 border-white/5 bg-[#131326]">
          <CardHeader>
            <CardTitle className="text-white">Haftalık Ziyaretçi Analizi</CardTitle>
            <CardDescription className="text-gray-400">Son 7 günlük tekil ziyaretçi verileri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-4 pt-10 px-4">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxVal) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-gradient-to-t from-purple-600 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity relative"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    </motion.div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Gn {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-white/5 bg-[#131326]">
          <CardHeader>
            <CardTitle className="text-white">Son İşlemler</CardTitle>
            <CardDescription className="text-gray-400">En son gelen test talepleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentRequests.length === 0 ? (
               <div className="text-center py-8 text-gray-500">Henüz aktivite yok.</div>
            ) : (
               recentRequests.map((req, i) => (
                 <ActivityItem 
                   key={req.id || i}
                   title={req.username || 'Anonim'}
                   desc={`${req.category} talebi oluşturuldu`}
                   time="Bugün"
                   type="success"
                 />
               ))
            )}
            <Button variant="ghost" className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
              Tümünü Gör <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;