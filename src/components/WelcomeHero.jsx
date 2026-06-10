import React, { memo } from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestModal } from '@/contexts/TestModalContext';
import { useNavigate } from 'react-router-dom';

/**
 * Legacy Hero Component
 * Retained for backward compatibility or alternative layouts.
 * Aligned with new design patterns but simpler.
 */
const WelcomeHero = ({ siteData }) => {
  const { openModal: openTestModal } = useTestModal();
  const navigate = useNavigate();
  
  const heroConfig = siteData?.heroData || {};
  const siteTexts = siteData?.siteTexts || {};
  
  const titlePrefix = heroConfig.titlePrefix || siteTexts.brandName || "QruzeTV";
  const titleHighlight = heroConfig.titleHighlight || "Premium IPTV";
  const description = heroConfig.description || siteTexts.welcomeSubtitle || "10.000+ canlı kanal ve zengin film/dizi keyfi tek platformda.";

  return (
    <div className="w-full min-h-[60vh] bg-[#0a0a0a] relative flex items-center justify-center border-b border-[#2a2a40] overflow-hidden">
       {/* Simple gradient background to align with new theme */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/40 via-[#e50914]/20 to-[#141414] z-0"></div>
       
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Kesintisiz Canlı Yayın</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">{titleHighlight}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            {description}
          </p>

          <div className="flex flex-wrap gap-5 justify-center">
            <Button 
              onClick={openTestModal}
              className="h-12 px-8 rounded-lg bg-primary text-white font-bold hover:bg-primary transition-colors"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {heroConfig.primaryButtonText || "Hemen Test Et"}
            </Button>
            
            <Button 
              onClick={() => navigate(heroConfig.secondaryButtonLink || '/paketler')}
              variant="outline"
              className="h-12 px-8 rounded-lg border border-slate-600 bg-transparent text-slate-200 font-bold hover:bg-[#0a0a0a] transition-colors"
            >
              {heroConfig.secondaryButtonText || "Paketleri İncele"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WelcomeHero);