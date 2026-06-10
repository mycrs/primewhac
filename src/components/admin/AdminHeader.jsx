
import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';

const AdminHeader = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/10 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden text-gray-400">
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={BRAND_LOGO_URL} alt="QruzeTV logo" className="h-10 w-auto object-contain" />
          <span className="text-lg font-bold text-white hidden sm:block border-l border-white/20 pl-3">Panel</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          Siteye Git
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
