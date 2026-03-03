import { useState, useEffect } from 'react';

export const useLazyImage = (src, placeholderSrc = null) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = (err) => {
      setError(err);
      setIsLoading(false);
      // Keep placeholder if error occurs
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { src: currentSrc, isLoading, error };
};