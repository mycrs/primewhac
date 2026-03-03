
/**
 * Dynamic resource prefetching to improve perceived performance
 */

const prefetchedUrls = new Set();

export const prefetchRoute = (url) => {
  if (typeof window === 'undefined' || !url || prefetchedUrls.has(url)) return;
  
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'fetch';
    document.head.appendChild(link);
    prefetchedUrls.add(url);
  } catch (e) {
    console.warn('Prefetch failed', e);
  }
};

export const preconnectDomain = (domain) => {
  if (typeof window === 'undefined' || !domain || prefetchedUrls.has(domain)) return;
  
  try {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    prefetchedUrls.add(domain);
  } catch (e) {
    console.warn('Preconnect failed', e);
  }
};
