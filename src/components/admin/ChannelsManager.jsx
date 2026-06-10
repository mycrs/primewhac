
import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, AlertCircle, RefreshCw, Database } from 'lucide-react';
import ChannelForm from './ChannelForm';
import ChannelsList from './ChannelsList';
import ChannelsSearch from './ChannelsSearch';
import { seedChannelsToSupabase } from '@/utils/seedChannels';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';

const ChannelsManager = ({ triggerAdd, setChannelStats }) => {
  const { channels, loading, error, refetch, deleteChannel } = useChannelsRealtime({ enableRealtime: true });
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (setChannelStats && channels) {
      const categories = {};
      channels.forEach(c => {
        if (c.category) {
          categories[c.category] = (categories[c.category] || 0) + 1;
        }
      });
      setChannelStats({
        total: channels.length,
        active: channels.filter(c => c.is_active).length,
        categories
      });
    }
  }, [channels, setChannelStats]);

  useEffect(() => {
    if (triggerAdd > 0) {
      handleAdd();
    }
  }, [triggerAdd]);

  const uniqueCategories = useMemo(() => {
    const defaultCats = ['Genel', 'Spor', 'Haber', 'Çocuk', 'Belgesel', 'Sinema', 'Müzik'];
    const dbCats = channels.map(c => c.category).filter(Boolean);
    return [...new Set([...defaultCats, ...dbCats])].sort();
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesSearch = 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (channel.description && channel.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = filters.category === 'all' || channel.category === filters.category;
      const matchesStatus = filters.status === 'all' || 
                            (filters.status === 'active' && channel.is_active) || 
                            (filters.status === 'inactive' && !channel.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [channels, searchQuery, filters]);

  const handleAdd = () => {
    setEditingChannel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (channel) => {
    setEditingChannel(channel);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
  };

  const handleSeedChannels = async () => {
    setIsSeeding(true);
    const result = await seedChannelsToSupabase();
    setIsSeeding(false);
    
    if (result.success) {
      if (result.count > 0) {
        toast({ title: 'Başarılı', description: result.message });
        refetch();
      } else {
        toast({ title: 'Bilgi', description: result.message });
      }
    } else {
      toast({ variant: 'destructive', title: 'Hata', description: result.error });
    }
  };

  if (error && channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a] border border-slate-800 rounded-xl">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-white font-medium mb-2">Kanallar yüklenirken bir hata oluştu</p>
        <p className="text-slate-400 mb-6 text-sm">{error}</p>
        <Button onClick={refetch} className="bg-primary hover:bg-primary text-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Tekrar Dene
        </Button>
      </div>
    );
  }

  // Inject real-time delete capability into ChannelsList, assuming it has a delete logic internally but wait...
  // In previous step ChannelsList uses supabase.from('channels').delete().eq('id', deleteId);
  // That will trigger the real-time event and update our list here automatically!
  // So ChannelsList works fine as is.
  
  return (
    <div className="space-y-6">
      {channels.length < 5 && !loading && (
        <div className="bg-[#0a0a0a]/20 border border-blue-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-blue-400 font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Örnek Kanalları Yükle
            </h3>
            <p className="text-sm text-blue-300/70 mt-1">
              Sistemde az sayıda kanal var. Test etmek için örnek Türk kanallarını (TRT, ATV vb.) tek tıkla yükleyebilirsiniz.
            </p>
          </div>
          <Button 
            onClick={handleSeedChannels} 
            disabled={isSeeding} 
            className="bg-[#141414] hover:bg-[#0a0a0a] text-white whitespace-nowrap"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Örnek Kanalları Yükle
          </Button>
        </div>
      )}

      <ChannelsSearch 
        onSearch={setSearchQuery} 
        onFilterChange={setFilters}
        filters={filters}
        categories={uniqueCategories}
        resultCount={filteredChannels.length} 
      />

      <ChannelsList 
        channels={filteredChannels} 
        onEdit={handleEdit} 
        onRefresh={refetch} 
        isLoading={loading}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-slate-800 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingChannel ? 'Kanalı Düzenle' : 'Yeni Kanal Ekle'}</DialogTitle>
          </DialogHeader>
          <ChannelForm 
            channel={editingChannel} 
            onSuccess={handleFormSuccess} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelsManager;
