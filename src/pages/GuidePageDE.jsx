import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
} from 'lucide-react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import InternalLinkingHelper from '@/components/InternalLinkingHelper';
import { breadcrumbSchema, webPageSchema } from '@/utils/seoSchema';
import { defaultData } from '@/data/defaultSiteData';
import { SITE_URL } from '@/constants/siteUrl';

const metadata = {
  title: 'IPTV Anleitung Deutschland — Geräte & Einrichtung | QruzeTV',
  description:
    'IPTV in Deutschland Schritt für Schritt einrichten: passende Apps, Smart-TV-, Fire-TV-, Android-, iOS- und PC-Anleitungen plus Tipps gegen Ruckeln.',
  keywords: [
    'IPTV Anleitung Deutschland',
    'IPTV einrichten',
    'IPTV Smart TV Anleitung',
    'IPTV Fire TV Stick',
    'IPTV App Deutschland',
  ],
  h1: 'IPTV Anleitung für Deutschland: Geräte, Apps und Einrichtung',
};

const faqItems = [
  {
    question: 'Welche Internetgeschwindigkeit brauche ich für IPTV?',
    answer:
      'Für einen einzelnen HD-Stream sind mindestens 16 Mbit/s empfehlenswert. Für 4K sollten je nach Quelle 25 bis 50 Mbit/s stabil am Abspielgerät ankommen. Eine LAN-Verbindung ist meist zuverlässiger als WLAN.',
  },
  {
    question: 'Welche IPTV-App passt zu meinem Gerät?',
    answer:
      'Die passende App hängt vom Betriebssystem ab. Samsung nutzt Tizen, LG webOS; Android TV und Fire TV bieten andere Player als iPhone, iPad, Windows oder Mac. Nutzen Sie deshalb die jeweilige Geräteanleitung.',
  },
  {
    question: 'Warum ruckelt IPTV trotz schneller Internetleitung?',
    answer:
      'Häufig liegen die Ursachen bei instabilem WLAN, Paketverlust, einem überlasteten Gerät oder ungeeigneten Player-Einstellungen. Testen Sie zuerst LAN, starten Sie Router und App neu und prüfen Sie den Stream auf einem zweiten Gerät.',
  },
  {
    question: 'Ist IPTV in Deutschland legal?',
    answer:
      'IPTV ist eine legale Übertragungstechnik. Entscheidend ist, ob der Anbieter die erforderlichen Rechte an den angebotenen Inhalten besitzt. Achten Sie auf transparente Leistungen, Preise und Vertragsbedingungen.',
  },
];

const GuidePageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || defaultData;
  const canonicalUrl = `${SITE_URL}/de/guide/iptv-kurulum-rehberi/`;
  const jsonLd = [
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      lang: 'de',
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Einrichtung', path: '/de/einrichtung' },
      { name: 'IPTV Anleitung', path: '/de/guide/iptv-kurulum-rehberi' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={canonicalUrl} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <HeaderDE contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-32 pb-16 px-4">
          <article className="container mx-auto max-w-4xl bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12 shadow-2xl">
            <header className="mb-12 text-center">
              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full text-xs font-bold tracking-wider uppercase mb-6">
                Technischer Ratgeber
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-[#e50914] to-[#b20710]">
                {metadata.h1}
              </h1>
              <div className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto bg-[#0a0a0a]/50 p-6 md:p-8 rounded-2xl border border-slate-800 text-left">
                <p>
                  Diese Anleitung zeigt Ihnen, wie Sie <strong>IPTV in Deutschland</strong> auf Ihrem eigenen Gerät einrichten. Sie erfahren, welche App zu Ihrem Fernseher oder Betriebssystem passt, welche Internetleistung sinnvoll ist und wie Sie typische Verbindungsprobleme selbst beheben.
                </p>
                <p className="mt-4">
                  Wenn Sie noch keinen Zugang haben, beginnen Sie mit einem <Link to="/de/test/">kostenlosen Test</Link>. So prüfen Sie Senderauswahl, Bildqualität und Stabilität unter realen Bedingungen, bevor Sie ein Paket auswählen.
                </p>
              </div>
            </header>

            <div className="prose prose-invert max-w-none prose-lg prose-a:text-primary">
              <h2>Was ist IPTV und wie funktioniert es?</h2>
              <p>
                IPTV steht für Internet Protocol Television. Fernsehprogramme und Videoinhalte werden nicht über Satellit oder klassisches Kabel, sondern als Datenstrom über Ihre Internetverbindung übertragen. Zum Ansehen benötigen Sie einen Zugang, ein kompatibles Gerät und eine geeignete Player-App.
              </p>
              <p>
                Die tatsächliche Qualität hängt nicht nur von der gebuchten Bandbreite ab. Entscheidend sind auch WLAN-Qualität, Auslastung im Heimnetz, Leistung des Abspielgeräts und die Einstellungen des Players. Deshalb lohnt sich ein Test direkt auf dem Gerät, das später genutzt werden soll.
              </p>

              <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                <div className="p-7 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center">
                  <Wifi className="w-9 h-9 text-blue-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-white">Stabile Verbindung</h3>
                  <p className="text-sm text-slate-400">Mindestens 16 Mbit/s für HD; für 4K je nach Stream 25–50 Mbit/s. LAN ist die stabilste Wahl.</p>
                </div>
                <div className="p-7 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center">
                  <Tv className="w-9 h-9 text-green-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-white">Passendes Gerät</h3>
                  <p className="text-sm text-slate-400">Smart TV, Fire TV, Android TV, Smartphone, Tablet, Windows und Mac werden unterstützt.</p>
                </div>
                <div className="p-7 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center">
                  <Monitor className="w-9 h-9 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-white">Geeigneter Player</h3>
                  <p className="text-sm text-slate-400">Verwenden Sie eine App aus dem offiziellen Store Ihres Geräts und halten Sie sie aktuell.</p>
                </div>
              </div>

              <h2>IPTV nach Gerät einrichten</h2>
              <p>
                Wählen Sie die Anleitung für Ihr Betriebssystem. Jede Seite enthält passende App-Empfehlungen, Eingabeschritte und gerätespezifische Hinweise.
              </p>
              <div className="not-prose grid gap-4 sm:grid-cols-2 my-8">
                <Link to="/de/einrichtung/samsung-tv-iptv/" className="rounded-xl border border-slate-700 bg-black/30 p-5 hover:border-primary/60 transition-colors">
                  <Tv className="h-6 w-6 text-primary mb-3" />
                  <strong className="block text-white">Samsung TV</strong>
                  <span className="text-sm text-slate-400">Tizen-App installieren und Zugang einrichten</span>
                </Link>
                <Link to="/de/einrichtung/lg-tv-iptv/" className="rounded-xl border border-slate-700 bg-black/30 p-5 hover:border-primary/60 transition-colors">
                  <Tv className="h-6 w-6 text-primary mb-3" />
                  <strong className="block text-white">LG Smart TV</strong>
                  <span className="text-sm text-slate-400">IPTV auf webOS Schritt für Schritt</span>
                </Link>
                <Link to="/de/einrichtung/android-tv/" className="rounded-xl border border-slate-700 bg-black/30 p-5 hover:border-primary/60 transition-colors">
                  <Monitor className="h-6 w-6 text-primary mb-3" />
                  <strong className="block text-white">Android TV & Fire TV</strong>
                  <span className="text-sm text-slate-400">Player wählen und Xtream-Daten eingeben</span>
                </Link>
                <Link to="/de/einrichtung/ios/" className="rounded-xl border border-slate-700 bg-black/30 p-5 hover:border-primary/60 transition-colors">
                  <Smartphone className="h-6 w-6 text-primary mb-3" />
                  <strong className="block text-white">iPhone & iPad</strong>
                  <span className="text-sm text-slate-400">Geeignete iOS-App auswählen</span>
                </Link>
              </div>

              <h2>Einrichtung in fünf Schritten</h2>
              <ol className="space-y-4">
                <li><strong>Gerät und App festlegen:</strong> Nutzen Sie die gerätespezifische Anleitung und laden Sie die App aus einer offiziellen Quelle.</li>
                <li><strong>Internet prüfen:</strong> Führen Sie den Geschwindigkeitstest am Fernseher oder Streaming-Gerät durch, nicht nur am Smartphone.</li>
                <li><strong>Zugangsdaten eingeben:</strong> Tragen Sie Server-Adresse, Benutzername und Passwort exakt und ohne zusätzliche Leerzeichen ein.</li>
                <li><strong>Senderliste laden:</strong> Warten Sie den ersten vollständigen Abgleich ab und aktivieren Sie bei Bedarf den EPG.</li>
                <li><strong>Qualität testen:</strong> Prüfen Sie mehrere HD- und 4K-Inhalte zu unterschiedlichen Tageszeiten.</li>
              </ol>

              <h2>So vermeiden Sie Ruckeln und Aussetzer</h2>
              <ul>
                <li>Verbinden Sie TV oder Streaming-Box nach Möglichkeit per Ethernet-Kabel.</li>
                <li>Verwenden Sie bei WLAN das 5-GHz-Band und vermeiden Sie große Hindernisse zwischen Router und Gerät.</li>
                <li>Schließen Sie parallele Downloads und unnötige Apps im Hintergrund.</li>
                <li>Leeren Sie den App-Cache und starten Sie Router sowie Gerät neu, bevor Sie Einstellungen verändern.</li>
                <li>Vergleichen Sie Hardware- und Software-Decoding, wenn Ton oder Bild nicht korrekt wiedergegeben wird.</li>
              </ul>

              <div className="not-prose my-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 shrink-0 text-amber-300" />
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Rechtlicher Hinweis</h2>
                    <p className="text-slate-300 leading-relaxed">
                      IPTV ist eine Übertragungstechnik. Nutzen Sie nur Angebote, deren Inhalte rechtmäßig bereitgestellt werden, und prüfen Sie vor dem Kauf Leistungen, Preise, Laufzeit und Kündigungsbedingungen.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Häufige Fragen zur IPTV-Einrichtung</h2>
              <div className="not-prose space-y-4">
                {faqItems.map((item) => (
                  <section key={item.question} className="rounded-xl border border-slate-800 bg-black/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{item.question}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                  </section>
                ))}
              </div>
            </div>

            <section className="mt-16 rounded-2xl border border-slate-800 bg-black/30 p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Auf dem eigenen Gerät ausprobieren</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                Testen Sie zuerst Verbindung, App und Bildqualität. Anschließend können Sie Laufzeit und Paket passend zu Ihrem Haushalt auswählen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/de/test/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b20710] px-7 py-4 font-bold text-white">
                  <CheckCircle2 className="h-5 w-5" /> Kostenlos testen
                </Link>
                <Link to="/de/pakete/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-black px-7 py-4 font-bold text-white">
                  <Tv className="h-5 w-5" /> Pakete vergleichen
                </Link>
              </div>
            </section>

            <InternalLinkingHelper currentPage="/de/guide/iptv-kurulum-rehberi" />
          </article>
        </main>

        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default GuidePageDE;
