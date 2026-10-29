
import React from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import ChatBot from '@/components/ChatBot';
import SEOHead from '@/components/SEOHead';
import { resellerPageSchemas } from '@/utils/seoSchema';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Wallet, Shield, TrendingUp, Award, Clapperboard, CheckCircle, Rocket, MessageCircle, HelpCircle, Star, Users, Target } from 'lucide-react';
import ResellerCalculatorSectionDE from '@/components/ResellerCalculatorSectionDE';
import { openSupportWhatsApp } from '@/utils/supportChannel';

const iconMap = {
  LayoutDashboard,
  Wallet,
  Shield,
  TrendingUp,
  Award,
  Clapperboard
};

const ResellerPageDE = ({ siteData }) => {
  const { contactData, siteTexts, chatBotData } = siteData;
  // Link wird nicht ins DOM geschrieben; Nummer wird zur Laufzeit aufgelöst.
  const openResellerContact = () =>
    openSupportWhatsApp({
      siteData,
      contactData,
      message:
        'Ich möchte detaillierte Informationen zum Wiederverkäufer-Programm erhalten und Geschäftspartner werden.',
    });
  
  const metadata = {
    title: "Wiederverkäufer-Programm: Passive Einnahmen & Partnerschaft",
    description: "Starten Sie Ihr eigenes Geschäft mit unserem Wiederverkäufer-Programm. Profitieren Sie von einem lukrativen Provisionsmodell, passiven Einnahmen und professioneller Unterstützung.",
    keywords: ["Wiederverkäufer", "Reseller", "Provisionsmodell", "Passive Einnahmen", "Geschäftspartner", "Verdienst", "Kundenakquisition", "Skalierbar", "Unterstützung", "Provisionsquote", "Geschäftsmöglichkeit"],
    ogType: "website"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const defaultFeatures = [
    { 
      id: 1, 
      title: "Intuitives Reseller-Panel", 
      description: "Ein innovatives Kontrollpanel, das es Ihnen ermöglicht, Ihre Kunden, Abonnements und Zahlungen schnell, praktisch und absolut effizient zu verwalten. Behalten Sie jederzeit den Überblick über Ihre Geschäftspartner und Endkunden.", 
      icon: "LayoutDashboard" 
    },
    { 
      id: 2, 
      title: "Flexibles Kreditsystem", 
      description: "Kaufen Sie Guthaben ganz nach Ihrem individuellen Bedarf und verwenden Sie es, wie es für Ihre Kundenakquisition am besten passt. Keine starren Verträge, sondern maximale unternehmerische Freiheit.", 
      icon: "Wallet" 
    },
    { 
      id: 3, 
      title: "Premium Unterstützung", 
      description: "Spezieller und priorisierter technischer Support für unsere Wiederverkäufer. Wir lassen Sie niemals allein, damit Sie Ihren Kunden stets den besten Service bieten können.", 
      icon: "Shield" 
    },
    { 
      id: 4, 
      title: "Attraktive Provisionsquote", 
      description: "Maximieren Sie Ihren Verdienst mit den wettbewerbsfähigsten Preisen und der besten Provisionsquote in der gesamten Branche. Ihr finanzieller Erfolg steht für uns im Mittelpunkt.", 
      icon: "TrendingUp" 
    },
    { 
      id: 5, 
      title: "Eigene Markenidentität", 
      description: "Nutzen Sie die Freiheit, unter Ihrer eigenen Marke (White-Label) aufzutreten. Stärken Sie Ihr eigenes Branding und binden Sie Kunden langfristig an Ihr eigenes Unternehmen.", 
      icon: "Award" 
    },
    { 
      id: 6, 
      title: "Gigantisches Angebot", 
      description: "Stellen Sie Ihre Kunden mit Tausenden von Kanälen, aktuellen Filmen und Serien in höchster Qualität vollkommen zufrieden. Ein Produkt, das sich dank seiner Qualität nahezu von selbst verkauft.", 
      icon: "Clapperboard" 
    }
  ];

  const jsonLd = resellerPageSchemas(metadata, { route: '/de/reseller', lang: 'de' });

  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType={metadata.ogType}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
        <HeaderDE contactData={contactData} />
        
        <main className="flex-grow pt-24 pb-0 text-white">
          {/* 1. Hero Section */}
          <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-5xl mx-auto"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 <span className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" /> Erstklassige Geschäftsmöglichkeit
                 </span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                Wiederverkäufer-Programm: Passive Einnahmen durch Geschäftspartnerschaften
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
                Nutzen Sie die digitale Revolution im Entertainment-Sektor. Werden Sie noch heute unser Geschäftspartner, etablieren Sie sich als erfolgreicher Wiederverkäufer und bauen Sie sich durch ein unschlagbares Provisionsmodell eine nachhaltige Quelle für passive Einnahmen auf.
              </p>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary text-white font-bold h-14 px-10 rounded-xl text-lg shadow-lg shadow-primary/40 hover:scale-105 transition-all duration-300"
                onClick={openResellerContact}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Jetzt Geschäftspartner werden
              </Button>
            </motion.div>
          </section>

          {/* 2. Intro Text Section */}
          <section className="py-16 bg-[#0c0518] border-y border-white/5 relative z-10">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto prose prose-invert prose prose-lg prose-headings:text-white"
              >
                <div className="text-gray-300 space-y-6 leading-relaxed">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Einleitung: Die Zukunft des Entertainments als Ihre Geschäftsmöglichkeit</h2>
                  <p>
                    In der heutigen rasanten digitalen Welt verändert sich die Art und Weise, wie wir Medien konsumieren, grundlegend. Das klassische, lineare Fernsehen verliert rasant an Bedeutung, während das Streaming über das Internet unaufhaltsam wächst. Genau an diesem entscheidenden Wendepunkt bietet Ihnen unser <strong>Wiederverkäufer-Programm</strong> eine einmalige, überaus lukrative Geschäftsmöglichkeit. Als Reseller haben Sie die Chance, Teil eines Milliardenmarktes zu werden, ohne Millionen in die Entwicklung einer eigenen Infrastruktur investieren zu müssen.
                  </p>
                  <p>
                    Ein <strong>Wiederverkäufer</strong> (oder Reseller) agiert als direkte Brücke zwischen unserer hochmodernen, globalen Server-Infrastruktur und dem Endkunden, der nach grenzenloser Unterhaltung sucht. Das Prinzip ist denkbar einfach, aber extrem wirkungsvoll: Sie erwerben bei uns Zugänge zu Großhandelspreisen und verkaufen diese zu Ihren eigenen Bedingungen und Preisen an Ihre Kunden weiter. Die Differenz ist Ihr reiner Gewinn. Dies ist nicht einfach nur ein Nebenjob; es ist der Aufbau eines vollwertigen, digitalen Unternehmens, das durch wiederkehrende Zahlungen der Kunden echte <strong>passive Einnahmen</strong> generiert.
                  </p>
                  <p>
                    Egal, ob Sie ein ambitionierter Einsteiger sind, der ein zweites Standbein sucht, oder ein etablierter Unternehmer, der sein Portfolio erweitern möchte – als unser <strong>Geschäftspartner</strong> profitieren Sie von einem System, das von Beginn an auf Wachstum und Skalierbarkeit ausgelegt ist. Die Nachfrage nach hochwertigem Home-Entertainment war noch nie so groß wie heute. Nutzen Sie diese Nachfrage, um Ihren eigenen <strong>Verdienst</strong> drastisch zu steigern und sich langfristig finanziell unabhängig zu machen.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. Reordered: Calculator Section (Einkommensrechner) moved up */}
          <div className="border-b border-white/5">
            <ResellerCalculatorSectionDE />
          </div>

          {/* 4. Features/Advantages section */}
          <section className="relative py-20 bg-[#0a0a0a]/30">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e50914]/5 to-transparent pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ihre Werkzeuge für den Erfolg</h2>
                  <p className="text-gray-400 text-lg">Als unser Geschäftspartner statten wir Sie mit allem aus, was Sie benötigen, um auf dem Markt zu dominieren und Ihren Verdienst zu maximieren.</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                {defaultFeatures.map((feature) => {
                    const Icon = iconMap[feature.icon] || CheckCircle;
                    return (
                    <motion.div
                        key={feature.id}
                        variants={itemVariants}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-inner">
                        <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors font-light">{feature.description}</p>
                    </motion.div>
                    );
                })}
                </motion.div>
            </div>
          </section>

          {/* 5. Detailed Text Sections (Advantages, Provisionsmodell, Erfolgsgeschichten) */}
          <section className="py-16 bg-[#0c0518] relative z-10 border-t border-white/5">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto prose prose-invert prose prose-lg prose-headings:text-white"
              >
                <div className="text-gray-300 space-y-16 leading-relaxed">
                  {/* Why become a reseller? */}
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-primary">Warum Sie Wiederverkäufer werden sollten: Der Weg zur finanziellen Freiheit</h2>
                    <p>
                      Die Entscheidung, sich unserem <strong>Wiederverkäufer</strong>-Netzwerk anzuschließen, ist weit mehr als nur ein gewöhnlicher Nebenjob. Es ist der Einstieg in ein zukunftssicheres Geschäftsmodell, das Ihnen unvergleichliche Freiheiten bietet. Der größte und offensichtlichste Vorteil ist die Möglichkeit, echte <strong>passive Einnahmen</strong> zu generieren. Im Gegensatz zu traditionellen Geschäftsmodellen, bei denen Sie physische Produkte einkaufen, lagern und versenden müssen, operieren Sie hier zu 100% digital. Das bedeutet für Sie: Keine Lagerkosten, keine Versandlogistik, keine Retouren und vor allem keine versteckten Gebühren.
                    </p>
                    <p>
                      Ein weiterer essenzieller Aspekt ist, dass dieses Geschäftsmodell extrem <strong>skalierbar</strong> ist. Sie können mit einer Handvoll Kunden in Ihrem Freundes- und Bekanntenkreis beginnen und Ihr Geschäft durch gezielte <strong>Kundenakquisition</strong> auf hunderte oder sogar tausende Abonnenten ausweiten. Die Infrastruktur, die wir Ihnen zur Verfügung stellen, hält jedem Wachstumsschub problemlos stand. Je mehr Kunden Sie gewinnen, desto höher wird automatisch Ihr monatlicher <strong>Verdienst</strong>. Dabei bestimmen Sie selbst das Tempo, Ihre Arbeitszeiten und Ihren Arbeitsort. Sie benötigen lediglich einen Internetanschluss und ein Smartphone oder einen Laptop.
                    </p>
                  </div>

                  {/* Commission model */}
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-primary">Wie funktioniert das Provisionsmodell in der Praxis?</h2>
                    <p>
                      Transparenz ist der Schlüssel zu einer langfristigen und erfolgreichen Partnerschaft. Unser <strong>Provisionsmodell</strong> ist so konzipiert, dass es sowohl für Neueinsteiger als auch für Vertriebsprofis maximal lukrativ ist. Im Kern basiert das System auf dem Erwerb von "Credits" (Guthaben). Als <strong>Wiederverkäufer</strong> kaufen Sie diese Credits zu einem stark rabattierten Großhandelspreis ein. Ein Credit entspricht in der Regel einem bestimmten Abonnement-Zeitraum (zum Beispiel einem Monat oder einem Jahr).
                    </p>
                    <p>
                      Der Clou an der Sache ist die außergewöhnlich hohe <strong>Provisionsquote</strong>. Da wir die Serverinfrastruktur stellen und Sie den Endkundenvertrieb übernehmen, behalten Sie die gesamte Differenz zwischen Ihrem günstigen Einkaufspreis und dem Verkaufspreis, den Sie vom Endkunden verlangen. Sie haben die volle Preishoheit! Sie entscheiden selbst, ob Sie durch Premium-Preise eine besonders hohe Marge pro Kunde erzielen möchten oder ob Sie durch aggressive, günstigere Preise auf Masse und schnelle <strong>Kundenakquisition</strong> setzen. In beiden Fällen ist das <strong>Provisionsmodell</strong> Ihr Garant für stetig wachsende Einnahmen.
                    </p>
                  </div>

                  {/* Success stories */}
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-primary">Erfolgsgeschichten: Realistische Szenarien unserer Geschäftspartner</h2>
                    <div className="bg-[#0a0a0a]/60 p-6 rounded-xl border border-white/10 mt-6">
                      <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2"><Users className="w-6 h-6 text-blue-400" /> Szenario 1: Der engagierte Nebenberufler</h3>
                      <p className="text-gray-300">
                        Thomas S., ein Angestellter aus München, suchte nach einer zusätzlichen <strong>Einkommensquelle</strong>. Er begann als <strong>Geschäftspartner</strong> mit einer kleinen Investition und fokussierte sich auf die <strong>Kundenakquisition</strong> in seinem lokalen Umfeld, in Sportvereinen und über Empfehlungen. Innerhalb von drei Monaten baute er sich einen treuen Stamm von 50 Kunden auf. Bei einer durchschnittlichen <strong>Provisionsquote</strong> von 40% generiert er nun konstante <strong>passive Einnahmen</strong>, die seine monatlichen Fixkosten wie Miete und Auto vollständig decken.
                      </p>
                    </div>
                    <div className="bg-[#0a0a0a]/60 p-6 rounded-xl border border-white/10 mt-6">
                      <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2"><Target className="w-6 h-6 text-orange-400" /> Szenario 2: Die professionelle Agentur</h3>
                      <p className="text-gray-300">
                        Sarah M. erkannte das immense Potenzial der <strong>Geschäftsmöglichkeit</strong> und entschied sich, voll einzusteigen. Sie nutzte unsere White-Label-Lösung, erstellte eine eigene Marke und nutzte Social Media gezielt zur <strong>Kundenakquisition</strong>. Durch ihren strategischen Ansatz betreut sie heute über 400 aktive Kunden. Da dieses Modell zu 100% <strong>skalierbar</strong> ist, plant sie bereits, weitere Vertriebsmitarbeiter einzustellen. Ihr monatlicher <strong>Verdienst</strong> übersteigt mittlerweile ein reguläres Managergehalt bei Weitem.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 6. FAQ Section */}
          <section className="py-20 bg-[#0a0a0a]/30 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Häufig gestellte Fragen (FAQ)</h2>
                  <p className="text-gray-400 text-lg">Alles, was Sie über unsere <strong>Geschäftspartnerschaft</strong> wissen müssen, transparent beantwortet.</p>
                </div>

                <div className="space-y-6">
                  {/* FAQ Items */}
                  {[
                    {
                      q: "Wie viel Startkapital benötige ich, um Wiederverkäufer zu werden?",
                      a: "Das Besondere an dieser Geschäftsmöglichkeit ist die extrem niedrige Eintrittsbarriere. Sie benötigen keine Tausenden von Euro für Wareneinkauf oder Lagerhaltung. Sie können bereits mit einem kleinen Paket an Credits starten. Sobald Sie diese an Ihre ersten Endkunden verkauft haben, haben Sie Ihr initiales Investment bereits vervielfacht und können den Gewinn reinvestieren."
                    },
                    {
                      q: "Wie viel Zeit muss ich für diese Tätigkeit einplanen?",
                      a: "Ihr Zeitaufwand ist so flexibel wie Sie selbst. Die technische Verwaltung eines Kunden dauert in unserem benutzerfreundlichen Reseller-Panel weniger als zwei Minuten. Die meiste Zeit werden Sie in der Anfangsphase in die Kundenakquisition investieren. Sobald ein Kunde an Bord ist, generiert er größtenteils passive Einnahmen."
                    },
                    {
                      q: "Wer übernimmt den Kundenservice bei technischen Problemen?",
                      a: "Als unser direkter Geschäftspartner sind Sie der erste Ansprechpartner für Ihre Endkunden bei Fragen zu Rechnungen oder Laufzeiten. Sollte es jedoch tiefgreifende technische Probleme mit Streams oder Servern geben, greift unsere professionelle Unterstützung durch unser erfahrenes Technik-Team."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="bg-[#0c0518] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                        {faq.q}
                      </h3>
                      <p className="text-gray-400 leading-relaxed pl-9">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 7. CTA (Handlungsaufforderung) Sections */}
          <section className="container mx-auto px-4 py-20 pb-32 relative z-20">
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden p-[2px] bg-gradient-to-r from-[#e50914] via-[#ff2430] to-[#b20710] shadow-2xl shadow-primary/50"
             >
                <div className="bg-[#0a0a0a]/95 backdrop-blur-xl rounded-[22px] p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e50914]/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ergreifen Sie jetzt Ihre Geschäftsmöglichkeit!</h2>
                        <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                          Zögern Sie nicht länger, während andere bereits von diesem einzigartigen <strong>Provisionsmodell</strong> profitieren. Werden Sie noch heute unser offizieller <strong>Geschäftspartner</strong> und bauen Sie sich Schritt für Schritt Ihre eigenen <strong>passiven Einnahmen</strong> auf.
                        </p>
                        <Button 
                            size="lg" 
                            className="bg-white text-primary font-bold hover:bg-primary h-16 px-12 rounded-full text-lg shadow-xl hover:scale-105 transition-all duration-300 border-4 border-primary/20"
                            onClick={openResellerContact}
                        >
                            <MessageCircle className="mr-2 h-6 w-6" />
                            Jetzt Kontakt aufnehmen & Starten
                        </Button>
                        <p className="mt-6 text-sm text-gray-400">Keine versteckten Gebühren. Volle Transparenz. 100% <strong>skalierbar</strong>.</p>
                    </div>
                </div>
             </motion.div>
          </section>
        </main>
        
        <FooterDE contactData={contactData} siteData={siteData} />
        {chatBotData?.enabled && <ChatBot chatData={chatBotData} contactData={contactData} siteTexts={siteTexts} />}
      </div>
    </>
  );
};

export default ResellerPageDE;
