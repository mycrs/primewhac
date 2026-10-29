import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { fetchMathChallenge } from '@/utils/mathCaptchaClient';

/**
 * Ortak matematik doğrulama bileşeni (Cloudflare Turnstile / hCaptcha yerine).
 *
 * Ortak sözleşme:
 * - props: { onChange, refreshSignal?, disabled? }
 * - onChange({ id, answer }) → kullanıcı geçerli bir cevap girdiğinde çağrılır.
 * - onChange(null) → alan boşaldığında veya yeni soru yüklendiğinde çağrılır.
 * - refreshSignal (sayı) değişince sunucudan yeni challenge çeker.
 *
 * Not: Doğrulama submit aşamasında verifyMathCaptcha(id, answer) ile yapılır;
 * bu bileşen yalnızca soruyu gösterir ve { id, answer } üretir.
 */
const MathCaptcha = ({ onChange, refreshSignal = 0, disabled = false }) => {
  const [challenge, setChallenge] = useState(null); // { id, question }
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [localRefresh, setLocalRefresh] = useState(0);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMsg('');
    setAnswer('');
    setChallenge(null);
    onChangeRef.current?.(null);

    fetchMathChallenge().then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result.ok) {
        setChallenge({ id: result.id, question: result.question });
      } else {
        setErrorMsg(result.error || 'Güvenlik sorusu alınamadı. Lütfen tekrar deneyin.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refreshSignal, localRefresh]);

  const handleRefresh = useCallback(() => {
    setLocalRefresh((n) => n + 1);
  }, []);

  const handleAnswerChange = (e) => {
    // Sadece rakam kabul et (en fazla 6 hane)
    const clean = String(e.target.value || '').replace(/[^\d]/g, '').slice(0, 6);
    setAnswer(clean);
    if (clean && challenge?.id) {
      onChangeRef.current?.({ id: challenge.id, answer: clean });
    } else {
      onChangeRef.current?.(null);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#e50914]" />
          <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">
            Güvenlik Doğrulaması
          </span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={disabled || loading}
          title="Yeni soru al"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[#e50914]" />
          <span>Güvenlik sorusu yükleniyor...</span>
        </div>
      ) : errorMsg ? (
        <div className="flex items-start gap-2 py-1 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            {errorMsg}{' '}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={disabled}
              className="underline underline-offset-2 hover:text-red-300 disabled:opacity-50"
            >
              Tekrar dene
            </button>
          </p>
        </div>
      ) : challenge ? (
        <div className="flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-wider tabular-nums whitespace-nowrap select-none">
            {challenge.question}
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="Cevap"
            value={answer}
            onChange={handleAnswerChange}
            disabled={disabled}
            aria-label="Güvenlik sorusu cevabı"
            className="flex-1 min-w-0 h-12 rounded-xl bg-black/40 border border-slate-800 text-white text-center text-lg font-bold tracking-widest placeholder:text-slate-600 placeholder:text-sm placeholder:font-normal focus:outline-none focus:border-[#e50914]/60 disabled:opacity-50"
          />
        </div>
      ) : null}
    </div>
  );
};

export default MathCaptcha;
