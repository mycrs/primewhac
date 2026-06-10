import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver ile bölüm görünür olunca true döner (lazy fetch / embed için).
 */
export function useWhenVisible({ rootMargin = '200px', threshold = 0.01, once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (once && visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once, visible]);

  return [ref, visible];
}
