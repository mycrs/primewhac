import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, ArrowRight, MessageCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const defaultFaqDataDE = {
  title: 'Häufig gestellte Fragen zu IPTV Deutschland',
  description: 'Finden Sie Antworten auf häufig gestellte Fragen zu unserem IPTV-Service, zur Installation, zur Qualität und zu den Zahlungsmethoden.',
  sections: [
    {
      title: 'Kaufen und Zahlung',
      items: [
        {
          question: 'Wie kann ich ein IPTV-Abo kaufen?',
          answer: 'Der Kaufprozess ist sehr einfach. Wählen Sie auf unserer Paket-Seite das gewünschte Abonnement aus, klicken Sie auf "Bestellen" und folgen Sie den Anweisungen zur Zahlung. Nach erfolgreicher Zahlung erhalten Sie Ihre Zugangsdaten in der Regel innerhalb weniger Minuten per E-Mail oder WhatsApp.'
        },
        {
          question: 'Welche Zahlungsmethoden werden akzeptiert?',
          answer: 'Wir bieten verschiedene sichere Zahlungsmöglichkeiten an, darunter PayPal, Kreditkarte, Banküberweisung und Kryptowährungen. Alle Zahlungen werden verschlüsselt und sicher verarbeitet.'
        },
        {
          question: 'Gibt es eine kostenlose Testphase?',
          answer: 'Ja, wir bieten einen kostenlosen 24-Stunden-Testzugang an, damit Sie sich vor dem Kauf von der Qualität und Stabilität unserer Server überzeugen können. Kontaktieren Sie einfach unseren Support über WhatsApp, um Ihren Testzugang anzufordern.'
        }
      ]
    },
    {
      title: 'Installation und Einrichtung',
      items: [
        {
          question: 'Wie installiere ich IPTV auf meinem Gerät?',
          answer: 'Die Installation variiert je nach Gerät. Wir unterstützen Smart TVs (Samsung, LG, Android TV), Fire TV Sticks, Apple TV, Smartphones (iOS/Android) und PCs. Nach dem Kauf erhalten Sie eine detaillierte Schritt-für-Schritt-Anleitung für Ihr spezifisches Gerät.'
        }
      ]
    },
    {
      title: 'Streaming-Qualität',
      items: [
        {
          question: 'In welcher Qualität werden die Sender gestreamt?',
          answer: 'Wir bieten die meisten unserer Sender in echter 4K-, UHD- und Full-HD-Qualität an. Die tatsächliche Qualität hängt jedoch von Ihrer Internetverbindung ab. Wir empfehlen eine minimale Internetgeschwindigkeit von 16 Mbit/s für HD und 30 Mbit/s für 4K-Streaming.'
        }
      ]
    },
    {
      title: 'Technische Probleme',
      items: [
        {
          question: 'Was kann ich tun, wenn der Stream puffert oder ruckelt?',
          answer: 'Pufferung tritt meist durch eine instabile Internetverbindung auf. Stellen Sie sicher, dass Ihr Gerät per LAN-Kabel (nicht WLAN) verbunden ist. Starten Sie Ihren Router und das Gerät neu. Sollte das Problem bestehen, kontaktieren Sie unseren 24/7 Support, damit wir Ihren Server-Port optimieren können.'
        }
      ]
    },
    {
      title: 'Geräte und Zugang',
      items: [
        {
          question: 'Kann ich mein Abo auf mehreren Geräten gleichzeitig nutzen?',
          answer: 'Standardabonnements gelten für ein einzelnes Gerät gleichzeitig. Sie können die App auf mehreren Geräten installieren, aber nicht zeitgleich schauen. Wir bieten jedoch spezielle Multiroom-Pakete an, mit denen Sie auf 2 oder mehr Geräten gleichzeitig streamen können.'
        }
      ]
    }
  ]
};

const FaqPageDE = ({ siteData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const faqData = defaultFaqDataDE;
  const safeSiteData = siteData || {};
  
  const metadata = {
    title: faqData.title,
    description: faqData.description,
    keywords: ["IPTV Deutschland", "IPTV kaufen", "IPTV Test", "IPTV Erfahrungen", "Deutsche Sender", "Smart TV IPTV"],
    ogType: "website"
  };

  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.sections.flatMap(section => 
          section.items.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
              }
          }))
      )
  };

  const customCrumbs = [
    { name: 'Startseite', path: '/de' },
    { name: 'FAQ', path: null }
  ];

  if (loading) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-slate-400 text-lg">Inhalte werden geladen...</p>
          </div>
      );
  }

  return (
    <>
      <SEOHead {...metadata} jsonLd={[jsonLd]} />
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
        <HeaderDE contactData={safeSiteData.contactData} />
        
        <main className="flex-grow w-full">
          {/* Hero Section - Contains the single H1 for the page */}
          <section className="relative min-h-[60vh] lg:min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/40 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/101cce4586536aa0617e00725d4ba2bc.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            
            <div className="container relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-6 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold tracking-wider uppercase">
                    Support-Center
                  </span>
                </div>
                {/* Primary H1: The ONLY H1 tag on the page */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                  {faqData.title}
                </h1>
                <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                  Alles was Sie über unsere IPTV-Dienste und technischen Details wissen müssen.
                </p>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="w-[30px] h-[50px] rounded-full border-2 border-slate-500 flex justify-center p-2">
                <motion.div 
                  className="w-1.5 h-3 bg-blue-400 rounded-full"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </section>

          {/* Content Section */}
          <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 relative z-10 bg-slate-950">
            <div className="container mx-auto max-w-4xl">
              <div className="mb-10">
                <BreadcrumbNavigation customCrumbs={customCrumbs} />
              </div>

              <motion.div 
                className="space-y-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {faqData.sections.map((section, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="w-full">
                    {/* Section titles correctly use H2 for hierarchical SEO structure */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20 shrink-0">
                          {idx + 1}
                      </span>
                      {section.title}
                    </h2>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {section.items.map((item, itemIdx) => (
                        <AccordionItem 
                          key={itemIdx} 
                          value={`item-${idx}-${itemIdx}`} 
                          className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 overflow-hidden group data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-900/10 data-[state=open]:to-purple-900/10 data-[state=open]:border-blue-500/30"
                        >
                          <AccordionTrigger className="text-base md:text-lg font-semibold hover:text-blue-400 hover:no-underline py-5 px-6 text-left [&[data-state=open]]:text-blue-400 transition-colors">
                            <span className="pr-4 leading-snug group-hover:translate-x-1 transition-transform duration-300">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-400 text-base md:text-lg leading-relaxed pb-6 px-6 font-light">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div 
                className="mt-24 p-8 md:p-12 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    {/* CTA title correctly uses H2 for proper hierarchy */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Keine Antwort gefunden?</h2>
                    <p className="text-slate-300 mb-10 text-lg">
                      Kontaktieren Sie unseren 24/7 Kundenservice über WhatsApp für schnelle Hilfe und Unterstützung.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <Link 
                        to="/de/pakete" 
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                      >
                        Pakete ansehen <ArrowRight className="w-5 h-5" />
                      </Link>
                      <a 
                        href={`https://wa.me/${(safeSiteData?.contactData?.whatsapp || '').replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-slate-600 shadow-lg flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5 text-emerald-400" /> WhatsApp Support
                      </a>
                    </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default FaqPageDE;