import React from 'react';

/** Hafif fallback: CSS-only, hızlı ilk çizim (FCP) */
const PageLoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4 overflow-hidden" aria-live="polite" aria-busy="true">
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="mt-4 text-slate-400 text-sm font-medium">Yükleniyor...</p>
      </div>
    </div>
  );
};

export default React.memo(PageLoadingFallback);
