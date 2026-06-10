
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimpleAdminHeader = ({ onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="font-bold text-white text-lg">A</span>
        </div>
        <h1 className="text-lg font-bold text-white">Admin Panel</h1>
      </div>
      <Button 
        variant="ghost" 
        onClick={onLogout}
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[44px]"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Çıkış
      </Button>
    </header>
  );
};

export default SimpleAdminHeader;
