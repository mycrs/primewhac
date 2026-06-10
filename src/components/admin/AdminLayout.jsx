import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { 
  LayoutDashboard, Tv, Package, FileText, HelpCircle, Home,
  Settings, Menu, X, ArrowLeft, Wrench, LogOut, Users, Bell,
  MessageCircle, Star, Shield, MonitorPlay
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAdminIdleLogout } from '@/hooks/useAdminIdleLogout';
import { usePendingCustomersCount } from '@/hooks/usePendingCustomersCount';
import { toast } from '@/components/ui/use-toast';
import SupabaseConnectionStatus from './SupabaseConnectionStatus';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH, adminPath } from '@/constants/adminRoutes';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const pendingCustomers = usePendingCustomersCount();

  const handleIdleLogout = useCallback(async () => {
    await signOut();
    toast({
      title: 'Oturum kapatıldı',
      description: '30 dakika işlem yapılmadığı için güvenlik nedeniyle çıkış yapıldı.',
    });
    navigate(ADMIN_LOGIN_PATH);
  }, [signOut, navigate]);

  useAdminIdleLogout({
    enabled: Boolean(user && isAdmin),
    userId: user?.id,
    timeoutMs: 30 * 60 * 1000,
    onIdle: handleIdleLogout,
  });

  const navItems = [
    { name: 'Dashboard', path: ADMIN_BASE_PATH, icon: LayoutDashboard },
    { name: 'Ana sayfa Hero', path: adminPath('hero'), icon: Home },
    { name: 'IPTV cihazları (test/sipariş)', path: adminPath('iptv-cihazlari'), icon: MonitorPlay },
    { name: 'Kanallar', path: adminPath('channels'), icon: Tv },
    { name: 'Paketler', path: adminPath('packages'), icon: Package },
    { name: 'Müşteriler', path: adminPath('customers'), icon: Users, badgeCount: pendingCustomers },
    { name: 'Blog', path: adminPath('blog'), icon: FileText },
    { name: 'Duyurular', path: adminPath('notifications'), icon: Bell },
    { name: 'ChatBot', path: adminPath('chatbot'), icon: MessageCircle },
    { name: 'Kurulum', path: adminPath('setup'), icon: Wrench },
    { name: 'SSS', path: adminPath('faqs'), icon: HelpCircle },
    { name: 'Yorumlar', path: adminPath('reviews'), icon: Star },
    { name: 'Takım logoları', path: adminPath('team-logos'), icon: Shield },
    { name: 'Ayarlar', path: adminPath('settings'), icon: Settings },
  ];

  return (
    <>
      <SEOHead title="Admin Panel | QruzeTV" noindex />
      <div className="min-h-screen bg-[#05050A] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <img src={BRAND_LOGO_URL} alt="QruzeTV logo" className="h-10 w-auto" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const customersSection = item.path === adminPath('customers');
            const active = customersSection
              ? location.pathname.startsWith(adminPath('customers'))
              : location.pathname === item.path;
            const badge =
              customersSection && item.badgeCount > 0 ? (
                <span className="ml-auto min-w-[1.25rem] rounded-full bg-amber-500/90 px-1.5 py-0.5 text-center text-[10px] font-bold text-black">
                  {item.badgeCount > 99 ? '99+' : item.badgeCount}
                </span>
              ) : null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium flex-1 text-left">{item.name}</span>
                {badge}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => signOut().then(() => navigate(ADMIN_LOGIN_PATH))}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-6 gap-4">
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
    </>
  );
};

export default AdminLayout;
