import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WelcomePageHero from '@/components/WelcomePageHero';
import WelcomePageFeatures from '@/components/WelcomePageFeatures';
import WelcomePageStats from '@/components/WelcomePageStats';
import WelcomePageCTA from '@/components/WelcomePageCTA';

const WelcomeSplashPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = siteData?.seoData?.home?.title || "Hoşgeldiniz - Premium IPTV";
  const pageDescription = siteData?.seoData?.home?.description || "En iyi IPTV deneyimi için hoşgeldiniz.";

  return (
    <div className="min-h-screen bg-[#0F0F1E] flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <Header 
        contactData={siteData.contactData || {}} 
        siteTexts={siteData.siteTexts || {}} 
        siteData={siteData} 
      />

      <main className="flex-grow">
        <WelcomePageHero siteData={siteData} />
        <WelcomePageFeatures />
        <WelcomePageStats />
        <WelcomePageCTA />
      </main>

      <Footer 
        contactData={siteData.contactData || {}} 
        siteTexts={siteData.siteTexts || {}} 
        siteData={siteData}
      />
    </div>
  );
};

export default WelcomeSplashPage;