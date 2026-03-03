import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Image, Type, BarChart2, Users, Phone, AppWindow, Search, 
  Home, Package, Tv, Film, BookText, HelpCircle, Settings, Smartphone, MessageSquare, BellRing, 
  ChevronDown, ChevronRight, LogOut, Globe, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SidebarItem = ({ icon: Icon, label, isActive, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors",
      isActive 
        ? "bg-purple-600/20 text-purple-400" 
        : "text-gray-400 hover:bg-white/5 hover:text-white",
      className
    )}
  >
    <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-purple-400" : "text-gray-500")} />
    <span className="truncate text-left">{label}</span>
  </button>
);

const SidebarSection = ({ title, items, activeTab, onTabClick, isOpen, onToggle }) => {
  const location = useLocation();
  
  return (
    <div className="mb-2">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-3 min-h-[44px] text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300"
      >
        {title}
        {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
      </button>
      {isOpen && (
        <div className="space-y-1">
          {items.map(item => {
            // Check for explicit link override first (as requested for the chatbot link)
            if (item.href) {
              return (
                <a 
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    location.pathname === item.href
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            }

            return (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => onTabClick(item.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const [sectionsOpen, setSectionsOpen] = useState({
    content: true,
    settings: false,
    features: true
  });
  
  const toggleSection = (section) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768) onClose();
  };

  const menuData = {
    content: [
      { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
      { id: 'packages', label: 'Paketler', icon: Package },
      { id: 'channels', label: 'Kanal Listesi', icon: Tv },
      { id: 'movies', label: 'Filmler & Diziler', icon: Film },
      { id: 'blog', label: 'Blog Yazıları', icon: BookText },
      { id: 'blog_comments', label: 'Yorum Yönetimi', icon: MessageCircle },
      { id: 'content_stats', label: 'İstatistikler', icon: BarChart2 },
      { id: 'users', label: 'Kullanıcılar', icon: Users },
    ],
    settings: [
      { id: 'hero', label: 'Hero Alanı', icon: Home },
      { id: 'footer', label: 'Footer', icon: AppWindow },
      { id: 'contact', label: 'İletişim', icon: Phone },
      { id: 'texts', label: 'Metinler', icon: Type },
      { id: 'seo', label: 'SEO', icon: Search },
      { id: 'welcome_images', label: 'Karşılama', icon: Image },
    ],
    features: [
      { id: 'notification', label: 'Bildirimler', icon: BellRing },
      { id: 'chatbot', label: 'ChatBot Yönetimi', icon: MessageCircle, href: '/admin/chatbot' },
      { id: 'installation', label: 'Kurulum', icon: Settings },
      { id: 'faq', label: 'S.S.S', icon: HelpCircle },
      { id: 'apps', label: 'Uygulamalar', icon: Smartphone },
      { id: 'reseller', label: 'Bayilik', icon: Users },
    ]
  };

  // Allow determining active state via location path for deep links, falling back to activeTab prop
  const currentActiveTab = location.pathname.includes('/admin/chatbot') ? 'chatbot' : activeTab;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-[280px] md:w-64 bg-[#0B0B15] border-r border-white/10 z-50 transition-transform duration-200 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-4 md:px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 text-white font-bold text-lg">
             <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm">
               TR
             </div>
             <span>Admin Panel</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <SidebarSection 
            title="İçerik Yönetimi" 
            items={menuData.content}
            activeTab={currentActiveTab}
            onTabClick={handleItemClick}
            isOpen={sectionsOpen.content} 
            onToggle={() => toggleSection('content')}
          />
          <SidebarSection 
            title="Site Ayarları" 
            items={menuData.settings}
            activeTab={currentActiveTab}
            onTabClick={handleItemClick}
            isOpen={sectionsOpen.settings} 
            onToggle={() => toggleSection('settings')}
          />
          <SidebarSection 
            title="Özellikler" 
            items={menuData.features}
            activeTab={currentActiveTab}
            onTabClick={handleItemClick}
            isOpen={sectionsOpen.features} 
            onToggle={() => toggleSection('features')}
          />
        </div>

        <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
           <Button 
             variant="outline" 
             className="w-full justify-start text-gray-300 border-white/10 hover:bg-white/10 min-h-[44px]"
             onClick={onClose}
           >
             <Globe className="w-5 h-5 mr-3 shrink-0" />
             Siteye Dön
           </Button>
           <Button 
             variant="ghost" 
             className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[44px]"
             onClick={onLogout}
           >
             <LogOut className="w-5 h-5 mr-3 shrink-0" />
             Çıkış Yap
           </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;