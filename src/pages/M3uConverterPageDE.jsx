import React, { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import { useTestModal } from '@/contexts/TestModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Wand2, Copy, Check, Tv, User, KeyRound, Link as LinkIcon, HelpCircle, GitBranch, PlayCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/constants/siteUrl';

const M3uToXtreamConverterDE = () => {
    const { toast } = useToast();
    const [m3uUrl, setM3uUrl] = useState('');
    const [xtreamInfo, setXtreamInfo] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleParseUrl = () => {
        if (!m3uUrl) {
            toast({
                title: "Fehler",
                description: "Bitte fügen Sie eine M3U-URL ein.",
                variant: "destructive",
            });
            return;
        }

        try {
            const url = new URL(m3uUrl);
            const server = `${url.protocol}//${url.host}`;
            const username = url.searchParams.get('username');
            const password = url.searchParams.get('password');

            if (!username || !password) {
                throw new Error("Ungültiges M3U-Link-Format.");
            }

            setXtreamInfo({ server, username, password });
            toast({
                title: "Erfolgreich!",
                description: "Xtream-Informationen wurden erfolgreich extrahiert.",
                className: "bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-none shadow-xl",
            });
        } catch (error) {
            setXtreamInfo(null);
            toast({
                title: "Fehler",
                description: "Ungültiger M3U-Link. Bitte überprüfen Sie den Link.",
                variant: "destructive",
            });
        }
    };
    
    const handleCopy = (field, text) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast({
            title: "Kopiert!",
            description: `${field} in die Zwischenablage kopiert.`,
            className: "bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-none shadow-xl",
        });
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="m3uUrl" className="flex items-center gap-2 mb-2 text-base text-gray-300 font-medium">
                    <LinkIcon className="w-4 h-4 text-[#e50914]" />
                    Ihre M3U-URL
                </Label>
                <div className="relative group">
                    <Input
                        id="m3uUrl"
                        name="m3uUrl"
                        type="text"
                        placeholder="http://example.com:8080/get.php?username=..."
                        value={m3uUrl}
                        onChange={(e) => setM3uUrl(e.target.value)}
                        className="bg-black/20 border-white/10 focus:ring-[#e50914] focus:border-[#e50914] h-14 text-lg text-white placeholder:text-gray-500 transition-all duration-300 group-hover:border-[#e50914]/30 pl-4 rounded-2xl shadow-inner"
                    />
                </div>
            </div>
            
            <Button 
                onClick={handleParseUrl} 
                className="w-full bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold h-14 text-lg shadow-xl shadow-[#e50914]/40 hover:shadow-[#e50914]/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-[#e50914]/20"
            >
                <GitBranch className="w-5 h-5 mr-2" />
                Informationen extrahieren
            </Button>

            {xtreamInfo && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-6 border-t border-white/10 mt-6"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShieldCheck className="w-6 h-6 text-[#e50914]" />
                        <h3 className="text-xl font-bold text-white">Ihre Xtream-Informationen</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="relative group">
                            <Label className="text-[#e50914] text-xs font-bold uppercase tracking-wider mb-1.5 block ml-1">Server-URL (DNS)</Label>
                            <Input type="text" readOnly value={xtreamInfo.server} className="bg-black/40 border-white/10 text-white pr-14 h-14 rounded-2xl font-mono text-sm shadow-inner" />
                            <Button variant="ghost" size="icon" className="absolute right-2 top-[29px] h-10 w-10 text-gray-400 hover:text-white hover:bg-[#e50914]/20 rounded-xl transition-all" onClick={() => handleCopy('Server', xtreamInfo.server)}>
                                {copiedField === 'Server' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                         <div className="relative group">
                            <Label className="text-[#e50914] text-xs font-bold uppercase tracking-wider mb-1.5 block ml-1">Benutzername</Label>
                            <Input type="text" readOnly value={xtreamInfo.username} className="bg-black/40 border-white/10 text-white pr-14 h-14 rounded-2xl font-mono text-sm shadow-inner" />
                            <Button variant="ghost" size="icon" className="absolute right-2 top-[29px] h-10 w-10 text-gray-400 hover:text-white hover:bg-[#e50914]/20 rounded-xl transition-all" onClick={() => handleCopy('Benutzername', xtreamInfo.username)}>
                                {copiedField === 'Benutzername' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                         <div className="relative group">
                            <Label className="text-[#e50914] text-xs font-bold uppercase tracking-wider mb-1.5 block ml-1">Passwort</Label>
                            <Input type="text" readOnly value={xtreamInfo.password} className="bg-black/40 border-white/10 text-white pr-14 h-14 rounded-2xl font-mono text-sm shadow-inner" />
                            <Button variant="ghost" size="icon" className="absolute right-2 top-[29px] h-10 w-10 text-gray-400 hover:text-white hover:bg-[#e50914]/20 rounded-xl transition-all" onClick={() => handleCopy('Passwort', xtreamInfo.password)}>
                                {copiedField === 'Passwort' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const M3uGeneratorDE = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        serverUrl: '',
        username: '',
        password: '',
    });
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generatedUrl = useMemo(() => {
        if (!formData.serverUrl || !formData.username || !formData.password) {
            return '';
        }
        const cleanUrl = formData.serverUrl.replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
        return `http://${cleanUrl}/get.php?username=${formData.username}&password=${formData.password}&type=m3u_plus&output=ts`;
    }, [formData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        toast({
            title: "Erfolgreich!",
            description: "Ihre M3U-URL wurde in die Zwischenablage kopiert.",
            className: "bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-none shadow-xl",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
                <div>
                    <Label htmlFor="serverUrl" className="flex items-center gap-2 mb-2 text-base text-gray-300 font-medium">
                        <Tv className="w-4 h-4 text-[#e50914]" />
                        Server-URL (DNS)
                    </Label>
                    <Input
                        id="serverUrl"
                        name="serverUrl"
                        type="text"
                        placeholder="z.B. server.com:8080"
                        value={formData.serverUrl}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/10 focus:ring-[#e50914] focus:border-[#e50914] h-14 text-lg text-white placeholder:text-gray-500 transition-all duration-300 hover:border-[#e50914]/30 pl-4 rounded-2xl shadow-inner"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="username" className="flex items-center gap-2 mb-2 text-base text-gray-300 font-medium">
                            <User className="w-4 h-4 text-[#e50914]" />
                            Benutzername
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Ihr Benutzername"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-black/20 border-white/10 focus:ring-[#e50914] focus:border-[#e50914] h-14 text-lg text-white placeholder:text-gray-500 transition-all duration-300 hover:border-[#e50914]/30 pl-4 rounded-2xl shadow-inner"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-base text-gray-300 font-medium">
                            <KeyRound className="w-4 h-4 text-[#e50914]" />
                            Passwort
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="text" 
                            placeholder="Ihr Passwort"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-black/20 border-white/10 focus:ring-[#e50914] focus:border-[#e50914] h-14 text-lg text-white placeholder:text-gray-500 transition-all duration-300 hover:border-[#e50914]/30 pl-4 rounded-2xl shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {generatedUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-white/10 mt-6"
                >
                    <div className="bg-gradient-to-br from-[#e50914]/30 to-[#b20710]/30 border border-[#e50914]/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-white text-center mb-4 flex items-center justify-center gap-2">
                            <PlayCircle className="w-6 h-6 text-[#e50914]" />
                            Ihre generierte M3U-URL
                        </h3>
                        <div className="relative">
                            <Input
                                type="text"
                                readOnly
                                value={generatedUrl}
                                className="bg-black/50 border-[#e50914]/30 text-[#e50914] pr-36 text-sm md:text-base h-16 rounded-2xl font-mono shadow-inner"
                            />
                            <Button
                                onClick={handleCopy}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 shadow-xl transition-all duration-300 rounded-xl font-bold ${copied ? 'bg-gradient-to-r from-green-500 to-[#b20710] text-white' : 'bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white hover:scale-105'}`}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Kopiert</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Kopieren</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};


const M3uConverterPageDE = ({ siteData }) => {
  const { openTestModal } = useTestModal();
  const { contactData, siteTexts, faqData } = siteData || {};
  
  const seo = {
    title: 'M3U erstellen - IPTV M3U Playlist für Deutschland | QruzeTV',
    description: 'Erstellen Sie mühelos Ihre IPTV M3U Playlist mit unserem kostenlosen Tool. Generieren Sie IPTV M3U Links für Ihr IPTV Setup in Deutschland und genießen Sie Premium Streaming.',
    keywords: ['M3U erstellen', 'IPTV M3U Playlist', 'IPTV M3U Link', 'IPTV Deutschland', 'IPTV Setup', 'Xtream Codes Extraktor'],
    canonicalUrl: `${SITE_URL}/de/m3u-olustur`,
    ogImage: contactData?.logoUrl,
  };

  return (
    <>
      <SEOHead {...seo} />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-white/20">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />

        <main className="relative z-20 flex w-full flex-grow flex-col pt-24">
          <section className="border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#141414]">
            <div className="container mx-auto px-4 py-12 md:py-20">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-[#e50914]/10 to-[#b20710]/10 border border-[#e50914]/20 mb-6 backdrop-blur-md shadow-2xl">
                <Wand2 className="h-10 w-10 text-[#e50914]" />
              </div>
              {/* Primary H1 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e50914] to-[#b20710]">
                  M3U erstellen - IPTV M3U Playlist für Deutschland
                </span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Erstellen Sie mühelos Ihre IPTV M3U Playlist mit unserem kostenlosen Tool. Generieren Sie individuelle IPTV M3U Links für Ihr IPTV Setup in Deutschland und genießen Sie sofort Ihre Lieblingssender in bester Qualität. Ob auf dem Smart TV, PC oder Smartphone – das M3U erstellen war noch nie so unkompliziert. Starten Sie jetzt und optimieren Sie Ihr Streaming-Erlebnis im Handumdrehen.
              </p>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-20"
            >
                <Tabs defaultValue="generator" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/10 h-16 p-1.5 rounded-2xl mb-6 backdrop-blur-xl shadow-2xl">
                        <TabsTrigger 
                            value="generator" 
                            className="h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e50914] data-[state=active]:to-[#b20710] data-[state=active]:text-white text-gray-400 font-bold data-[state=active]:shadow-lg data-[state=active]:shadow-[#e50914]/50 transition-all duration-300 text-base"
                        >
                            M3U Generator
                        </TabsTrigger>
                        <TabsTrigger 
                            value="extractor" 
                            className="h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e50914] data-[state=active]:to-[#b20710] data-[state=active]:text-white text-gray-400 font-bold data-[state=active]:shadow-lg data-[state=active]:shadow-[#e50914]/50 transition-all duration-300 text-base"
                        >
                            Xtream Extraktor
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#e50914]/20 via-[#e50914]/20 to-[#b20710]/20 rounded-[2rem] blur-xl opacity-70"></div>
                        <TabsContent value="generator" className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl mt-0">
                            <h2 className="text-2xl font-bold text-white mb-6 hidden">M3U-Datei erstellen</h2>
                            <M3uGeneratorDE />
                        </TabsContent>
                        <TabsContent value="extractor" className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl mt-0">
                            <M3uToXtreamConverterDE />
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
            </div>
          </section>

          <section className="border-t border-white/5 bg-gradient-to-b from-[#141414] to-[#0a0a0a] py-12 md:py-16">
            <div className="container mx-auto px-4">
            {/* Comprehensive SEO Content Section */}
            <div
              className="max-w-4xl mx-auto prose prose-invert prose-cyan prose-lg prose-headings:text-white prose-a:text-[#e50914] hover:prose-a:text-[#e50914]"
            >
                <div className="text-gray-300 space-y-6 leading-relaxed bg-[#0a0a0a]/40 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
                    <h2 className="text-3xl font-bold mt-0 mb-6 border-b border-white/10 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b20710]">IPTV M3U Link erstellen - Einfach und schnell</h2>
                    <p>
                        Wenn Sie einen neuen IPTV-Dienst abonnieren, erhalten Sie in der Regel Zugangsdaten, die aus einer Server-URL, einem Benutzernamen und einem Passwort bestehen. Um diese Daten auf den meisten Smart TVs, Smartphones oder TV-Boxen nutzbar zu machen, müssen Sie einen IPTV M3U Link erstellen. Dieser Link bündelt Ihre Zugangsdaten in einer einzigen, standardisierten URL, die von nahezu allen modernen Mediaplayern problemlos gelesen werden kann. Der Prozess "M3U erstellen" ist mit unserem intuitiven Generator in Sekundenschnelle abgeschlossen. Sie geben lediglich Ihre Daten ein, klicken auf Generieren, und sofort steht Ihnen Ihre fertige IPTV M3U Playlist zur Verfügung, um in Ihre bevorzugte App importiert zu werden.
                    </p>
                    <p>
                        Ein großer Vorteil der Erstellung eines eigenen IPTV M3U Links liegt in der enormen Zeitersparnis und der Reduzierung von Tippfehlern, die häufig auftreten, wenn man komplizierte Zugangsdaten direkt über die Fernbedienung eines Fernsehers eingeben muss. Zudem bietet der generierte Link sofortigen Zugriff auf 10.000+ Sender, Filme und Serien, ohne dass eine zusätzliche, mühsame manuelle Konfiguration erforderlich ist. So wird das M3U erstellen zu einem essentiellen und mühelosen Schritt für jeden, der das Beste aus seinem Streaming-Erlebnis herausholen möchte.
                    </p>

                    <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-white/10 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b20710]">M3U Playlist für IPTV Setup Deutschland</h2>
                    <p>
                        Das IPTV Setup Deutschland erfordert eine zuverlässige und korrekt formatierte M3U Playlist, um eine stabile und hochauflösende Übertragung der gewünschten Inhalte zu gewährleisten. Auf dem deutschen Markt legen Nutzer besonderen Wert auf schnelles Umschalten (Zapping), minimale Pufferzeiten und eine hervorragende Bildqualität in Full HD oder 4K. Eine professionell generierte IPTV M3U Playlist ist das Herzstück dieses Setups. Sie teilt der Streaming-App genau mit, von welchem europäischen Server die Datenströme abgerufen werden sollen, und sorgt dafür, dass lokale deutsche Sender sowie internationale Premium-Kanäle reibungslos laden.
                    </p>
                    <p>
                        Für ein optimales IPTV Setup in Deutschland empfehlen wir die Nutzung leistungsstarker Player-Apps wie TiviMate, IPTV Smarters Pro oder Flix IPTV, die alle hervorragend mit M3U-Links harmonieren. Wenn Sie Ihre M3U erstellen, achten Sie darauf, dass der Link keine überflüssigen Leerzeichen enthält und sicher kopiert wird. Sobald die IPTV M3U Playlist in die App eingefügt wurde, synchronisiert sich das System automatisch mit dem Server und lädt die neuesten Kanallisten sowie den elektronischen Programmführer (EPG). Dies garantiert, dass Ihr IPTV Setup Deutschland stets auf dem neuesten Stand bleibt und Ihnen das ultimative Heimkino-Erlebnis bietet.
                    </p>

                    <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-white/10 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b20710]">Wie funktioniert M3U bei IPTV?</h2>
                    <p>
                        Eine M3U-Datei (Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator) ist technisch gesehen eine einfache Textdatei, die eine Liste von Medien-Links enthält. Ursprünglich für Audio-Playlists entwickelt, ist sie heute der absolute Standard im Bereich des Video-Streamings. Anstatt riesige Videodateien lokal zu speichern, enthält die IPTV M3U Playlist lediglich die exakten Internetadressen (URLs), unter denen die Live-Streams oder On-Demand-Inhalte auf den Servern des Anbieters zu finden sind. Sobald Ihr Player den IPTV M3U Link aufruft, liest er diese Adressen aus und stellt in Echtzeit eine direkte Verbindung zum Server her.
                    </p>
                    <p>
                        Im Gegensatz zur direkten Eingabe über die Xtream Codes API (wo Server, Nutzername und Passwort separat in die App eingetragen werden), kombiniert der M3U Link alle diese Informationen in einem langen String. Das bedeutet, wenn Sie eine M3U erstellen, übersetzen Sie im Grunde Ihre einzelnen Xtream-Zugangsdaten in ein universelles Format, das von buchstäblich jedem Player verstanden wird – von VLC auf dem PC bis hin zur dedizierten Smart TV App. Diese universelle Kompatibilität ist der Hauptgrund, warum die IPTV M3U Playlist die beliebteste Methode zur Einrichtung von Streaming-Diensten weltweit ist.
                    </p>

                    <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-white/10 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#b20710]">M3U erstellen - Schritt für Schritt</h2>
                    <p>
                        Der Prozess, um Ihre eigene IPTV M3U Playlist zu generieren, ist denkbar einfach und erfordert keinerlei technisches Vorwissen. Folgen Sie diesen simplen Schritten für ein perfektes Ergebnis:
                        <br/><br/>
                        <strong>Schritt 1: Zugangsdaten bereithalten.</strong> Suchen Sie die E-Mail oder Nachricht Ihres IPTV-Anbieters heraus. Sie benötigen die Server-URL (DNS), Ihren persönlichen Benutzernamen und Ihr Passwort.
                        <br/><br/>
                        <strong>Schritt 2: Daten in den Generator eingeben.</strong> Tragen Sie diese drei Informationen in die entsprechenden Felder unseres M3U Generators oben auf dieser Seite ein. Achten Sie darauf, keine versehentlichen Leerzeichen am Anfang oder Ende der Eingaben zu kopieren.
                        <br/><br/>
                        <strong>Schritt 3: IPTV M3U Link erstellen und kopieren.</strong> Sobald alle Felder ausgefüllt sind, generiert unser Tool automatisch Ihre persönliche IPTV M3U Playlist als Link. Klicken Sie einfach auf den "Kopieren" Button, um den Link in Ihre Zwischenablage zu speichern.
                    </p>
                    <p>
                        Sollten Sie umgekehrt bereits über einen langen M3U Link verfügen, diesen aber in seine Einzelteile (Server, Name, Passwort) zerlegen wollen, um ihn in einer App einzugeben, die nur Xtream Codes unterstützt, können Sie jederzeit auf unseren Tab "Xtream Extraktor" wechseln. Beide Tools stehen Ihnen völlig kostenlos zur Verfügung und verarbeiten Ihre Daten sicher lokal in Ihrem Browser, um Ihre Privatsphäre maximal zu schützen.
                    </p>
                    
                    <div className="mt-16 p-8 md:p-12 bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20 border border-[#e50914]/30 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e50914]/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Bereit für erstklassiges Streaming?</h3>
                            <p className="text-lg text-[#e50914]/80 mb-8">
                                Ihre IPTV M3U Playlist ist nun bereit. Nutzen Sie Ihren neu erstellten IPTV M3U Link jetzt für Ihr IPTV Setup in Deutschland und genießen Sie grenzenloses Premium Streaming auf all Ihren Geräten. Erleben Sie Fernsehen der nächsten Generation – stabil, hochauflösend und genau nach Ihren Wünschen.
                            </p>
                            <Link to="/de/pakete" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-[#e50914]/50">
                                Premium IPTV Pakete ansehen <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            </div>
          </section>

            <section
              className="relative z-[5] border-t border-white/5 bg-[#0a0a0a] py-12 md:mt-8 md:py-16"
              aria-labelledby="m3u-de-bottom-cta-title"
            >
              <div className="mx-auto max-w-4xl px-4">
                <div className="relative overflow-hidden rounded-3xl border border-[#e50914]/35 bg-gradient-to-br from-[#0a0a0a]/95 via-[#0c1222]/95 to-[#b20710]/90 p-8 shadow-[0_0_48px_rgba(229,9,20,0.12)] md:p-12">
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e50914]/25 blur-3xl"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -bottom-28 -left-20 h-52 w-52 rounded-full bg-primary/25 blur-3xl"
                    aria-hidden
                  />
                  <div className="relative z-10 text-center md:text-left">
                    <h2
                      id="m3u-de-bottom-cta-title"
                      className="text-2xl font-black tracking-tight text-white md:text-3xl"
                    >
                      Bereit für{' '}
                      <span className="bg-gradient-to-r from-[#e50914] to-[#b20710] bg-clip-text text-transparent">
                        Premium IPTV
                      </span>
                      ?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:mx-0">
                      Nach dem Erstellen Ihres M3U-Links brauchen Sie eine stabile Infrastruktur für Tausende Kanäle und
                      VOD. Pakete ansehen oder kostenlos testen.
                    </p>
                    <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap md:justify-start">
                      <Link to="/de/pakete" className="inline-flex sm:w-auto">
                        <Button className="h-14 w-full min-w-[200px] rounded-2xl bg-gradient-to-r from-[#e50914] to-[#b20710] px-8 text-base font-bold text-white shadow-lg transition hover:from-[#e50914] hover:to-[#b20710] sm:w-auto">
                          IPTV-Pakete ansehen
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        onClick={() => openTestModal()}
                        className="h-14 w-full min-w-[200px] rounded-2xl border-2 border-[#e50914]/55 bg-white/[0.06] px-8 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
                      >
                        Kostenlos testen
                      </Button>
                      <Link to="/de/einrichtung" className="inline-flex sm:w-auto">
                        <Button
                          variant="ghost"
                          className="h-14 w-full text-[#e50914] hover:bg-white/5 hover:text-[#e50914] sm:w-auto"
                        >
                          Einrichtungsanleitung →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          <section className="border-t border-white/5 bg-[#0a0a0a] py-12 md:py-16">
            <div className="container mx-auto px-4">
              <InternalLinkingOptimization currentPage="m3u" />
            </div>
          </section>
        </main>
        <FooterDE contactData={contactData} siteData={siteData} />
      </div>
    </>
  );
};

export default M3uConverterPageDE;