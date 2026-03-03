import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import GlobalAlert from '@/components/GlobalAlert';
import OrderModal from '@/components/OrderModal';
import TestFormModal from '@/components/TestFormModal';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { useSiteData } from '@/hooks/useSiteData';
import { OrderModalProvider } from '@/contexts/OrderModalContext';
import { TestModalProvider } from '@/contexts/TestModalContext';
import { PerformanceProvider } from '@/components/PerformanceOptimizer';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import WhatToWatchButton from '@/components/what-to-watch/WhatToWatchButton';
import NotificationBannerDisplay from '@/components/NotificationBannerDisplay';
import PageLoadingFallback from '@/components/PageLoadingFallback';
import ErrorBoundary from '@/components/ErrorBoundary';

import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ProtectedRoute from '@/components/ProtectedRoute';

// Ana sayfalar lazy değil: "/" ve "/de" ilk açılışta boş kalmasın (tek chunk)
import HomePage from '@/pages/HomePage';
import HomePageDE from '@/pages/HomePageDE';

// Route-Based Code Splitting
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const TestFormPage = lazy(() => import('@/pages/TestFormPage'));
const SitemapXmlPage = lazy(() => import('@/pages/SitemapXmlPage'));
const PackagesPage = lazy(() => import('@/pages/PackagesPage'));
const PackagesPageDE = lazy(() => import('@/pages/PackagesPageDE'));
const PackagesDE = lazy(() => import('@/components/PackagesDE'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AboutPageDE = lazy(() => import('@/pages/AboutPageDE'));
const InstallationPage = lazy(() => import('@/pages/InstallationPage'));
const SetupPageDE = lazy(() => import('@/pages/SetupPageDE'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const FaqPageDE = lazy(() => import('@/pages/FaqPageDE'));
const ResellerPage = lazy(() => import('@/pages/ResellerPage'));
const ResellerPageDE = lazy(() => import('@/pages/ResellerPageDE'));
const ChannelsPage = lazy(() => import('@/pages/ChannelsPage'));
const ChannelsPageDE = lazy(() => import('@/pages/ChannelsPageDE'));
const InstallationGuidePage = lazy(() => import('@/pages/InstallationGuidePage'));
const DetailedGuidesPage = lazy(() => import('@/pages/DetailedGuidesPage'));
const BlogListPage = lazy(() => import('@/pages/BlogListPage'));
const BlogPageDE = lazy(() => import('@/pages/BlogPageDE'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const BlogWritePage = lazy(() => import('@/pages/BlogWritePage'));
const M3uConverterPage = lazy(() => import('@/pages/M3uConverterPage'));
const M3uConverterPageDE = lazy(() => import('@/pages/M3uConverterPageDE'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const PrivacyPageDE = lazy(() => import('@/pages/PrivacyPageDE'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const TermsPageDE = lazy(() => import('@/pages/TermsPageDE'));
const SitemapPage = lazy(() => import('@/pages/SitemapPage'));
const BingVerificationPage = lazy(() => import('@/pages/BingVerificationPage'));
const ComparisonPage = lazy(() => import('@/pages/ComparisonPage'));
const GuidePage = lazy(() => import('@/pages/GuidePage'));
const GuidePageDE = lazy(() => import('@/pages/GuidePageDE'));
const WhatToWatchPage = lazy(() => import('@/pages/WhatToWatchPage'));
const WhatToWatchPageDE = lazy(() => import('@/pages/WhatToWatchPageDE'));
const WhatToWatchDetailPage = lazy(() => import('@/pages/WhatToWatchDetailPage'));
const WhatToWatchDetailPageDE = lazy(() => import('@/pages/WhatToWatchDetailPageDE'));
const TestPageDE = lazy(() => import('@/pages/TestPageDE'));
const MatchSchedulePage = lazy(() => import('@/pages/MatchSchedulePage'));
const MatchDetailPage = lazy(() => import('@/pages/MatchDetailPage'));
const MatchSchedulePageDE = lazy(() => import('@/pages/MatchSchedulePageDE'));
const MatchDetailPageDE = lazy(() => import('@/pages/MatchDetailPageDE'));

// Admin pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminChannelsTab = lazy(() => import('@/components/admin/AdminChannelsTab'));
const PackagesManager = lazy(() => import('@/components/admin/PackagesManager'));
const BlogManager = lazy(() => import('@/components/admin/BlogManager'));
const FAQManager = lazy(() => import('@/components/admin/FAQManager'));
const SetupManager = lazy(() => import('@/components/admin/tabs/SetupPageTab'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'));
const ChatBotManagementTab = lazy(() => import('@/components/admin/tabs/ChatBotManagementTab'));

function App() {
  const { siteData } = useSiteData(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <PerformanceProvider>
        <HelmetProvider>
          <OrderModalProvider>
            <TestModalProvider>
              <ScrollToTop />
              
              {!location.pathname.startsWith('/admin') && (
                <>
                  <NotificationBannerDisplay />
                  <GlobalAlert alertData={siteData?.globalAlert || {}} />
                  <OrderModal contactData={siteData?.contactData || {}} packagesData={siteData?.packagesData || {}} />
                  <TestFormModal contactData={siteData?.contactData || {}} appsData={siteData?.appsData || {}} />
                  <WhatToWatchButton />
                </>
              )}

              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="/sitemap.xml" element={<SitemapXmlPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin-login" element={<AdminLogin />} />

                  <Route path="/admin" element={
                    <ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/channels" element={
                    <ProtectedAdminRoute><AdminLayout><AdminChannelsTab /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/packages" element={
                    <ProtectedAdminRoute><AdminLayout><PackagesManager /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/blog" element={
                    <ProtectedAdminRoute><AdminLayout><BlogManager /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/notifications" element={
                    <ProtectedAdminRoute><AdminLayout><NotificationsPage /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/faqs" element={
                    <ProtectedAdminRoute><AdminLayout><FAQManager /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/setup" element={
                    <ProtectedAdminRoute><AdminLayout><SetupManager /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedAdminRoute><AdminLayout><AdminSettingsPage /></AdminLayout></ProtectedAdminRoute>
                  } />
                  <Route path="/admin/chatbot" element={
                    <ProtectedAdminRoute><AdminLayout><ChatBotManagementTab siteData={siteData} /></AdminLayout></ProtectedAdminRoute>
                  } />

                  {/* German Routes */}
                  <Route path="/de" element={<HomePageDE siteData={siteData} />} />
                  <Route path="/de/packages" element={<PackagesDE />} />
                  <Route path="/de/pakete" element={<PackagesPageDE siteData={siteData} />} />
                  <Route path="/de/paketler" element={<PackagesPageDE siteData={siteData} />} />
                  <Route path="/de/kanale" element={<ChannelsPageDE siteData={siteData} />} />
                  <Route path="/de/sss" element={<FaqPageDE siteData={siteData} />} />
                  <Route path="/de/m3u-olustur" element={<M3uConverterPageDE siteData={siteData} />} />
                  <Route path="/de/uber-uns" element={<AboutPageDE siteData={siteData} />} />
                  <Route path="/de/einrichtung" element={<SetupPageDE siteData={siteData} />} />
                  <Route path="/de/kurulum" element={<Navigate to="/de/einrichtung" replace />} />
                  <Route path="/de/blog" element={<BlogPageDE siteData={siteData} />} />
                  <Route path="/de/blog/:slug" element={<BlogPostPage siteData={siteData} />} />
                  <Route path="/de/reseller" element={<ResellerPageDE siteData={siteData} />} />
                  <Route path="/de/test" element={<TestPageDE siteData={siteData} />} />
                  <Route path="/de/guide/iptv-kurulum-rehberi" element={<GuidePageDE siteData={siteData} />} />
                  <Route path="/de/privacy" element={<PrivacyPageDE siteData={siteData} />} />
                  <Route path="/de/terms" element={<TermsPageDE siteData={siteData} />} />
                  <Route path="/de/was-soll-ich-schauen" element={<WhatToWatchPageDE siteData={siteData} />} />
                  <Route path="/de/was-soll-ich-schauen/:id" element={<WhatToWatchDetailPageDE siteData={siteData} />} />
                  <Route path="/de/spielplan" element={<MatchSchedulePageDE siteData={siteData} />} />
                  <Route path="/de/spielplan/:slug" element={<MatchDetailPageDE siteData={siteData} />} />
                  
                  {/* Turkish / English Routes - kök route ErrorBoundary ile boş ekran yerine hata gösterir */}
                  <Route path="/" element={
                    <ErrorBoundary>
                      <HomePage siteData={siteData} />
                    </ErrorBoundary>
                  } />
                  <Route path="/packages" element={<PackagesPage siteData={siteData} />} />
                  <Route path="/paketler" element={<PackagesPage siteData={siteData} />} />
                  <Route path="/about" element={<AboutPage siteData={siteData} />} />
                  <Route path="/hakkimizda" element={<AboutPage siteData={siteData} />} />
                  <Route path="/installation" element={<InstallationPage siteData={siteData} />} />
                  <Route path="/kurulum" element={<InstallationPage siteData={siteData} />} />
                  <Route path="/instructions" element={<InstallationPage siteData={siteData} />} />
                  <Route path="/installation/:slug" element={<InstallationGuidePage siteData={siteData} />} />
                  <Route path="/detailed-guides" element={<DetailedGuidesPage siteData={siteData} />} />
                  <Route path="/faq" element={<FaqPage siteData={siteData} />} />
                  <Route path="/sss" element={<FaqPage siteData={siteData} />} />
                  <Route path="/reseller" element={<ResellerPage siteData={siteData} />} />
                  <Route path="/bayilik" element={<ResellerPage siteData={siteData} />} />
                  <Route path="/channels" element={<ChannelsPage siteData={siteData} />} />
                  
                  <Route path="/blog" element={<BlogListPage siteData={siteData} />} />
                  <Route path="/blog/:slug" element={<BlogPostPage siteData={siteData} />} />
                  
                  <Route path="/blog/write" element={<ProtectedRoute><BlogWritePage siteData={siteData} /></ProtectedRoute>} />
                  <Route path="/blog/write/:id" element={<ProtectedRoute><BlogWritePage siteData={siteData} /></ProtectedRoute>} />
                  
                  <Route path="/m3u-converter" element={<M3uConverterPage siteData={siteData} />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage siteData={siteData} />} />
                  <Route path="/gizlilik" element={<PrivacyPolicyPage siteData={siteData} />} />
                  <Route path="/terms" element={<TermsOfServicePage siteData={siteData} />} />
                  <Route path="/sartlar" element={<TermsOfServicePage siteData={siteData} />} />
                  
                  <Route path="/karsilastirma" element={<ComparisonPage siteData={siteData} />} />
                  <Route path="/mac-programi" element={<MatchSchedulePage siteData={siteData} />} />
                  <Route path="/mac-programi/:slug" element={<MatchDetailPage siteData={siteData} />} />
                  <Route path="/spor-gundemi" element={<MatchSchedulePage siteData={siteData} />} />
                  <Route path="/what-to-watch" element={<WhatToWatchPage siteData={siteData} />} />
                  <Route path="/ne-izlesem" element={<WhatToWatchPage siteData={siteData} />} />
                  <Route path="/what-to-watch/:imdbID" element={<WhatToWatchDetailPage siteData={siteData} />} />

                  <Route path="/sitemap" element={<SitemapPage siteData={siteData} />} />
                  <Route path="/test" element={<TestFormPage siteData={siteData} />} />
                  <Route path="/bing-verification" element={<BingVerificationPage siteData={siteData} />} />
                  <Route path="/guide/iptv-kurulum-rehberi" element={<GuidePage siteData={siteData} />} />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
              
              <Toaster />
            </TestModalProvider>
          </OrderModalProvider>
        </HelmetProvider>
      </PerformanceProvider>
    </AuthProvider>
  );
}

export default App;