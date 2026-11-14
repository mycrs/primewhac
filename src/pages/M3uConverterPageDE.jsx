import React, { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import { useTestModal } from '@/contexts/TestModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Wand2, 
  Copy, 
  Check, 
  Tv, 
  User, 
  KeyRound, 
  Link as LinkIcon, 
  HelpCircle, 
  GitBranch, 
  PlayCircle, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Smartphone,
  Server,
  Sparkles,
  RefreshCw,
  Lock,
  Layers
} from 'lucide-react';
import { SITE_URL } from '@/constants/siteUrl';

const M3uToXtreamConverterDE = () => {
    const { toast } = useToast();
    const [m3uUrl, setM3uUrl] = useState('');
    const [xtreamInfo, setXtreamInfo] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleParseUrl = () => {
        if (!m3uUrl.trim()) {
            toast({
                title: "Fehlende Eingabe",
                description: "Bitte fügen Sie Ihre M3U-URL in das Eingabefeld ein.",
                variant: "destructive",
            });
            return;
        }

        try {
            const url = new URL(m3uUrl.trim());
            const server = `${url.protocol}//${url.host}`;
            const username = url.searchParams.get('username');
            const password = url.searchParams.get('password');

            if (!username || !password) {
                throw new Error("Ungültiges M3U-Link-Format. Benutzername oder Passwort fehlen.");
            }

            setXtreamInfo({ server, username, password });
            toast({
                title: "Extraktion erfolgreich!",
                description: "Xtream Codes API Zugangsdaten wurden extrahiert.",
                className: "bg-red-600 text-white border-none shadow-xl",
            });
        } catch (error) {
            setXtreamInfo(null);
            toast({
                title: "Format-Fehler",
                description: "Ungültiger M3U-Link. Bitte überprüfen Sie, ob die URL mit 'http://' beginnt und Parameter enthält.",
                variant: "destructive",
            });
        }
    };
    
    const handleCopy = (field, text) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast({
            title: "Kopiert!",
            description: `${field} wurde in die Zwischenablage kopiert.`,
            className: "bg-red-600 text-white border-none shadow-xl",
        });
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="m3uUrl" className="flex items-center gap-2 mb-2.5 text-sm md:text-base text-slate-300 font-medium">
                    <LinkIcon className="w-4 h-4 text-red-500" />
                    Ihre M3U-URL
                </Label>
                <div className="relative">
                    <Input
                        id="m3uUrl"
                        name="m3uUrl"
                        type="text"
                        placeholder="http://server.com:8080/get.php?username=name&password=pass..."
                        value={m3uUrl}
                        onChange={(e) => setM3uUrl(e.target.value)}
                        className="bg-black/40 border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 h-14 text-sm md:text-base text-white placeholder:text-slate-500 transition-all rounded-2xl shadow-inner font-mono pl-4 pr-10"
                    />
                    {m3uUrl && (
                        <button 
                            onClick={() => { setM3uUrl(''); setXtreamInfo(null); }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            Leeren
                        </button>
                    )}
                </div>
            </div>
            
            <Button 
                onClick={handleParseUrl} 
                className="w-full bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold h-14 text-base md:text-lg shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:shadow-[0_0_40px_rgba(229,9,20,0.5)] transition-all rounded-2xl cursor-pointer"
            >
                <GitBranch className="w-5 h-5 mr-2" />
                Xtream Codes Extrahieren
            </Button>

            {xtreamInfo && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 pt-6 border-t border-white/10 mt-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h3 className="text-base md:text-lg font-display font-bold text-white">Extrahierte Zugangsdaten</h3>
                        </div>
                        <span className="text-[11px] font-mono font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-900/50">
                            Bereit
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3.5">
                        {/* Server */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0 flex-grow">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                                    Server-URL (DNS)
                                </span>
                                <p className="font-mono text-sm text-slate-200 truncate select-all">{xtreamInfo.server}</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCopy('Server-URL', xtreamInfo.server)}
                                className="h-9 px-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white flex-shrink-0"
                            >
                                {copiedField === 'Server-URL' ? <Check className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5 text-slate-400" />}
                                {copiedField === 'Server-URL' ? 'Kopiert' : 'Kopieren'}
                            </Button>
                        </div>

                        {/* Username */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0 flex-grow">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                                    Benutzername (Username)
                                </span>
                                <p className="font-mono text-sm text-slate-200 truncate select-all">{xtreamInfo.username}</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCopy('Benutzername', xtreamInfo.username)}
                                className="h-9 px-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white flex-shrink-0"
                            >
                                {copiedField === 'Benutzername' ? <Check className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5 text-slate-400" />}
                                {copiedField === 'Benutzername' ? 'Kopiert' : 'Kopieren'}
                            </Button>
                        </div>

                        {/* Password */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0 flex-grow">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                                    Passwort (Password)
                                </span>
                                <p className="font-mono text-sm text-slate-200 truncate select-all">{xtreamInfo.password}</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCopy('Passwort', xtreamInfo.password)}
                                className="h-9 px-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white flex-shrink-0"
                            >
                                {copiedField === 'Passwort' ? <Check className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5 text-slate-400" />}
                                {copiedField === 'Passwort' ? 'Kopiert' : 'Kopieren'}
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
        if (!formData.serverUrl.trim() || !formData.username.trim() || !formData.password.trim()) {
            return '';
        }
        const cleanUrl = formData.serverUrl.trim().replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
        return `http://${cleanUrl}/get.php?username=${formData.username.trim()}&password=${formData.password.trim()}&type=m3u_plus&output=ts`;
    }, [formData]);

    const handleCopy = () => {
        if (!generatedUrl) return;
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        toast({
            title: "Erfolgreich!",
            description: "Ihre M3U-URL wurde in die Zwischenablage kopiert.",
            className: "bg-red-600 text-white border-none shadow-xl",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <div>
                    <Label htmlFor="serverUrl" className="flex items-center gap-2 mb-2 text-sm md:text-base text-slate-300 font-medium">
                        <Server className="w-4 h-4 text-red-500" />
                        Server-URL oder IP (DNS)
                    </Label>
                    <Input
                        id="serverUrl"
                        name="serverUrl"
                        type="text"
                        placeholder="z.B. vip.server.com:8080 oder 185.x.x.x:80"
                        value={formData.serverUrl}
                        onChange={handleInputChange}
                        className="bg-black/40 border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 h-14 text-sm md:text-base text-white placeholder:text-slate-500 transition-all rounded-2xl shadow-inner font-mono pl-4"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="username" className="flex items-center gap-2 mb-2 text-sm md:text-base text-slate-300 font-medium">
                            <User className="w-4 h-4 text-red-500" />
                            Benutzername
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Ihr Zugangs-Benutzername"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-black/40 border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 h-14 text-sm md:text-base text-white placeholder:text-slate-500 transition-all rounded-2xl shadow-inner font-mono pl-4"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-sm md:text-base text-slate-300 font-medium">
                            <KeyRound className="w-4 h-4 text-red-500" />
                            Passwort
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="text" 
                            placeholder="Ihr Zugangs-Passwort"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-black/40 border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 h-14 text-sm md:text-base text-white placeholder:text-slate-500 transition-all rounded-2xl shadow-inner font-mono pl-4"
                        />
                    </div>
                </div>
            </div>

            {/* GENERATED RESULT CONSOLE */}
            {generatedUrl ? (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="pt-6 border-t border-white/10 mt-6"
                >
                    <div className="bg-[#08090d] border border-red-500/40 p-6 md:p-7 rounded-3xl shadow-[0_10px_35px_rgba(229,9,20,0.15)] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <h3 className="text-sm md:text-base font-display font-bold text-white flex items-center gap-1.5">
                                    <PlayCircle className="w-4 h-4 text-red-500" />
                                    Ihre generierte M3U-URL
                                </h3>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                m3u_plus · ts
                            </span>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={generatedUrl}
                                className="w-full bg-black/60 border border-white/10 text-red-400 pr-32 text-xs md:text-sm h-14 rounded-2xl font-mono px-4 shadow-inner select-all focus:outline-none"
                            />
                            <Button
                                onClick={handleCopy}
                                className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-4 md:px-5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                                    copied 
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md'
                                }`}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Kopiert</span>
                                ) : (
                                    <span className="flex items-center gap-1.5"><Copy className="w-4 h-4" /> Kopieren</span>
                                )}
                            </Button>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                            💡 Fügen Sie diesen Link direkt in Ihrer IPTV App (TiviMate, Smart IPTV, Smarters Pro, Apple TV) als M3U-Playlist ein.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-xs text-slate-400 font-mono">
                        Sobald alle 3 Felder ausgefüllt sind, wird Ihre universelle M3U Plus URL automatisch generiert.
                    </p>
                </div>
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

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#07080b] font-sans text-white selection:bg-red-500/30 selection:text-white">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />

        <main className="relative z-20 flex w-full flex-grow flex-col pt-20">
          
          {/* HERO SECTION DE */}
          <section className="relative border-b border-white/5 bg-[#07080b] py-16 md:py-24 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[22rem] bg-gradient-to-tr from-red-600/15 via-red-950/20 to-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto mb-12"
              >
                {/* Live Client-Side Security Pill */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-red-500/30 text-xs md:text-sm font-mono font-medium text-slate-200 mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% CLIENT-SEITIG · SICHERER M3U KONVERTER</span>
                </div>

                {/* Primary H1 */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight mb-5 leading-tight">
                  M3U erstellen — <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                    IPTV M3U Playlist für Deutschland
                  </span>
                </h1>

                <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
                  Erstellen Sie mühelos Ihre IPTV M3U Playlist mit unserem kostenlosen Tool. Generieren Sie individuelle IPTV M3U Links für Ihr IPTV Setup in Deutschland und genießen Sie sofort Ihre Lieblingssender in bester Qualität.
                </p>

                {/* 3 Reassurance Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-8 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Keine Datenspeicherung</p>
                      <p className="text-[11px] text-slate-400">100% im Browser verarbeitet</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Bidirektionale Konvertierung</p>
                      <p className="text-[11px] text-slate-400">M3U ⇄ Xtream Codes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Volle Kompatibilität</p>
                      <p className="text-[11px] text-slate-400">Smart TV, Box & Mobil</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* INTERACTIVE CONVERTER TABS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="max-w-2xl mx-auto mb-10"
              >
                <Tabs defaultValue="generator" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#0c0d12]/90 border border-white/10 h-15 p-1.5 rounded-2xl mb-6 backdrop-blur-xl shadow-2xl">
                        <TabsTrigger 
                            value="generator" 
                            className="h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white text-slate-400 font-bold data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/30 transition-all text-sm md:text-base cursor-pointer"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            M3U Generator
                        </TabsTrigger>
                        <TabsTrigger 
                            value="extractor" 
                            className="h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white text-slate-400 font-bold data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/30 transition-all text-sm md:text-base cursor-pointer"
                        >
                            <GitBranch className="w-4 h-4 mr-2" />
                            Xtream Extraktor
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative">
                        <TabsContent value="generator" className="relative bg-[#0c0d12]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-9 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] mt-0">
                            <M3uGeneratorDE />
                        </TabsContent>
                        <TabsContent value="extractor" className="relative bg-[#0c0d12]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-9 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] mt-0">
                            <M3uToXtreamConverterDE />
                        </TabsContent>
                    </div>
                </Tabs>
              </motion.div>
            </div>
          </section>

          {/* STRUCTURED KNOWLEDGE BASE SECTION */}
          <section className="border-t border-white/5 bg-[#07080b] py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-5xl">

              {/* 3 Steps Showcase */}
              <div className="mb-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" />
                    <span>SCHRITT FÜR SCHRITT</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
                    In 3 Schritten M3U erstellen und streamen
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base">
                    Keine technischen Vorkenntnisse nötig – in wenigen Sekunden einsatzbereit auf Ihrem Gerät.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-[#0c0d12]/80 border border-white/10 hover:border-red-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-3xl font-display font-black text-red-500/40 block mb-2 font-mono">01</span>
                      <h3 className="text-lg font-bold text-white mb-2">Daten eingeben</h3>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                        Tragen Sie Server-URL (DNS), Benutzernamen und Passwort Ihres Anbieters in die entsprechenden Felder ein.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0c0d12]/80 border border-white/10 hover:border-red-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-3xl font-display font-black text-red-500/40 block mb-2 font-mono">02</span>
                      <h3 className="text-lg font-bold text-white mb-2">M3U Link kopieren</h3>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                        Kopieren Sie mit einem Klick die automatisch generierte, universelle M3U Plus URL in Ihre Zwischenablage.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0c0d12]/80 border border-white/10 hover:border-red-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-3xl font-display font-black text-red-500/40 block mb-2 font-mono">03</span>
                      <h3 className="text-lg font-bold text-white mb-2">Im Player einfügen</h3>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                        Fügen Sie die M3U Playlist in Ihre Smart TV App oder Ihren TV Box Player ein und genießen Sie sofort 10.000+ Sender.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive German SEO Content Section */}
              <div className="bg-[#0c0d12]/70 p-8 md:p-12 rounded-3xl border border-white/10 space-y-10 text-slate-300 leading-relaxed font-light text-sm md:text-base">
                  
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                      IPTV M3U Link erstellen - Einfach und schnell
                    </h2>
                    <p className="mb-4">
                        Wenn Sie einen neuen IPTV-Dienst abonnieren, erhalten Sie in der Regel Zugangsdaten, die aus einer Server-URL, einem Benutzernamen und einem Passwort bestehen. Um diese Daten auf den meisten Smart TVs, Smartphones oder TV-Boxen nutzbar zu machen, müssen Sie einen IPTV M3U Link erstellen. Dieser Link bündelt Ihre Zugangsdaten in einer einzigen, standardisierten URL, die von nahezu allen modernen Mediaplayern problemlos gelesen werden kann. Der Prozess "M3U erstellen" ist mit unserem intuitiven Generator in Sekundenschnelle abgeschlossen. Sie geben lediglich Ihre Daten ein, klicken auf Generieren, und sofort steht Ihnen Ihre fertige IPTV M3U Playlist zur Verfügung, um in Ihre bevorzugte App importiert zu werden.
                    </p>
                    <p>
                        Ein großer Vorteil der Erstellung eines eigenen IPTV M3U Links liegt in der enormen Zeitersparnis und der Reduzierung von Tippfehlern, die häufig auftreten, wenn man komplizierte Zugangsdaten direkt über die Fernbedienung eines Fernsehers eingeben muss. Zudem bietet der generierte Link sofortigen Zugriff auf 10.000+ Sender, Filme und Serien, ohne dass eine zusätzliche, mühsame manuelle Konfiguration erforderlich ist. So wird das M3U erstellen zu einem essentiellen und mühelosen Schritt für jeden, der das Beste aus seinem Streaming-Erlebnis herausholen möchte.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                      M3U Playlist für IPTV Setup Deutschland
                    </h2>
                    <p className="mb-4">
                        Das IPTV Setup Deutschland erfordert eine zuverlässige und korrekt formatierte M3U Playlist, um eine stabile und hochauflösende Übertragung der gewünschten Inhalte zu gewährleisten. Auf dem deutschen Markt legen Nutzer besonderen Wert auf schnelles Umschalten (Zapping), minimale Pufferzeiten und eine hervorragende Bildqualität in Full HD oder 4K. Eine professionell generierte IPTV M3U Playlist ist das Herzstück dieses Setups. Sie teilt der Streaming-App genau mit, von welchem europäischen Server die Datenströme abgerufen werden sollen, und sorgt dafür, dass lokale deutsche Sender sowie internationale Premium-Kanäle reibungslos laden.
                    </p>
                    <p>
                        Für ein optimales IPTV Setup in Deutschland empfehlen wir die Nutzung leistungsstarker Player-Apps wie TiviMate, IPTV Smarters Pro oder Flix IPTV, die alle hervorragend mit M3U-Links harmonieren. Wenn Sie Ihre M3U erstellen, achten Sie darauf, dass der Link keine überflüssigen Leerzeichen enthält und sicher kopiert wird. Sobald die IPTV M3U Playlist in die App eingefügt wurde, synchronisiert sich das System automatisch mit dem Server und lädt die neuesten Kanallisten sowie den elektronischen Programmführer (EPG). Dies garantiert, dass Ihr IPTV Setup Deutschland stets auf dem neuesten Stand bleibt und Ihnen das ultimative Heimkino-Erlebnis bietet.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                      Wie funktioniert M3U bei IPTV?
                    </h2>
                    <p className="mb-4">
                        Eine M3U-Datei (Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator) ist technisch gesehen eine einfache Textdatei, die eine Liste von Medien-Links enthält. Ursprünglich für Audio-Playlists entwickelt, ist sie heute der absolute Standard im Bereich des Video-Streamings. Anstatt riesige Videodateien lokal zu speichern, enthält die IPTV M3U Playlist lediglich die exakten Internetadressen (URLs), unter denen die Live-Streams oder On-Demand-Inhalte auf den Servern des Anbieters zu finden sind. Sobald Ihr Player den IPTV M3U Link aufruft, liest er diese Adressen aus und stellt in Echtzeit eine direkte Verbindung zum Server her.
                    </p>
                    <p>
                        Im Gegensatz zur direkten Eingabe über die Xtream Codes API (wo Server, Nutzername und Passwort separat in die App eingetragen werden), kombiniert der M3U Link alle diese Informationen in einem langen String. Das bedeutet, wenn Sie eine M3U erstellen, übersetzen Sie im Grunde Ihre einzelnen Xtream-Zugangsdaten in ein universelles Format, das von buchstäblich jedem Player verstanden wird – von VLC auf dem PC bis hin zur dedizierten Smart TV App. Diese universelle Kompatibilität ist der Hauptgrund, warum die IPTV M3U Playlist die beliebteste Methode zur Einrichtung von Streaming-Diensten weltweit ist.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                      M3U erstellen - Schritt für Schritt
                    </h2>
                    <p className="mb-4">
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
                  </div>

              </div>
            </div>
          </section>

          {/* ARTISAN BOTTOM CTA DE */}
          <section
            className="relative z-[5] border-t border-white/5 bg-[#07080b] py-16 md:py-20"
            aria-labelledby="m3u-de-bottom-cta-title"
          >
            <div className="container mx-auto max-w-4xl px-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0d12]/95 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-28 -left-20 h-52 w-52 rounded-full bg-red-950/25 blur-3xl"
                  aria-hidden
                />
                <div className="relative z-10 text-center md:text-left">
                  <h2
                    id="m3u-de-bottom-cta-title"
                    className="text-2xl md:text-4xl font-display font-extrabold tracking-tight text-white"
                  >
                    Bereit für{' '}
                    <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                      Premium IPTV
                    </span>
                    ?
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-300 md:mx-0 font-light">
                    Nach dem Erstellen Ihres M3U-Links brauchen Sie eine stabile Infrastruktur für Tausende Kanäle und
                    VOD. Pakete ansehen oder kostenlosen Testzugang anfordern.
                  </p>
                  <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap md:justify-start">
                    <Link to="/de/pakete/" className="inline-flex sm:w-auto">
                      <Button className="h-13 w-full min-w-[200px] rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 text-base font-bold text-white shadow-[0_0_25px_rgba(229,9,20,0.35)] transition sm:w-auto">
                        <Layers className="w-4 h-4 mr-2" />
                        IPTV-Pakete ansehen
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      onClick={() => openTestModal()}
                      className="h-13 w-full min-w-[200px] rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-8 text-base font-bold text-white backdrop-blur-sm transition sm:w-auto"
                    >
                      <PlayCircle className="w-4 h-4 mr-2 text-red-500" />
                      Kostenlos testen
                    </Button>
                    <Link to="/de/einrichtung/" className="inline-flex sm:w-auto">
                      <Button
                        variant="ghost"
                        className="h-13 w-full text-slate-300 hover:text-white hover:bg-white/5 sm:w-auto text-sm"
                      >
                        Einrichtungsanleitung →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/5 bg-[#07080b] py-12 md:py-16">
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
