import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from './AdminSidebar';
import * as Tabs from './AdminTabs';
import ChatBotManagementTab from '@/components/admin/tabs/ChatBotManagementTab';

// Error boundary wrapper for tabs
class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg border border-red-500/30">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Bileşen Yüklenemedi</h3>
          <p className="text-slate-400 text-center">Bu sekmeyi yüklerken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminPanel = ({ onClose, siteData, setSiteData }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/chatbot') {
      setActiveTab('chatbot');
    } else if (path === '/admin/channels') {
      setActiveTab('channels');
    } else if (path === '/admin/packages') {
      setActiveTab('packages');
    } else if (path === '/admin/blog') {
      setActiveTab('blog');
    } else if (path === '/admin/notifications') {
      setActiveTab('notification');
    } else if (path === '/admin/setup') {
      setActiveTab('installation');
    } else if (path === '/admin/faqs') {
      setActiveTab('faq');
    } else if (path === '/admin/settings') {
      setActiveTab('settings');
    } else if (path === '/admin') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Map IDs to Components
  const tabComponents = {
    dashboard: Tabs.DashboardTab,
    welcome_images: Tabs.WelcomeImageTab,
    font_optimization: Tabs.FontOptimizationTab,
    content_stats: Tabs.ContentStatsTab,
    hero: Tabs.HeroTab,
    packages: Tabs.PackagesTab,
    channels: Tabs.ChannelsTab,
    movies: Tabs.MoviesTab,
    blog: Tabs.BlogTab,
    blog_comments: Tabs.CommentsManagementTab,
    blog_seo: Tabs.BlogSeoTab,
    detailedGuides: Tabs.DetailedGuidesTab,
    faq: Tabs.FaqTab,
    texts: Tabs.SiteTextsTab,
    contact: Tabs.ContactTab,
    footer: Tabs.FooterTab,
    seo: Tabs.SeoTab,
    sitemap: Tabs.SitemapManagementTab,
    legal: Tabs.LegalPagesTab,
    chatbot: ChatBotManagementTab,
    installation: Tabs.InstallationTab,
    apps: Tabs.AppsTab,
    reseller: Tabs.ResellerTab,
    test: Tabs.TestTab,
    notification: Tabs.NotificationTab,
  };

  const ActiveComponent = tabComponents[activeTab] || Tabs.DashboardTab;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-0">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="bg-slate-950 w-full h-full overflow-hidden flex shadow-2xl relative"
      >
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 relative md:ml-64 w-full">
          
          {/* Mobile Header */}
          <div className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-30">
             <div className="font-semibold text-white capitalize">{activeTab.replace(/_/g, ' ')}</div>
             <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="h-5 w-5 text-white" />
             </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0B0B15]">
            <div className="max-w-7xl mx-auto pb-20">
              <TabErrorBoundary>
                <Suspense fallback={<div className="text-white p-4 flex items-center justify-center min-h-[200px]">Yükleniyor...</div>}>
                  {/* Pass siteData and setSiteData to the active tab component */}
                  <ActiveComponent siteData={siteData} setSiteData={setSiteData} />
                </Suspense>
              </TabErrorBoundary>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminPanel;