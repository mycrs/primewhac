import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        if (freezeOnceVisible && isElementVisible) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        } else {
          setIsVisible(isElementVisible);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref, isVisible };
};