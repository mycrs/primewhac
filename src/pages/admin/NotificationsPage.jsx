
import React from 'react';
import NotificationsTab from '@/components/admin/tabs/NotificationsTab';
import ErrorBoundary from '@/components/ErrorBoundary';

const NotificationsPage = () => {
  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-2">Bildirim Yönetimi</h1>
          <p className="text-slate-400">
            Sitede gösterilen tüm bildirimleri (uyarı, duyuru, promosyon vb.) bu sayfadan yönetebilirsiniz. 
            Aktif olan bildirimler, belirlediğiniz tarih aralığında ziyaretçilere gösterilir.
          </p>
        </div>
        
        <NotificationsTab />
      </div>
    </ErrorBoundary>
  );
};

export default NotificationsPage;
