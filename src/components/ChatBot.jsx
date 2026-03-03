
import React, { useState, useEffect, useRef, memo } from 'react';
import { Bot, X, Send, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';

const getRedirectText = (url) => {
  if (!url) return '';
  const map = {
    '/paketler': 'Paketleri Gör',
    '/packages': 'Paketleri Gör',
    '/mac-programi': 'Maç Programı',
    '/kurulum': 'Kurulum Rehberi',
    '/blog': 'Blog',
    '/sss': 'SSS',
    '/channels': 'Kanallar',
    '/ne-izlesem': 'Ne İzlesem',
    '/m3u-converter': 'M3U Oluştur',
    '/reseller': 'Bayilik',
    '/contact': 'İletişim',
    '/support': 'Destek',
  };
  return map[url] || 'Daha Fazla Bilgi';
};

/** Türkçe karakter ve yazım hatalarını normalize eder - eşleştirmeyi güçlendirir */
const normalizeForMatch = (str) => {
  if (!str || typeof str !== 'string') return '';
  const tr = { ı: 'i', ğ: 'g', ü: 'u', ö: 'o', ş: 's', ç: 'c', İ: 'i', Ğ: 'g', Ü: 'u', Ö: 'o', Ş: 's', Ç: 'c' };
  return str.toLowerCase().split('').map((c) => tr[c] ?? c).join('').replace(/\s+/g, ' ');
};

const ChatBot = ({ chatData, contactData, siteTexts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [dbResponses, setDbResponses] = useState([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch responses from Supabase when chatbot is opened or mounted
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data, error } = await supabase
          .from('chatbot_responses')
          .select('keyword, response, redirect_url')
          .eq('active', true);
        
        if (!error && data) {
          setDbResponses(data);
        }
      } catch (err) {
        console.error("Failed to load chatbot responses:", err);
      }
    };
    
    if (chatData?.enabled) {
      fetchResponses();
    }
  }, [chatData?.enabled]);

  // Lazy initialize messages only when opened
  useEffect(() => {
    if (isOpen && chatData?.welcomeMessage && messages.length === 0) {
      setMessages([{ type: 'bot', text: chatData.welcomeMessage }]);
    }
  }, [isOpen, chatData?.welcomeMessage]);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isBotThinking]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { type: 'user', text: userMessage }];
    setMessages(newMessages);
    setInputValue('');
    setIsBotThinking(true);

    setTimeout(() => {
      const normalizedUser = normalizeForMatch(userMessage);
      let botResponse = null;
      let redirectUrl = null;

      const matchesKeyword = (keywords, normalizedMsg) => {
        const list = keywords.split(',').map((k) => normalizeForMatch(k.trim())).filter(Boolean);
        return list.some((kw) => normalizedMsg.includes(kw));
      };

      // 1. Check Supabase DB Responses first
      if (dbResponses && dbResponses.length > 0) {
        for (const item of dbResponses) {
          if (matchesKeyword(item.keyword, normalizedUser)) {
            botResponse = item.response;
            redirectUrl = item.redirect_url;
            break;
          }
        }
      }

      // 2. Fallback to old JSON Q&A if not found in DB
      if (!botResponse && chatData?.qna) {
        for (const item of chatData.qna) {
          if (matchesKeyword(item.question, normalizedUser)) {
            botResponse = item.answer;
            break;
          }
        }
      }

      // 3. Default fallback if absolutely no match
      if (!botResponse) {
        botResponse = `Üzgünüm, sorunuzu tam olarak anlayamadım. Lütfen farklı kelimelerle tekrar sorun veya daha hızlı destek için WhatsApp üzerinden bize ulaşın.`;
      }

      setMessages(prev => [...prev, { type: 'bot', text: botResponse, redirect_url: redirectUrl }]);
      setIsBotThinking(false);
    }, 800);
  };

  const handleRedirectClick = (e, url) => {
    e.preventDefault();
    if (!url) return;

    if (url.startsWith('/')) {
      navigate(url);
      setIsOpen(false); // Close chatbot on internal navigation
    } else {
      window.location.href = url; // External or custom URL
    }
  };

  if (!chatData?.enabled) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed bottom-4 right-4 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
          aria-label="Chat"
        >
          <Bot className="w-7 h-7" />
        </button>
        
        {isHovered && !isOpen && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                Yardım?
            </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[90vw] md:w-96 max-w-[400px] h-[500px] max-h-[80vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-slate-800 border border-slate-700"
          >
              <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center relative">
                    <Bot className="w-6 h-6 text-black" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{chatData.title || 'Canlı Destek'}</h3>
                    <p className="text-xs text-green-400">Çevrimiçi</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/95 custom-scrollbar">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-2 shrink-0">
                         <Bot className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-slate-700 text-gray-200 rounded-bl-sm border border-slate-600'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      {msg.type === 'bot' && msg.redirect_url && (
                        <button
                          onClick={(e) => handleRedirectClick(e, msg.redirect_url)}
                          className="mt-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline font-medium text-xs transition-colors"
                        >
                          {getRedirectText(msg.redirect_url)}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isBotThinking && (
                  <div className="flex justify-start items-end">
                     <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-2 shrink-0">
                         <Bot className="w-4 h-4 text-yellow-400" />
                      </div>
                     <div className="bg-slate-700 border border-slate-600 rounded-2xl rounded-bl-sm p-3 flex gap-1 shadow-sm">
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={chatData.inputPlaceholder || "Mesajınızı yazın..."}
                        className="bg-slate-800 border-slate-700 text-white h-11 rounded-full px-4 focus-visible:ring-yellow-400"
                        disabled={isBotThinking}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={isBotThinking || !inputValue.trim()}
                      className="h-11 w-11 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50 transition-colors shrink-0"
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </Button>
                </form>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(ChatBot);
