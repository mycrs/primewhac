import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, FlaskConical } from 'lucide-react';
import { INSTALLATION_DEVICE_CONTENT } from '@/data/installationDeviceContent';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const DeviceSeoContentSection = ({ deviceSlug, isDe = false }) => {
  const contentSlug = deviceSlug === 'samsung-tv' || deviceSlug === 'lg-tv' ? 'smart-tv' : deviceSlug;
  const data = INSTALLATION_DEVICE_CONTENT[contentSlug];
  if (!data) return null;

  const t = isDe ? data.de : data.tr;
  const paketlerPath = isDe ? '/de/paketler' : '/paketler';
  const testPath = isDe ? '/de/test' : '/test';
  const homePath = isDe ? '/de' : '/';
  const faqPath = isDe ? '/de/sss' : '/sss';
  const guidePath = isDe ? '/de/guide/iptv-kurulum-rehberi' : '/guide/iptv-kurulum-rehberi';
  const smartTvPath = isDe ? '/de/einrichtung/smart-tv' : '/kurulum/smart-tv';
  const androidTvPath = isDe ? '/de/einrichtung/android-tv' : '/kurulum/android-tv';

  return (
    <section className="mt-24 space-y-12">
      <motion.div
        className="relative rounded-2xl p-6 md:p-10 bg-gradient-to-b from-[#0a0a0a]/60 to-[#141414]/30 border border-slate-700/50 shadow-xl shadow-primary/5"
        {...fadeInUp}
      >
        <div
          className="device-seo-content prose prose-invert prose-lg max-w-none [&_.content-title]:!border-primary/30 [&_.highlight-box]:!border-l-primary"
          dangerouslySetInnerHTML={{ __html: t.content }}
        />
      </motion.div>

      <motion.div
        className="rounded-2xl p-8 md:p-10 bg-gradient-to-br from-[#e50914]/30 to-[#141414] border border-primary/20 text-center"
        {...fadeInUp}
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          {isDe ? 'Vor dem Start der Einrichtung' : 'Kuruluma Başlamadan Önce'}
        </h3>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          {isDe
            ? 'Noch kein IPTV Abo? Nutzen Sie unseren kostenlosen Test oder wählen Sie ein Paket.'
            : 'Henüz IPTV aboneliğiniz yoksa önce ücretsiz test ile kaliteyi deneyin veya paket seçin.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={testPath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#e50914] text-white font-semibold transition-colors"
          >
            <FlaskConical className="w-5 h-5" />
            {isDe ? 'Kostenlos testen' : 'Ücretsiz Test'}
          </Link>
          <Link
            to={paketlerPath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-[#0a0a0a] hover:text-white font-semibold transition-colors"
          >
            <Package className="w-5 h-5" />
            {isDe ? 'Pakete ansehen' : 'Paketleri Görüntüle'}
          </Link>
        </div>
      </motion.div>

      <motion.section
        className="rounded-2xl p-6 md:p-8 bg-[#0a0a0a]/70 border border-slate-700/60"
        {...fadeInUp}
      >
        <h3 className="text-xl font-bold text-white mb-4">
          {isDe ? 'Nützliche interne Links' : 'Faydalı iç bağlantılar'}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { to: homePath, label: isDe ? 'Startseite' : 'Ana sayfa' },
            { to: faqPath, label: isDe ? 'FAQ' : 'SSS' },
            { to: guidePath, label: isDe ? 'IPTV Leitfaden' : 'IPTV rehberi' },
            { to: androidTvPath, label: isDe ? 'Android TV Einrichtung' : 'Android TV kurulumu' },
            { to: smartTvPath, label: isDe ? 'Smart TV Einrichtung' : 'Smart TV kurulumu' },
            { to: paketlerPath, label: isDe ? 'IPTV Pakete' : 'IPTV paketleri' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex items-center rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-[#0a0a0a] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.section>
    </section>
  );
};

export default DeviceSeoContentSection;
