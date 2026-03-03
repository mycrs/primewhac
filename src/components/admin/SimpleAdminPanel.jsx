
import React from 'react';
import SimpleAdminHeader from './SimpleAdminHeader';
import AdminDashboard from './AdminDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

const SimpleAdminPanel = ({ onLogout }) => {
  return (
    <div className="flex flex-col min-h-[60vh] max-h-[90vh] bg-[#05050A] rounded-lg overflow-hidden">
      <SimpleAdminHeader onLogout={onLogout} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ErrorBoundary>
          <AdminDashboard />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SimpleAdminPanel;
