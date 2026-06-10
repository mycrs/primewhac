import React from 'react';

/**
 * TMDB API TOS gereği sayfada bir kez gösterilmesi gereken attribution bloğu.
 * Minimal, gürültüsüz; her kartta tekrarlanmaz.
 */
const TmdbAttribution = ({ lang = 'tr', className = '' }) => {
  const text =
    lang === 'de'
      ? 'Zusätzliche Metadaten (Posterbilder, Ratings, Genres) von The Movie Database (TMDB) bereitgestellt. QruzeTV ist mit TMDB nicht verbunden.'
      : 'Ek metadata (poster, puan, tür) The Movie Database (TMDB) tarafından sağlanır. QruzeTV, TMDB ile bağlantılı değildir.';

  return (
    <div
      className={`mt-10 mb-4 rounded-2xl border border-slate-800/70 bg-[#0a0a0a]/80 px-5 py-4 flex items-center gap-4 ${className}`}
      aria-label="TMDB attribution"
    >
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="shrink-0 inline-flex items-center"
        aria-label="The Movie Database"
      >
        <svg
          viewBox="0 0 190.24 81.52"
          className="h-5 w-auto text-sky-400 hover:text-sky-300 transition-colors"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M105.67,36.06h61.94c6.37,0,11.54,5.17,11.54,11.54v11.54c0,6.37-5.17,11.54-11.54,11.54h-61.94c-6.37,0-11.54-5.17-11.54-11.54v-11.54C94.13,41.23,99.3,36.06,105.67,36.06Z" />
          <path d="M11.54,10.14h166.98c6.37,0,11.54,5.17,11.54,11.54v11.54c0,6.37-5.17,11.54-11.54,11.54H11.54C5.17,44.76,0,39.59,0,33.22v-11.54C0,15.31,5.17,10.14,11.54,10.14Z" />
        </svg>
      </a>
      <p className="text-[11px] leading-relaxed text-slate-400">{text}</p>
    </div>
  );
};

export default TmdbAttribution;
