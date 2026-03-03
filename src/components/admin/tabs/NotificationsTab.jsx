import React from 'react';
import AdminTabWrapper from '../AdminTabWrapper';
import { Bell } from 'lucide-react';
import NotificationsManagementTab from './NotificationsManagementTab';

const NotificationsTab = () => {
  return (
    <AdminTabWrapper 
      title="Bildirimler (Banner)" 
      description="Sitede gösterilecek bildirimleri ve uyarıları yönetin." 
      icon={Bell}
    >
      <NotificationsManagementTab />
    </AdminTabWrapper>
  );
};

export default NotificationsTab;