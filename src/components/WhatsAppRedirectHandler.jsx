import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2, ExternalLink } from 'lucide-react';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { motion } from 'framer-motion';

const WhatsAppRedirectHandler = ({ data, autoRedirect = false, delay = 2000 }) => {
  const { redirectToWhatsApp } = useWhatsAppIntegration();
  const [countdown, setCountdown] = useState(delay / 1000);
  const [isRedirecting, setIsRedirecting] = useState(autoRedirect);

  useEffect(() => {
    let timer;
    let redirectTimer;

    if (autoRedirect && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      redirectTimer = setTimeout(() => {
        handleRedirect();
      }, delay);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [autoRedirect, delay]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Track event if analytics existed
    // console.log('Analytics: test_form_whatsapp_redirect', data);
    redirectToWhatsApp(data);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {autoRedirect && countdown > 0 && (
        <p className="text-sm text-slate-400 animate-pulse">
          {countdown} saniye içinde yönlendiriliyorsunuz...
        </p>
      )}

      <Button
        onClick={handleRedirect}
        className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-2 group"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {isRedirecting && countdown === 0 ? "Tekrar Dene" : "WhatsApp ile İletişime Geç"}
        <ExternalLink className="w-4 h-4 opacity-70" />
      </Button>

      <p className="text-xs text-slate-500 text-center max-w-[250px]">
        Yönlendirme gerçekleşmezse butona tıklayarak manuel olarak bağlanabilirsiniz.
      </p>
    </div>
  );
};

export default WhatsAppRedirectHandler;