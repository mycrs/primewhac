
import React, { useState, useEffect, Suspense, lazy } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load all tabs dynamically to manage bundle size and avoid broken direct imports
const SimpleAdminDashboard = lazy(() => import('@/components/admin/SimpleAdminDashboard'));
const PackagesTab = lazy(() => import('@/components/admin/tabs/PackagesTab').then(m => ({ default: m.default || m.PackagesTab })));
const ChannelsTab = lazy(() => import('@/components/admin/tabs/ChannelsTab').then(m => ({ default: m.default || m.ChannelsTab })));
const MoviesTab = lazy(() => import('@/components/admin/tabs/MoviesTab').then(m => ({ default: m.default || m.MoviesTab })));
const BlogTab = lazy(() => import('@/components/admin/tabs/BlogTab').then(m => ({ default: m.default || m.BlogTab })));
const FaqTab = lazy(() => import('@/components/admin/tabs/FaqTab').then(m => ({ default: m.default || m.FaqTab })));
const SetupPageTab = lazy(() => import('@/components/admin/tabs/SetupPageTab').then(m => ({ default: m.default || m.SetupPageTab })));
const AppsTab = lazy(() => import('@/components/admin/tabs/AppsTab').then(m => ({ default: m.default || m.AppsTab })));
const ResellerTab = lazy(() => import('@/components/admin/tabs/ResellerTab').then(m => ({ default: m.default || m.ResellerTab })));
const TestTab = lazy(() => import('@/components/admin/tabs/TestTab').then(m => ({ default: m.default || m.TestTab })));
const ChatBotTab = lazy(() => import('@/components/admin/tabs/ChatBotTab').then(m => ({ default: m.default || m.ChatBotTab })));
const SitemapManagementTab = lazy(() => import('@/components/admin/tabs/SitemapManagementTab').then(m => ({ default: m.default || m.SitemapManagementTab })));
const ContentStatsTab = lazy(() => import('@/components/admin/tabs/ContentStatsTab').then(m => ({ default: m.default || m.ContentStatsTab })));
const UsersTab = lazy(() => import('@/components/admin/tabs/UsersTab').then(m => ({ default: m.default || m.UsersTab })));
const SiteTextsTab = lazy(() => import('@/components/admin/tabs/SiteTextsTab').then(m => ({ default: m.default || m.SiteTextsTab })));
const ContactTab = lazy(() => import('@/components/admin/tabs/ContactTab').then(m => ({ default: m.default || m.ContactTab })));
const FooterTab = lazy(() => import('@/components/admin/tabs/FooterTab').then(m => ({ default: m.default || m.FooterTab })));
const SeoTab = lazy(() => import('@/components/admin/tabs/SeoTab').then(m => ({ default: m.default || m.SeoTab })));
const LegalPagesTab = lazy(() => import('@/components/admin/tabs/LegalPagesTab').then(m => ({ default: m.default || m.LegalPagesTab })));
const HeroTab = lazy(() => import('@/components/admin/tabs/HeroTab').then(m => ({ default: m.default || m.HeroTab })));
const WelcomeImageTab = lazy(() => import('@/components/admin/tabs/WelcomeImageTab').then(m => ({ default: m.default || m.WelcomeImageTab })));
const NotificationTab = lazy(() => import('@/components/admin/tabs/NotificationTab').then(m => ({ default: m.default || m.NotificationTab })));
const CommentsManagementTab = lazy(() => import('@/components/admin/tabs/CommentsManagementTab').then(m => ({ default: m.default || m.CommentsManagementTab })));
const BlogSeoTab = lazy(() => import('@/components/admin/tabs/BlogSeoTab').then(m => ({ default: m.default || m.BlogSeoTab })));
const DetailedGuidesTab = lazy(() => import('@/components/admin/tabs/DetailedGuidesTab').then(m => ({ default: m.default || m.DetailedGuidesTab })));

const AdminPanel = ({ siteData = {}, setSiteData = () => {}, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    console.log("AdminPanel mounted. activeTab:", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    if (onClose) onClose();
    else window.location.href = '/';
  };

  const TabLoader = () => (
    <div className="flex items-center justify-center h-64 w-full">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
    </div>
  );

  const renderActiveTab = () => {
    const props = { siteData, setSiteData };
    switch(activeTab) {
        case 'dashboard': return <SimpleAdminDashboard {...props} />;
        case 'packages': return <PackagesTab {...props} />;
        case 'channels': return <ChannelsTab {...props} />;
        case 'movies': return <MoviesTab {...props} />;
        case 'blog': return <BlogTab {...props} />;
        case 'blog_comments': return <CommentsManagementTab {...props} />;
        case 'faq': return <FaqTab {...props} />;
        case 'installation': return <SetupPageTab {...props} />;
        case 'apps': return <AppsTab {...props} />;
        case 'reseller': return <ResellerTab {...props} />;
        case 'test': return <TestTab {...props} />;
        case 'chatbot': return <ChatBotTab {...props} />;
        case 'sitemap': return <SitemapManagementTab {...props} />;
        case 'welcome_images': return <WelcomeImageTab {...props} />;
        case 'content_stats': return <ContentStatsTab {...props} />;
        case 'users': return <UsersTab {...props} />;
        case 'texts': return <SiteTextsTab {...props} />;
        case 'contact': return <ContactTab {...props} />;
        case 'footer': return <FooterTab {...props} />;
        case 'seo': return <SeoTab {...props} />;
        case 'legal_pages': return <LegalPagesTab {...props} />;
        case 'hero': return <HeroTab {...props} />;
        case 'blog_seo': return <BlogSeoTab {...props} />;
        case 'detailed_guides': return <DetailedGuidesTab {...props} />;
        case 'notification': return <NotificationTab {...props} />;
        default: return <SimpleAdminDashboard {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#05050A] z-[100] overflow-y-auto">
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        onClose={onClose}
      >
        <ErrorBoundary key={activeTab}>
            <Suspense fallback={<TabLoader />}>
                {renderActiveTab()}
            </Suspense>
        </ErrorBoundary>
      </AdminLayout>
    </div>
  );
};

export default React.memo(AdminPanel);
