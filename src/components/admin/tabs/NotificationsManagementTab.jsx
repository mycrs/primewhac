
import React, { useEffect, useState } from 'react';
import { useNotificationManager } from '@/hooks/useNotificationManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import NotificationForm from '../NotificationForm';
import { NOTIFICATION_THEME_LABELS, resolveNotificationTheme } from '@/utils/notificationBannerTheme';

const NotificationsManagementTab = () => {
  const {
    notifications,
    loading: managerLoading,
    error: managerError,
    fetchNotifications,
    updateNotification,
    deleteNotification,
  } = useNotificationManager();
  const { user } = useAuth();
  const canManage = Boolean(user);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleEdit = (notif) => {
    setCurrentNotification(notif);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentNotification(null);
    setIsEditing(true);
  };

  const handleSaveSuccess = async () => {
    setIsEditing(false);
    setCurrentNotification(null);
    await fetchNotifications();
  };

  const handleDelete = async (id) => {
    if (confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
      const res = await deleteNotification(id);
      if (res?.success === false && res?.error) {
        toast({ variant: 'destructive', title: 'Hata', description: res.error });
      }
    }
  };

  const handleToggleActive = async (notif) => {
    const nextActive = !notif.active;
    setTogglingId(notif.id);
    const res = await updateNotification(notif.id, { active: nextActive }, { silent: true });
    setTogglingId(null);
    if (res?.success) {
      toast({
        title: nextActive ? 'Duyuru açıldı' : 'Duyuru kapatıldı',
        description: nextActive
          ? 'Aktif duyuru, ~3 sn sonra sitede gösterilir (oturumda bir kez).'
          : 'Duyuru artık ziyaretçilere gösterilmez.',
      });
    } else if (res?.error) {
      toast({ variant: 'destructive', title: 'Hata', description: res.error });
    }
  };

  if (managerLoading && notifications.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Duyuru Yönetimi</h2>
          <p className="text-sm text-slate-400 mt-1">
            Ziyaretçi duyurusu (~3 sn gecikme). Test popup&apos;ı (ExitIntent) ayrıdır, değiştirilmez.
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={isEditing || !canManage} className="bg-primary hover:bg-primary text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Yeni Duyuru
        </Button>
      </div>

      {managerError && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {managerError}
        </div>
      )}

      {isEditing && (
        <NotificationForm
          initialData={currentNotification}
          onSave={currentNotification ? async (data) => {
             const res = await updateNotification(currentNotification.id, data);
             if(res.success) handleSaveSuccess();
          } : handleSaveSuccess}
          onCancel={() => {
            setIsEditing(false);
            setCurrentNotification(null);
          }}
        />
      )}

      <div className="bg-[#0a0a0a] rounded-xl border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Başlık</TableHead>
              <TableHead className="text-slate-400">Mesaj</TableHead>
              <TableHead className="text-slate-400">Tema</TableHead>
              <TableHead className="text-slate-400">Tip / Renk</TableHead>
              <TableHead className="text-slate-400">Yayın</TableHead>
              <TableHead className="text-right text-slate-400">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map(notif => (
              <TableRow key={notif.id} className="border-slate-800">
                <TableCell className="font-medium text-white">{notif.title || '-'}</TableCell>
                <TableCell className="text-slate-300 max-w-[200px] truncate">{notif.message}</TableCell>
                <TableCell className="text-slate-300">
                  {NOTIFICATION_THEME_LABELS[resolveNotificationTheme(notif.theme)] || 'Genel Bilgi'}
                </TableCell>
                <TableCell className="text-slate-400">
                  <span className="capitalize">{notif.type}</span> / <span className="capitalize">{notif.color}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Switch
                      disabled={!canManage || togglingId === notif.id}
                      checked={!!notif.active}
                      onCheckedChange={() => handleToggleActive(notif)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      notif.active ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                    }`}>
                      {togglingId === notif.id ? '...' : notif.active ? 'Açık' : 'Kapalı'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(notif)} disabled={!canManage}>
                    <Edit className="w-4 h-4 text-blue-400" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(notif.id)} disabled={!canManage}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {notifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8">Kayıtlı duyuru bulunamadı.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NotificationsManagementTab;
