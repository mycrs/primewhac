
import React, { useState } from 'react';
import { Tv, Plus, Radio, Signal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ChannelsManager from './ChannelsManager';

const AdminChannelsTab = () => {
  const [triggerAddCounter, setTriggerAddCounter] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, categories: {} });

  const handleAddNew = () => {
    setTriggerAddCounter(prev => prev + 1);
  };

  const topCategories = Object.entries(stats.categories || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Tv className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kanal Yönetimi</h1>
            <p className="text-sm text-slate-400 mt-1">IPTV kanal listesini, kategorileri ve logoları gerçek zamanlı yönetin.</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Yeni Kanal Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <Radio className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Toplam Kanal</p>
              <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-full">
              <Signal className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Aktif Kanallar</p>
              <h3 className="text-2xl font-bold text-white">{stats.active}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-4 bg-orange-500/10 rounded-full shrink-0">
              <Filter className="w-6 h-6 text-orange-400" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-slate-400 mb-2">Popüler Kategoriler</p>
              {topCategories.length > 0 ? (
                <div className="space-y-1">
                  {topCategories.map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-slate-500 font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-500">Veri yok</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ChannelsManager triggerAdd={triggerAddCounter} setChannelStats={setStats} />
    </div>
  );
};

export default AdminChannelsTab;
