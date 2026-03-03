
import React, { useEffect, useState } from 'react';
import { useNotificationManager } from '@/hooks/useNotificationManager';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import NotificationForm from '../NotificationForm';

const NotificationsManagementTab = () => {
  const { notifications, loading: managerLoading, fetchNotifications, updateNotification, deleteNotification } = useNotificationManager();
  const { checkAdminStatus } = useAdminCheck();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user?.email) {
        const { isAdmin: adminStatus } = await checkAdminStatus(user.email);
        setIsAdmin(adminStatus);
      }
      setAdminChecked(true);
    };
    verifyAdmin();
  }, [user, checkAdminStatus]);

  const handleEdit = (notif) => {
    setCurrentNotification(notif);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentNotification(null);
    setIsEditing(true);
  };

  const handleSaveSuccess = async (data) => {
    setIsEditing(false);
    setCurrentNotification(null);
    await fetchNotifications();
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Bu işlem için yönetici yetkiniz bulunmuyor.' });
      return;
    }
    if (confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
      const res = await deleteNotification(id);
      if (res?.success === false && res?.error) {
        toast({ variant: 'destructive', title: 'Hata', description: res.error });
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    if (!isAdmin) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Bu işlem için yönetici yetkiniz bulunmuyor.' });
      return;
    }
    const res = await updateNotification(id, { active: !currentStatus });
    if (res?.success === false && res?.error) {
      toast({ variant: 'destructive', title: 'Hata', description: res.error });
    }
  };

  if (!adminChecked || (managerLoading && notifications.length === 0)) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Bildirim Yönetimi</h2>
        <Button onClick={handleAddNew} disabled={isEditing || !isAdmin} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
        </Button>
      </div>

      {!isAdmin && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
          Sadece yöneticiler bildirim ekleyebilir, silebilir veya güncelleyebilir.
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

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Başlık</TableHead>
              <TableHead className="text-slate-400">Mesaj</TableHead>
              <TableHead className="text-slate-400">Tip / Renk</TableHead>
              <TableHead className="text-slate-400">Durum</TableHead>
              <TableHead className="text-right text-slate-400">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map(notif => (
              <TableRow key={notif.id} className="border-slate-800">
                <TableCell className="font-medium text-white">{notif.title || '-'}</TableCell>
                <TableCell className="text-slate-300 max-w-[200px] truncate">{notif.message}</TableCell>
                <TableCell className="text-slate-400">
                  <span className="capitalize">{notif.type}</span> / <span className="capitalize">{notif.color}</span>
                </TableCell>
                <TableCell>
                  <Switch 
                    disabled={!isAdmin}
                    checked={notif.active} 
                    onCheckedChange={() => handleToggleActive(notif.id, notif.active)} 
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(notif)} disabled={!isAdmin}>
                    <Edit className="w-4 h-4 text-blue-400" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(notif.id)} disabled={!isAdmin}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {notifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">Kayıtlı bildirim bulunamadı.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NotificationsManagementTab;
