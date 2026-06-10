import React, { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomerForm from '@/components/customers/CustomerForm';
import CustomerPortalSection from '@/components/customers/CustomerPortalSection';
import { supabase } from '@/lib/customSupabaseClient';
import { registerCustomerPublic } from '@/utils/customerRegisterClient';
import { formatCustomerRegisterError } from '@/utils/customerRegisterErrors';
import { resolveBrandLogoSrc } from '@/constants/brandAssets';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const glassCard =
  'relative overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_0_0_1px_rgba(229,9,20,0.15),0_25px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl';

export default function MusteriKayitPage({ siteData }) {
  const [packageTypes, setPackageTypes] = useState([]);
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let nextTypes = [];
      let nextDurations = [];
      let hadLoadError = false;

      try {
        const r = await fetch('/api/public/customer-package-options');
        if (r.ok) {
          const j = await r.json().catch(() => null);
          if (j?.ok && Array.isArray(j.packageTypes) && Array.isArray(j.durations)) {
            nextTypes = j.packageTypes;
            nextDurations = j.durations;
          }
        }
      } catch {
        /* ağ / API yok → Supabase */
      }

      if (nextTypes.length === 0 || nextDurations.length === 0) {
        const [tRes, dRes] = await Promise.all([
          supabase
            .from('package_types')
            .select('id,name,is_active,sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('customer_packages')
            .select('id,name,days,price,is_active,sort_order,group_id,group_name')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
        ]);
        if (tRes.error || dRes.error) hadLoadError = true;
        if (nextTypes.length === 0) nextTypes = tRes.data || [];
        if (nextDurations.length === 0) nextDurations = dRes.data || [];
      }

      if (!cancelled) {
        if (hadLoadError && nextTypes.length === 0 && nextDurations.length === 0) {
          setError(
            'Paket listesi şu an yüklenemedi; form alanları yine de kullanılabilir. Paket veya destek için WhatsApp üzerinden bize ulaşabilirsiniz.',
          );
        }
        setPackageTypes(nextTypes);
        setDurations(nextDurations);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    const turnstileToken =
      payload.turnstileToken != null && String(payload.turnstileToken).trim()
        ? String(payload.turnstileToken).trim()
        : '';
    const row = {
      full_name: payload.full_name,
      whatsapp: payload.whatsapp,
      country_code: payload.country_code,
      username: payload.username,
      package_id: payload.package_id,
      package_type_id: payload.package_type_id,
      package_type_name: payload.package_type_name,
      package_name: payload.package_name,
      package_days: payload.package_days,
      package_price: payload.package_price,
      currency: payload.currency,
      start_date: payload.start_date,
      end_date: payload.end_date,
      remaining_days: payload.remaining_days,
      notes: payload.notes,
    };

    const out = await registerCustomerPublic({ turnstileToken, ...row });
    if (!out.ok) {
      setError(formatCustomerRegisterError(out.error, out.status));
      setSubmitting(false);
      return;
    }
    setSuccessModalOpen(true);
    setSubmitting(false);
  };

  /** Süreler boş olsa bile formu göster (RLS/API sorununda kullanıcı en azından alanları görür) */
  const canShowForm = packageTypes.length > 0;
  const durationsMissing = durations.length === 0;

  return (
    <>
      <SEOHead
        title="Müşteri Kayıt | QruzeTV"
        description="Abonelik bilgilerinizi iletin; ekibimiz WhatsApp üzerinden sizinle iletişime geçsin."
        noindex
      />
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#030308] text-white">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% -20%, rgba(229, 9, 20,0.35), transparent 55%),
              radial-gradient(ellipse 90% 60% at 100% 50%, rgba(212,175,55,0.08), transparent 45%),
              radial-gradient(ellipse 70% 50% at 0% 80%, rgba(229,9,20,0.12), transparent 40%),
              linear-gradient(180deg, #050510 0%, #030308 45%, #0a0614 100%)
            `,
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <Header siteData={siteData} />
        <main className="relative flex-1 px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-center"
            >
              <div className="mx-auto mb-6 mt-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/30 via-[#e50914]/25 to-transparent blur-xl" />
                  <img
                    src={resolveBrandLogoSrc(siteData?.contactData?.logoUrl)}
                    alt="QruzeTV logo"
                    className="relative h-14 w-auto object-contain drop-shadow-[0_0_24px_rgba(229,9,20,0.45)] md:h-16"
                    width={200}
                    height={64}
                  />
                </div>
              </div>
              <a
                href="#musteri-sorgulama"
                className="inline-flex items-center gap-2 bg-[#e50914] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#b20710] transition-colors"
              >
                ↓ Müşteri Kodu Sorgula
              </a>
              <h1 className="bg-gradient-to-r from-white via-[#e50914] to-amber-100/90 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                Müşteri kayıt
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                Bilgilerinizi bırakın; en kısa sürede WhatsApp üzerinden sizinle iletişime geçelim. Aşağıdan müşteri
                kodunuzla abonelik özetinize ve M3U bağlantınıza ulaşabilirsiniz.
              </p>
            </motion.div>

            <section aria-labelledby="section-new-reg">
              <h2
                id="section-new-reg"
                className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 md:text-left"
              >
                Bölüm 1 — Yeni kayıt
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${glassCard} p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-500/[0.06] before:via-transparent before:to-[#b20710]/[0.08] md:p-8`}
              >
                {loading ? (
                  <p className="text-center text-slate-400">Yükleniyor…</p>
                ) : !canShowForm ? (
                  <div className="space-y-3 text-center text-amber-200">
                    <p>
                      Kayıt formu için en az bir <strong className="text-white">aktif paket grubu</strong> gerekli.
                      Supabase’de <code className="text-[#e50914]">package_types</code> tablosunu kontrol edin; anon
                      okuma politikası için{' '}
                      <code className="text-[#e50914]">docs/supabase-package-types-rls-admin.sql</code> ile uyumlu
                      olmalıdır.
                    </p>
                    <p className="text-sm text-slate-400">
                      Geliştirme: <code className="text-slate-300">npm run dev:all</code> (API + Vite) ve{' '}
                      <code className="text-slate-300">SUPABASE_SERVICE_ROLE_KEY</code> tanımlı olsun — böylece paket
                      listesi API üzerinden de yüklenir.
                    </p>
                  </div>
                ) : (
                  <>
                    {durationsMissing && (
                      <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                        <strong>Süre seçenekleri yüklenemedi.</strong> Bir süre seçmeden kayıt tamamlanamaz. Yönetimden
                        paket sürelerini ekleyin; sorun devam ederse site yöneticisi Supabase’de{' '}
                        <span className="font-mono text-[#e50914]/90">customer_packages</span> için anon SELECT (aktif
                        satırlar) politikasını açmalıdır — projede:{' '}
                        <span className="font-mono text-xs break-all text-slate-400">
                          supabase/migrations/20260401150000_customer_packages_rls_public_read.sql
                        </span>
                      </p>
                    )}
                    {error && (
                      <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {error}
                      </p>
                    )}
                    <CustomerForm
                      key={formResetKey}
                      variant="public"
                      hideFullName
                      visualAccent
                      packageTypes={packageTypes}
                      durations={durations}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      serverError={error}
                    />
                    <div className="relative z-10 mt-8 rounded-2xl border border-amber-400/20 bg-black/25 p-4 text-left text-sm leading-relaxed text-slate-200/95 backdrop-blur-sm md:p-5">
                      <p className="border-b border-white/10 pb-3 text-amber-100/95">
                        ✅ Kaydınız tamamlandıktan sonra müşteri kodunuz (ör. QRZ-XXXX) WhatsApp üzerinden tarafınıza
                        iletilecektir.
                      </p>
                      <p className="mt-3 text-slate-400">
                        After your registration is complete, your customer code (e.g. QRZ-XXXX) will be sent to you via
                        WhatsApp.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </section>

            <Dialog
              open={successModalOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setSuccessModalOpen(false);
                  setFormResetKey((k) => k + 1);
                  setError('');
                }
              }}
            >
              <DialogContent className="max-w-md border-primary/30 bg-gradient-to-b from-[#12101c] to-[#0a0812] p-0 text-white shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_24px_64px_-12px_rgba(0,0,0,0.9)] sm:rounded-2xl [&>button]:hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="px-6 pb-6 pt-8 sm:px-8"
                >
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e50914]/25 to-[#b20710]/10 ring-2 ring-emerald-400/35 shadow-[0_0_32px_rgba(34,197,94,0.35)]">
                    <span className="text-5xl leading-none" aria-hidden>
                      ✅
                    </span>
                  </div>
                  <DialogHeader className="space-y-3 text-center sm:text-center">
                    <DialogTitle className="text-xl font-bold tracking-tight text-white md:text-2xl">
                      Kaydınız Alındı!
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-slate-300">
                      Müşteri kodunuz en kısa sürede WhatsApp üzerinden iletilecektir.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="mt-4 border-t border-white/10 pt-4 text-center text-sm leading-relaxed text-slate-400">
                    Registration received! Your customer code will be sent to you via WhatsApp shortly.
                  </p>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#e50914] via-[#e50914] to-[#b20710]/90 py-6 text-base font-semibold text-white shadow-lg shadow-primary/40 transition hover:brightness-110"
                    >
                      Tamam / OK
                    </Button>
                  </DialogClose>
                </motion.div>
              </DialogContent>
            </Dialog>

            <section id="musteri-sorgulama" aria-labelledby="section-portal">
              <h2
                id="section-portal"
                className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 md:text-left"
              >
                Bölüm 2 — Bilgilerimi getir (portal)
              </h2>
              <CustomerPortalSection />
            </section>
          </div>
        </main>
        <Footer siteData={siteData} />
      </div>
    </>
  );
}
