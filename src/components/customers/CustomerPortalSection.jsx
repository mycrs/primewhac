import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { formatTrDate, remainingCalendarDaysUntilEnd } from '@/utils/customerDates';
import { buildPortalM3uUrl, buildPortalXtreamHost, normalizeExternalPanelHref } from '@/utils/portalUrls';
import { toast } from '@/components/ui/use-toast';
import { ClipboardCopy, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizePortalCode, isValidPortalCodeFormat } from '@/utils/portalCodeFormat';
import MathCaptcha from '@/components/MathCaptcha';
import { verifyMathCaptcha, mathCaptchaUserMessage } from '@/utils/mathCaptchaClient';
import { PUBLIC_MAINTENANCE_INLINE_HINT } from '@/constants/publicMaintenanceMessage';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import {
  PORTAL_RPC_DEPLOY_DOC,
  formatPortalLookupError,
  formatPortalSavePasswordError,
  PORTAL_PASSWORD_DEPLOY_DOC,
} from '@/utils/portalRpcErrors';

const LEGACY_PORTAL_LOCK_STORAGE_KEY = 'portal_lookup_guard';

const captchaRelaxed = import.meta.env.VITE_PORTAL_CAPTCHA_RELAXED === 'true';

function CopyBtn({ text, label = 'Kopyala', className = '' }) {
  const copy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Panoya kopyalandı' });
    } catch {
      toast({ variant: 'destructive', title: 'Kopyalanamadı' });
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('shrink-0 gap-1 border-white/15 text-slate-200', className)}
      onClick={copy}
      disabled={!text}
      title={label}
    >
      <span aria-hidden>📋</span>
      <span>Kopyala</span>
    </Button>
  );
}

export default function CustomerPortalSection() {
  const [codeInput, setCodeInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [portalData, setPortalData] = useState(null);
  const [iptvPassword, setIptvPassword] = useState('');
  const [pwRevealUntil, setPwRevealUntil] = useState(0);
  /** Başarılı lookup sonrası normalize kod — şifre iptv_password'a yazılırken eşleştirme */
  const [lastPortalCodeNormalized, setLastPortalCodeNormalized] = useState('');
  const [mathCaptcha, setMathCaptcha] = useState(null);
  const [captchaRefresh, setCaptchaRefresh] = useState(0);

  const resetMathCaptcha = useCallback(() => {
    setMathCaptcha(null);
    setCaptchaRefresh((s) => s + 1);
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_PORTAL_LOCK_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const showPlainPassword = pwRevealUntil > Date.now();

  useEffect(() => {
    if (!pwRevealUntil || pwRevealUntil <= Date.now()) return undefined;
    const ms = pwRevealUntil - Date.now();
    const t = setTimeout(() => setPwRevealUntil(0), ms);
    return () => clearTimeout(t);
  }, [pwRevealUntil]);

  const runCaptchaGate = useCallback(async () => {
    const answer = String(mathCaptcha?.answer ?? '').trim();
    if (!mathCaptcha?.id || !answer) {
      return { ok: false, needAnswer: true };
    }
    try {
      const r = await verifyMathCaptcha(mathCaptcha.id, answer);
      if (r.ok) return { ok: true };
      if (captchaRelaxed) return { ok: true };
      return { ok: false, captchaFail: r };
    } catch {
      if (captchaRelaxed) return { ok: true };
      return { ok: false, captchaFail: { ok: false, fetchFailed: true } };
    }
  }, [mathCaptcha]);

  const runLookup = async () => {
    setLookupError('');
    setPortalData(null);
    setIptvPassword('');
    setPwRevealUntil(0);
    setLastPortalCodeNormalized('');

    const normalizedCode = normalizePortalCode(codeInput);
    if (!isValidPortalCodeFormat(codeInput)) {
      setLookupError('Geçersiz kod formatı. Lütfen müşteri kodunuzu kontrol edin.');
      return;
    }

    setLookupLoading(true);
    try {
      const gate = await runCaptchaGate();
      if (!gate.ok) {
        if (gate.needAnswer) {
          setLookupError('Lütfen güvenlik sorusunu yanıtlayın.');
        } else if (gate.captchaFail) {
          setLookupError(mathCaptchaUserMessage(gate.captchaFail));
        } else {
          setLookupError('Robot doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.');
        }
        return;
      }

      const { data, error } = await supabase.rpc('lookup_customer_portal', { p_code: normalizedCode });

      if (error) {
        const hint = formatPortalLookupError(error);
        if (hint) {
          if (import.meta.env.DEV) {
            console.warn(`[CustomerPortalSection] Portal RPC — ${PORTAL_RPC_DEPLOY_DOC}`);
          }
          setLookupError(hint);
        } else {
          setLookupError(PUBLIC_MAINTENANCE_INLINE_HINT);
          showPublicMaintenanceToastOnce(toast);
        }
        return;
      }

      const row = Array.isArray(data) ? data[0] : data;
      if (!row || !row.username) {
        setLookupError('Geçersiz kod');
        return;
      }

      setPortalData(row);
      setLastPortalCodeNormalized(normalizedCode);
      const fromCol =
        row.iptv_password != null && String(row.iptv_password).trim()
          ? String(row.iptv_password).trim()
          : '';
      const fromNotes = row.notes?.match(/şifre:\s*(.+)/i)?.[1]?.trim() || '';
      const savedPassword = fromCol || fromNotes;
      setIptvPassword(savedPassword || '');
    } catch (e) {
      setLookupError(PUBLIC_MAINTENANCE_INLINE_HINT);
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setLookupLoading(false);
      resetMathCaptcha();
    }
  };

  const portalStatusRaw = portalData?.status;
  const portalStatus = String(portalStatusRaw != null && portalStatusRaw !== '' ? portalStatusRaw : 'aktif')
    .toLowerCase()
    .trim();

  const endYmd = portalData?.end_date ? String(portalData.end_date).slice(0, 10) : null;
  const rem = endYmd ? remainingCalendarDaysUntilEnd(endYmd) : null;
  const expired = rem != null && rem < 0;
  const hasServer = !!(portalData?.server_url && String(portalData.server_url).trim());
  const showFullPortal = portalStatus === 'aktif';
  const customerPanelHref = normalizeExternalPanelHref(
    portalData?.customer_panel_url || portalData?.server_url,
  );

  /* Şifre: onChange + 5 sn debounce → iptv_password (anon RLS yüzünden doğrudan UPDATE yok; SECURITY DEFINER RPC) */
  useEffect(() => {
    if (!showFullPortal || !lastPortalCodeNormalized) return undefined;
    const pw = iptvPassword.trim();
    if (!pw) return undefined;
    const rawCode =
      portalData?.portal_code != null && String(portalData.portal_code).trim()
        ? String(portalData.portal_code).trim()
        : lastPortalCodeNormalized;
    const pCode = normalizePortalCode(rawCode);
    const t = setTimeout(() => {
      void supabase
        .rpc('save_portal_customer_password', { p_code: pCode, p_password: pw })
        .then(({ data, error }) => {
          if (error) {
            const hint = formatPortalSavePasswordError(error);
            if (import.meta.env.DEV) {
              console.warn(
                `[CustomerPortalSection] save_portal_customer_password: ${error.message} — ${PORTAL_PASSWORD_DEPLOY_DOC}`,
              );
            }
            toast({
              variant: 'destructive',
              title: 'Şifre kaydedilemedi',
              description: hint || PUBLIC_MAINTENANCE_INLINE_HINT,
              duration: 8000,
            });
            return;
          }
          if (data !== true) {
            toast({
              variant: 'destructive',
              title: 'Şifre kaydedilemedi',
              description: 'Kayıt güncellenemedi. Kodunuzu kontrol edin.',
            });
          }
        });
    }, 5000);
    return () => clearTimeout(t);
  }, [iptvPassword, lastPortalCodeNormalized, showFullPortal, portalData?.portal_code]);

  const m3uUrl = useMemo(() => {
    if (!portalData || !iptvPassword) return '';
    return buildPortalM3uUrl(
      portalData.server_url,
      portalData.server_port,
      portalData.username,
      iptvPassword,
    );
  }, [portalData, iptvPassword]);

  const xtreamHost = useMemo(() => {
    if (!portalData) return '';
    return buildPortalXtreamHost(portalData.server_url, portalData.server_port);
  }, [portalData]);

  const copyM3u = useCallback(async () => {
    if (!m3uUrl) return;
    try {
      await navigator.clipboard.writeText(m3uUrl);
      toast({ title: 'M3U linki kopyalandı' });
    } catch {
      toast({ variant: 'destructive', title: 'Kopyalanamadı' });
    }
  }, [m3uUrl]);

  const revealPassword = () => setPwRevealUntil(Date.now() + 30000);

  return (
    <section className="rounded-2xl border border-[#e50914]/20 bg-[#0a0f18] p-6 shadow-xl md:p-8">
      <div className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
        ⚠️ Bu bilgileri kimseyle paylaşmayın. Sayfayı kapattığınızda veya yenilediğinizde bilgiler silinir.
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Bilgilerimi getir</h2>
        <p className="mt-1 text-sm text-slate-400">Müşteri kodunuzu girin</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="portal-code">Müşteri kodu</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id="portal-code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Müşteri kodunuzu girin"
              className="bg-white/5 border-white/10 font-mono uppercase sm:flex-1"
              autoComplete="off"
            />
            <Button
              type="button"
              onClick={runLookup}
              disabled={lookupLoading || !String(mathCaptcha?.answer ?? '').trim()}
              className="bg-[#e50914] hover:bg-[#e50914] sm:w-auto"
            >
              {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Sorgula
            </Button>
          </div>
        </div>

        <MathCaptcha onChange={setMathCaptcha} refreshSignal={captchaRefresh} disabled={lookupLoading} />

        {lookupError && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {lookupError}
          </p>
        )}

        {portalData && (
          <div className="space-y-6 border-t border-white/10 pt-6">
            {portalStatus === 'beklemede' && (
              <p className="rounded-lg border border-[#e50914]/30 bg-[#e50914]/10 px-4 py-3 text-sm text-[#e50914]">
                Kaydınız inceleniyor. Onaylandığında bilgilerinize erişebilirsiniz.
              </p>
            )}

            {portalStatus === 'bitti' && (
              <p className="rounded-lg border border-slate-500/40 bg-[#141414]/10 px-4 py-3 text-sm text-slate-200">
                Aboneliğiniz sona ermiştir.
              </p>
            )}

            {portalStatus === 'iptal' && (
              <p className="rounded-lg border border-zinc-600/50 bg-[#0a0a0a]/40 px-4 py-3 text-sm text-slate-300">
                Bu kayıt iptal edilmiştir. Sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            )}

            {portalStatus !== 'aktif' &&
              portalStatus !== 'beklemede' &&
              portalStatus !== 'bitti' &&
              portalStatus !== 'iptal' && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Bu kayıt için portal bilgisi şu an gösterilemiyor. Destek ile iletişime geçin.
                </p>
              )}

            {showFullPortal && (
              <>
                <div className="rounded-xl bg-white/[0.03] p-4 space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">İsim:</span>{' '}
                    <span className="font-medium text-white">{portalData.full_name || '—'}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Paket:</span>{' '}
                    <span className="text-slate-200">{portalData.package_name || '—'}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Bitiş:</span>{' '}
                    <span className="text-slate-200">{endYmd ? formatTrDate(endYmd) : '—'}</span>
                    {rem != null && (
                      <span className={cn('ml-2', expired ? 'text-red-400 font-semibold' : 'text-[#e50914]/90')}>
                        ({rem < 0 ? `${Math.abs(rem)} gün önce doldu` : `${rem} gün kaldı`})
                      </span>
                    )}
                  </p>
                  {expired && (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-200">
                      Abonelik süreniz dolmuş görünüyor. Yayın almak için yenileme için bizimle iletişime geçin.
                    </p>
                  )}
                  {customerPanelHref && (
                    <p className="rounded-lg border border-[#e50914]/25 bg-[#e50914]/30 px-3 py-2 text-sm">
                      <span className="text-slate-400">Müşteri paneli:</span>{' '}
                      <a
                        href={customerPanelHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#e50914] underline underline-offset-2 hover:text-[#e50914]"
                      >
                        Panele git
                      </a>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label htmlFor="iptv-pw">IPTV şifrenizi girin</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#e50914] hover:text-[#e50914]"
                      onClick={revealPassword}
                    >
                      🔑 Göster (30 sn)
                    </Button>
                  </div>
                  <Input
                    id="iptv-pw"
                    type={showPlainPassword ? 'text' : 'password'}
                    value={iptvPassword}
                    onChange={(e) => setIptvPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-slate-500">
                    Şifre yazmayı bıraktığınızda yaklaşık 5 saniye sonra kaydınıza (IPTV şifresi alanı) sessizce kaydedilir.
                  </p>
                </div>

                {iptvPassword && portalData.username && (
                  <div className="space-y-4">
                    {!hasServer && (
                      <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                        Paket grubunda <strong>sunucu URL</strong> tanımlı değil (veya müşteri kaydında paket türü
                        seçilmemiş). <strong>M3U linki üretilemez.</strong> Xtream için sunucu adresini yönetimden
                        isteyin; aşağıdaki kullanıcı adı ve şifreyi kendi uygulamanızda kullanabilirsiniz.
                      </p>
                    )}

                    {hasServer && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label>M3U URL</Label>
                          <CopyBtn text={m3uUrl} />
                        </div>
                        <div className="break-all rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs text-slate-300">
                          {m3uUrl || '—'}
                        </div>
                        {!m3uUrl && iptvPassword && (
                          <p className="text-xs text-amber-400/90">
                            M3U oluşturulamadı: sunucu adresi veya kullanıcı bilgisi eksik.
                          </p>
                        )}
                        <Button
                          type="button"
                          className="w-full bg-primary hover:bg-primary"
                          onClick={copyM3u}
                          disabled={!m3uUrl}
                        >
                          <span className="mr-2" aria-hidden>
                            📋
                          </span>
                          <ClipboardCopy className="mr-2 h-4 w-4" />
                          M3U linkini kopyala
                        </Button>
                      </div>
                    )}

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                      <p className="text-sm font-semibold text-white">Xtream bilgileri</p>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-slate-400">Sunucu</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate font-mono text-slate-200">{xtreamHost || '—'}</span>
                          {!!xtreamHost && <CopyBtn text={xtreamHost} />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-slate-400">Kullanıcı adı</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate font-mono text-slate-200">{portalData.username}</span>
                          <CopyBtn text={portalData.username} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-slate-400">Şifre</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate font-mono text-slate-200">
                            {showPlainPassword ? iptvPassword : '••••••••'}
                          </span>
                          <CopyBtn text={iptvPassword} label="Şifreyi kopyala" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
