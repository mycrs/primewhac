
import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F0F1E] border-b border-white/10 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden text-gray-400">
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={NEW_LOGO_URL} alt="QRUZE TV Admin" className="h-10 w-auto object-contain" />
          <span className="text-lg font-bold text-white hidden sm:block border-l border-white/20 pl-3">Panel</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
          Siteye Git
        </Button>
        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
