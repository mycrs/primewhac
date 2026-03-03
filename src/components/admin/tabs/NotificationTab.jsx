import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/admin/AdminFormControls';

export const NotificationTab = ({ siteData, setSiteData }) => {
    const { globalAlert = { enabled: false, message: '' } } = siteData;
    const { setGlobalAlert } = setSiteData;

    const handleToggle = (checked) => {
        if (setGlobalAlert) {
            setGlobalAlert(prev => ({...prev, enabled: checked}));
        }
    };

    const handleMessageChange = (e) => {
        if (setGlobalAlert) {
            setGlobalAlert(prev => ({...prev, message: e.target.value}));
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Uyarı Mesajı Ayarları</h3>
            <div className="glass-effect rounded-lg p-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <Switch id="notification-enabled" checked={globalAlert.enabled} onCheckedChange={handleToggle} />
                    <Label htmlFor="notification-enabled" className="text-gray-200">Uyarı Mesajını Aktif Et</Label>
                </div>
                
                {globalAlert.enabled && (
                    <Textarea 
                        label="Görünecek Mesaj" 
                        name="message" 
                        value={globalAlert.message} 
                        onChange={handleMessageChange}
                        placeholder="Örn: Sitemize hoş geldiniz! Yeni paketlerimizi gördünüz mü?"
                    />
                )}
            </div>
        </div>
    );
}

export default NotificationTab;