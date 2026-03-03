import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatBot from '@/components/ChatBot';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstallationGuidePage = ({ siteData }) => {
  const { slug } = useParams();
  
  let appData = null;
  siteData.installationPageData?.tabs?.forEach(tab => {
    const foundApp = tab.apps?.find(app => app.slug === slug);
    if (foundApp) {
      appData = foundApp;
    }
  });

  if (!appData || !appData.details) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-lg text-gray-400 mb-8">Aradığınız kurulum rehberi mevcut değil.</p>
        <Button asChild>
          <Link to="/installation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Rehberlere Geri Dön
          </Link>
        </Button>
      </div>
    );
  }

  const { title, description, content } = appData.details;
  const pageSeo = siteData.seoData?.installation || {};

  return (
    <>
      <Helmet>
        <title>{`${title || 'Kurulum Rehberi'} | ${pageSeo.title || 'QruzeHD'}`}</title>
        <meta name="description" content={description || 'Kurulum detayları.'} />
        <meta name="keywords" content={pageSeo.keywords || 'iptv kurulum'} />
      </Helmet>
      <div className="min-h-screen bg-black flex flex-col">
        <Header contactData={siteData.contactData} siteTexts={siteData.siteTexts} />
        <main className="flex-grow py-20">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-8">
              <Link to="/installation">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tüm Kurulum Rehberlerine Geri Dön
              </Link>
            </Button>
            <article>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
              <p className="text-xl text-gray-400 mb-8">{description}</p>
              <div className="prose prose-invert max-w-none text-gray-300 leading-loose whitespace-pre-wrap">
                {content}
              </div>
            </article>
          </div>
        </main>
        <Footer contactData={siteData.contactData} siteTexts={siteData.siteTexts} />
        <WhatsAppButton contactData={siteData.contactData} siteTexts={siteData.siteTexts} />
        {siteData.chatBotData.enabled && <ChatBot chatData={siteData.chatBotData} packagesData={siteData.packagesData} contactData={siteData.contactData} siteTexts={siteData.siteTexts} />}
      </div>
    </>
  );
};

export default InstallationGuidePage;