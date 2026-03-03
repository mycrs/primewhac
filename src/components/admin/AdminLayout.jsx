
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Tv, Package, FileText, HelpCircle, 
  Settings, Menu, X, ArrowLeft, Wrench, LogOut, User, Bell,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import SupabaseConnectionStatus from './SupabaseConnectionStatus';
import GeminiConnectionStatus from './GeminiConnectionStatus';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Kanallar', path: '/admin/channels', icon: Tv },
    { name: 'Paketler', path: '/admin/packages', icon: Package },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Duyurular', path: '/admin/notifications', icon: Bell },
    { name: 'ChatBot', path: '/admin/chatbot', icon: MessageCircle },
    { name: 'Kurulum', path: '/admin/setup', icon: Wrench },
    { name: 'SSS', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Ayarlar', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F1E] border-r border-white/10 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <img src={NEW_LOGO_URL} alt="QRUZE TV Admin" className="h-10 w-auto" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => signOut().then(() => navigate('/admin-login'))}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0F0F1E] border-b border-white/10 flex items-center justify-between px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">Sistem Durumu:</span>
              <div className="flex items-center gap-2" title="Supabase veritabanı">
                <span className="text-[10px] text-slate-500 hidden md:inline">Supabase</span>
                <SupabaseConnectionStatus />
              </div>
              <div className="flex items-center gap-2" title="Gemini API">
                <span className="text-[10px] text-slate-500 hidden md:inline">Gemini</span>
                <GeminiConnectionStatus />
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-gray-400">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Siteye Dön</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
