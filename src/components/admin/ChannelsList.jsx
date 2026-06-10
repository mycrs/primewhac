
import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ChannelsList = ({ channels, onEdit, onRefresh, isLoading }) => {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('channels').delete().eq('id', deleteId);
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Kanal başarıyla silindi.' });
      onRefresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Kanal silinemedi: ' + error.message });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#0a0a0a] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-[100px]">Logo</TableHead>
              <TableHead className="w-[120px]">Arka Plan</TableHead>
              <TableHead>Kanal Bilgileri</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="border-slate-800">
                <TableCell><div className="w-12 h-12 bg-[#0a0a0a] animate-pulse rounded"></div></TableCell>
                <TableCell><div className="w-20 h-12 bg-[#0a0a0a] animate-pulse rounded"></div></TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#0a0a0a] animate-pulse rounded w-32"></div>
                    <div className="h-3 bg-[#0a0a0a]/50 animate-pulse rounded w-48"></div>
                  </div>
                </TableCell>
                <TableCell><div className="h-5 bg-[#0a0a0a] animate-pulse rounded w-16"></div></TableCell>
                <TableCell><div className="h-5 bg-[#0a0a0a] animate-pulse rounded w-12"></div></TableCell>
                <TableCell className="text-right"><div className="h-8 bg-[#0a0a0a] animate-pulse rounded w-16 ml-auto"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!channels || channels.length === 0) {
    return (
      <div className="text-center py-12 bg-[#0a0a0a] border border-slate-800 rounded-xl">
        <p className="text-slate-400">Kanal bulunamadı veya filtreleme sonuç vermedi.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#0a0a0a] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent whitespace-nowrap">
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead className="w-[120px]">Arka Plan</TableHead>
              <TableHead>Kanal Bilgileri</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id} className="border-slate-800 hover:bg-[#0a0a0a]/50 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded bg-black/40 border border-slate-700 flex items-center justify-center overflow-hidden">
                    {channel.logo_url ? (
                      <img
                        src={channel.logo_url}
                        alt="IPTV kanal logosu"
                        className="max-w-full max-h-full object-contain p-1"
                        onError={(e) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'block'; 
                        }} 
                      />
                    ) : null}
                    <ImageIcon className={`w-5 h-5 text-slate-500 ${channel.logo_url ? 'hidden' : 'block'}`} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-20 h-12 rounded bg-[#0a0a0a] border border-slate-700 flex items-center justify-center overflow-hidden relative">
                    {(channel.background_image_url || channel.image_url) ? (
                      <img 
                        src={channel.background_image_url || channel.image_url} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        onError={(e) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'block'; 
                        }} 
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center bg-[#0a0a0a] z-10 ${(channel.background_image_url || channel.image_url) ? 'hidden' : 'block'}`}>
                       <span className="text-[10px] text-slate-500">Yok</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white text-base whitespace-nowrap">{channel.name}</div>
                  {channel.description && (
                    <div className="text-sm text-slate-400 mt-1 line-clamp-1 max-w-xs" title={channel.description}>
                      {channel.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-[#0a0a0a]/50 text-slate-300 border-slate-700 whitespace-nowrap">
                    {channel.category || 'Belirtilmedi'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={channel.is_active ? 'default' : 'secondary'} className={channel.is_active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 whitespace-nowrap' : 'bg-[#0a0a0a] text-slate-300 whitespace-nowrap'}>
                    {channel.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(channel)} className="text-blue-400 hover:text-blue-300 hover:bg-[#141414]/10 h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(channel.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Kanalı Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Bu kanalı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-[#0a0a0a]">İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChannelsList;
