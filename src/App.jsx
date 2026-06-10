import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH, adminPath, isAdminAppPath } from '@/constants/adminRoutes';
import { HelmetProvider } from 'react-helmet-async';
import GlobalAlert from '@/components/GlobalAlert';
import OrderModal from '@/components/OrderModal';
import TestFormModal from '@/components/TestFormModal';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSiteData } from '@/hooks/useSiteData';
import { OrderModalProvider } from '@/contexts/OrderModalContext';
import { TestModalProvider } from '@/contexts/TestModalContext';
import { PerformanceProvider } from '@/components/PerformanceOptimizer';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import WhatToWatchButton from '@/components/what-to-watch/WhatToWatchButton';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import NotificationBannerDisplay from '@/components/NotificationBannerDisplay';
import PageLoadingFallback from '@/components/PageLoadingFallback';
import ErrorBoundary from '@/components/ErrorBoundary';

import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ProtectedRoute from '@/components/ProtectedRoute';

// Ana sayfalar lazy değil: "/" ve "/de" ilk açılışta boş kalmasın (tek chunk)
import HomePage from '@/pages/HomePage';
import HomePageDE from '@/pages/HomePageDE';
// /test sık kullanılıyor ve lazy chunk yükleme hataları ErrorBoundary’e düşebiliyor — ana bundle’da tutsun
import TestFormPage from '@/pages/TestFormPage';
import TestPageDE from '@/pages/TestPageDE';

// Route-Based Code Splitting
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const SitemapXmlPage = lazy(() => import('@/pages/SitemapXmlPage'));
const PackagesPage = lazy(() => import('@/pages/PackagesPage'));
const PackagesPageDE = lazy(() => import('@/pages/PackagesPageDE'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AboutPageDE = lazy(() => import('@/pages/AboutPageDE'));
const InstallationPage = lazy(() => import('@/pages/InstallationPage'));
const InstallationDevicePage = lazy(() => import('@/pages/InstallationDevicePage'));
const SetupPageDE = lazy(() => import('@/pages/SetupPageDE'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const FaqPageDE = lazy(() => import('@/pages/FaqPageDE'));
const ResellerPage = lazy(() => import('@/pages/ResellerPage'));
const ResellerPageDE = lazy(() => import('@/pages/ResellerPageDE'));
const ChannelsPage = lazy(() => import('@/pages/ChannelsPage'));
const ChannelsPageDE = lazy(() => import('@/pages/ChannelsPageDE'));
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
const ComparisonPageDE = lazy(() => import('@/pages/ComparisonPageDE'));
const DetailedGuidesPageDE = lazy(() => import('@/pages/DetailedGuidesPageDE'));
const GuidePage = lazy(() => import('@/pages/GuidePage'));
const GuidePageDE = lazy(() => import('@/pages/GuidePageDE'));
const WhatToWatchPage = lazy(() => import('@/pages/WhatToWatchPage'));
const WhatToWatchPageDE = lazy(() => import('@/pages/WhatToWatchPageDE'));
const WhatToWatchDetailPage = lazy(() => import('@/pages/WhatToWatchDetailPage'));
const WhatToWatchDetailPageDE = lazy(() => import('@/pages/WhatToWatchDetailPageDE'));
const WhatToWatchCategoryPage = lazy(() => import('@/pages/WhatToWatchCategoryPage'));
const WhatToWatchCategoryPageDE = lazy(() => import('@/pages/WhatToWatchCategoryPageDE'));
const MatchSchedulePage = lazy(() => import('@/pages/MatchSchedulePage'));
const MatchSchedulePageDE = lazy(() => import('@/pages/MatchSchedulePageDE'));
const MatchDetailPage = lazy(() => import('@/pages/MatchDetailPage'));
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
const CustomerReviewsManager = lazy(() => import('@/components/admin/CustomerReviewsManager'));
const TeamLogosPage = lazy(() => import('@/pages/admin/TeamLogosPage'));
const MusteriKayitPage = lazy(() => import('@/pages/MusteriKayitPage'));
const CustomersPage = lazy(() => import('@/pages/admin/CustomersPage'));
const CustomerPackagesPage = lazy(() => import('@/pages/admin/CustomerPackagesPage'));
const CustomerDetailPage = lazy(() => import('@/pages/admin/CustomerDetailPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const HeroTab = lazy(() => import('@/components/admin/tabs/HeroTab').then((m) => ({ default: m.default || m.HeroTab })));
const IptvFlowDevicesTab = lazy(() =>
  import('@/components/admin/tabs/IptvFlowDevicesTab').then((m) => ({ default: m.default || m.IptvFlowDevicesTab }))
);

function ET({ children }) {
  return <ErrorBoundary locale="tr">{children}</ErrorBoundary>;
}

function ED({ children }) {
  return <ErrorBoundary locale="de">{children}</ErrorBoundary>;
}

function LegacyAdminPathRedirect() {
  const { pathname } = useLocation();
  const suffix = pathname.slice('/admin'.length) || '';
  const to = suffix ? `${ADMIN_BASE_PATH}${suffix}` : ADMIN_BASE_PATH;
  return <Navigate to={to} replace />;
}

/** Maç detay: Supabase + fikstür — çift sınır (dış rota + iç sayfa) */
function MatchDetailTr({ siteData }) {
  return (
    <ErrorBoundary locale="tr">
      <MatchDetailPage siteData={siteData} />
    </ErrorBoundary>
  );
}

function MatchDetailDe({ siteData }) {
  return (
    <ErrorBoundary locale="de">
      <MatchDetailPageDE siteData={siteData} />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const siteContentRealtime = !!user && isAdminAppPath(location.pathname);
  const skipSiteDataOnAdminLogin = location.pathname === ADMIN_LOGIN_PATH;
  const { siteData, setSiteDataWrapper } = useSiteData(!!user, siteContentRealtime, skipSiteDataOnAdminLogin);

  return (
    <PerformanceProvider>
      <HelmetProvider>
        <OrderModalProvider>
          <TestModalProvider>
            <ScrollToTop />

            {!isAdminAppPath(location.pathname) && (
              <>
                <NotificationBannerDisplay />
                <GlobalAlert alertData={siteData?.globalAlert || {}} />
                <OrderModal contactData={siteData?.contactData || {}} packagesData={siteData?.packagesData || {}} />
                <TestFormModal contactData={siteData?.contactData || {}} appsData={siteData?.appsData || {}} />
                <ExitIntentPopup />
                <WhatToWatchButton />
              </>
            )}

            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/sitemap.xml" element={<ET><SitemapXmlPage /></ET>} />

                <Route path="/admin-login" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
                <Route path="/admin/*" element={<LegacyAdminPathRedirect />} />

                <Route path={ADMIN_LOGIN_PATH} element={<ET><AdminLogin /></ET>} />

                <Route path={ADMIN_BASE_PATH} element={
                  <ET><ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('hero')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><HeroTab siteData={siteData} setSiteData={setSiteDataWrapper} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('iptv-cihazlari')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><IptvFlowDevicesTab siteData={siteData} setSiteData={setSiteDataWrapper} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('channels')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><AdminChannelsTab /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('packages')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><PackagesManager siteData={siteData} setSiteData={setSiteDataWrapper} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('blog')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><BlogManager siteData={siteData} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('notifications')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><NotificationsPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('faqs')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><FAQManager /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('setup')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><SetupManager /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('settings')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><AdminSettingsPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('chatbot')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><ChatBotManagementTab siteData={siteData} setSiteData={setSiteDataWrapper} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('reviews')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><CustomerReviewsManager /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('team-logos')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><TeamLogosPage siteData={siteData} /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('customers/packages')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><CustomerPackagesPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('customers/new')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><CustomerDetailPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={`${adminPath('customers')}/:id`} element={
                  <ET><ProtectedAdminRoute><AdminLayout><CustomerDetailPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />
                <Route path={adminPath('customers')} element={
                  <ET><ProtectedAdminRoute><AdminLayout><CustomersPage /></AdminLayout></ProtectedAdminRoute></ET>
                } />

                <Route path="/de" element={<ED><HomePageDE siteData={siteData} /></ED>} />
                <Route path="/de/iptv" element={<Navigate to="/de/pakete" replace />} />
                <Route path="/de/packages" element={<ED><Navigate to="/de/pakete" replace /></ED>} />
                <Route path="/de/pakete" element={<ED><PackagesPageDE siteData={siteData} /></ED>} />
                <Route path="/de/paketler" element={<ED><Navigate to="/de/pakete" replace /></ED>} />
                <Route path="/de/kanale" element={<ED><ChannelsPageDE siteData={siteData} /></ED>} />
                <Route path="/de/sss" element={<ED><FaqPageDE siteData={siteData} /></ED>} />
                <Route path="/de/m3u-olustur" element={<ED><M3uConverterPageDE siteData={siteData} /></ED>} />
                <Route path="/de/uber-uns" element={<ED><AboutPageDE siteData={siteData} /></ED>} />
                <Route path="/de/einrichtung" element={<ED><SetupPageDE siteData={siteData} /></ED>} />
                <Route path="/de/einrichtung/:device" element={<ED><InstallationDevicePage siteData={siteData} /></ED>} />
                <Route path="/de/kurulum" element={<ED><Navigate to="/de/einrichtung" replace /></ED>} />
                <Route path="/de/blog" element={<ED><BlogPageDE siteData={siteData} /></ED>} />
                <Route path="/de/blog/:slug" element={<ED><BlogPostPage siteData={siteData} /></ED>} />
                <Route path="/de/reseller" element={<ED><ResellerPageDE siteData={siteData} /></ED>} />
                <Route path="/de/test" element={<ED><TestPageDE siteData={siteData} /></ED>} />
                <Route path="/de/guide/iptv-kurulum-rehberi" element={<ED><GuidePageDE siteData={siteData} /></ED>} />
                <Route path="/de/privacy" element={<ED><PrivacyPageDE siteData={siteData} /></ED>} />
                <Route path="/de/terms" element={<ED><TermsPageDE siteData={siteData} /></ED>} />
                <Route path="/de/was-soll-ich-schauen" element={<ED><WhatToWatchPageDE siteData={siteData} /></ED>} />
                {/* DE SEO kategori sayfaları — :id rotasından ÖNCE olmalı (route priority) */}
                <Route path="/de/was-soll-ich-schauen/beste-action-filme" element={<ED><WhatToWatchCategoryPageDE siteData={siteData} slug="beste-action-filme" /></ED>} />
                <Route path="/de/was-soll-ich-schauen/beliebte-auslaendische-serien" element={<ED><WhatToWatchCategoryPageDE siteData={siteData} slug="beliebte-auslaendische-serien" /></ED>} />
                <Route path="/de/was-soll-ich-schauen/horrorfilme" element={<ED><WhatToWatchCategoryPageDE siteData={siteData} slug="horrorfilme" /></ED>} />
                <Route path="/de/was-soll-ich-schauen/romantische-filme" element={<ED><WhatToWatchCategoryPageDE siteData={siteData} slug="romantische-filme" /></ED>} />
                <Route path="/de/was-soll-ich-schauen/:id" element={<ED><WhatToWatchDetailPageDE siteData={siteData} /></ED>} />
                <Route path="/de/spielplan" element={<ED><MatchSchedulePageDE siteData={siteData} /></ED>} />
                <Route path="/de/spielplan/:slug" element={<ED><MatchDetailDe siteData={siteData} /></ED>} />
                <Route path="/de/bewertungen" element={<ED><ReviewsPage siteData={siteData} /></ED>} />
                <Route path="/de/vergleich" element={<ED><ComparisonPageDE siteData={siteData} /></ED>} />
                <Route path="/de/karsilastir" element={<ED><Navigate to="/de/vergleich" replace /></ED>} />
                <Route path="/de/detaillierte-anleitungen" element={<ED><DetailedGuidesPageDE siteData={siteData} /></ED>} />
                <Route path="/de/detayli-kurulum" element={<ED><Navigate to="/de/detaillierte-anleitungen" replace /></ED>} />

                <Route path="/" element={<ET><HomePage siteData={siteData} /></ET>} />
                <Route path="/packages" element={<ET><PackagesPage siteData={siteData} /></ET>} />
                <Route path="/paketler" element={<ET><PackagesPage siteData={siteData} /></ET>} />
                <Route path="/about" element={<ET><AboutPage siteData={siteData} /></ET>} />
                <Route path="/hakkimizda" element={<ET><AboutPage siteData={siteData} /></ET>} />
                <Route path="/installation" element={<ET><InstallationPage siteData={siteData} /></ET>} />
                <Route path="/kurulum" element={<ET><InstallationPage siteData={siteData} /></ET>} />
                <Route path="/kurulum/:device" element={<ET><InstallationDevicePage siteData={siteData} /></ET>} />
                <Route path="/installation/:device" element={<ET><InstallationDevicePage siteData={siteData} /></ET>} />
                <Route path="/instructions" element={<ET><InstallationPage siteData={siteData} /></ET>} />
                <Route path="/detayli-kurulum" element={<ET><Navigate to="/detailed-guides" replace /></ET>} />
                <Route path="/detailed-guides" element={<ET><DetailedGuidesPage siteData={siteData} /></ET>} />
                <Route path="/faq" element={<ET><FaqPage siteData={siteData} /></ET>} />
                <Route path="/sss" element={<ET><FaqPage siteData={siteData} /></ET>} />
                <Route path="/reseller" element={<ET><ResellerPage siteData={siteData} /></ET>} />
                <Route path="/bayilik" element={<ET><ResellerPage siteData={siteData} /></ET>} />
                <Route path="/channels" element={<ET><ChannelsPage siteData={siteData} /></ET>} />

                <Route path="/blog/write/:id" element={<ET><ProtectedRoute><BlogWritePage siteData={siteData} /></ProtectedRoute></ET>} />
                <Route path="/blog/write" element={<ET><ProtectedRoute><BlogWritePage siteData={siteData} /></ProtectedRoute></ET>} />
                <Route path="/blog" element={<ET><BlogListPage siteData={siteData} /></ET>} />
                <Route path="/blog/:slug" element={<ET><BlogPostPage siteData={siteData} /></ET>} />

                <Route path="/m3u-converter" element={<ET><M3uConverterPage siteData={siteData} /></ET>} />
                <Route path="/privacy" element={<ET><PrivacyPolicyPage siteData={siteData} /></ET>} />
                <Route path="/gizlilik" element={<ET><PrivacyPolicyPage siteData={siteData} /></ET>} />
                <Route path="/terms" element={<ET><TermsOfServicePage siteData={siteData} /></ET>} />
                <Route path="/sartlar" element={<ET><TermsOfServicePage siteData={siteData} /></ET>} />

                <Route path="/karsilastir" element={<ET><Navigate to="/karsilastirma" replace /></ET>} />
                <Route path="/karsilastirma" element={<ET><ComparisonPage siteData={siteData} /></ET>} />
                <Route path="/mac-programi" element={<ET><MatchSchedulePage siteData={siteData} /></ET>} />
                <Route path="/mac-programi/:slug" element={<ET><MatchDetailTr siteData={siteData} /></ET>} />
                <Route path="/spor-gundemi" element={<ET><Navigate to="/mac-programi" replace /></ET>} />
                <Route path="/spor-gundemi/:slug" element={<ET><MatchDetailTr siteData={siteData} /></ET>} />
                <Route path="/what-to-watch" element={<ET><WhatToWatchPage siteData={siteData} /></ET>} />
                <Route path="/ne-izlesem" element={<ET><WhatToWatchPage siteData={siteData} /></ET>} />
                {/* SEO kategori sayfaları — :imdbID rotasından ÖNCE olmalı (route priority) */}
                <Route path="/ne-izlesem/aksiyon-filmleri" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="aksiyon-filmleri" /></ET>} />
                <Route path="/ne-izlesem/populer-yabanci-diziler" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="populer-yabanci-diziler" /></ET>} />
                <Route path="/ne-izlesem/korku-filmleri" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="korku-filmleri" /></ET>} />
                <Route path="/ne-izlesem/romantik-filmler" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="romantik-filmler" /></ET>} />
                <Route path="/ne-izlesem/turk-dizileri" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="turk-dizileri" /></ET>} />
                <Route path="/ne-izlesem/imdb-yuksek-filmler" element={<ET><WhatToWatchCategoryPage siteData={siteData} slug="imdb-yuksek-filmler" /></ET>} />
                <Route path="/what-to-watch/:imdbID" element={<ET><WhatToWatchDetailPage siteData={siteData} /></ET>} />
                <Route path="/ne-izlesem/:imdbID" element={<ET><WhatToWatchDetailPage siteData={siteData} /></ET>} />

                <Route path="/sitemap" element={<ET><SitemapPage siteData={siteData} /></ET>} />
                <Route path="/test" element={<ET><TestFormPage siteData={siteData} /></ET>} />
                <Route path="/bing-verification" element={<ET><BingVerificationPage siteData={siteData} /></ET>} />
                <Route path="/guide/iptv-kurulum-rehberi" element={<ET><GuidePage siteData={siteData} /></ET>} />
                <Route path="/yorumlar" element={<ET><ReviewsPage siteData={siteData} /></ET>} />
                <Route path="/musteri-kayit" element={<ET><MusteriKayitPage siteData={siteData} /></ET>} />

                <Route path="*" element={<ET><NotFoundPage /></ET>} />
              </Routes>
            </Suspense>

            <Toaster />
          </TestModalProvider>
        </OrderModalProvider>
      </HelmetProvider>
    </PerformanceProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
