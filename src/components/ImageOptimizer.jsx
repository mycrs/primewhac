
import React, { useState, useEffect, useRef } from 'react';
import { generateResponsiveSrcSet, generateBlurPlaceholder } from '@/utils/imageOptimization';

const ImageOptimizer = ({ 
  src, 
  alt, 
  className = '', 
  widths,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  objectFit = 'cover',
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const blurDataUrl = generateBlurPlaceholder();
  const srcSet = widths ? generateResponsiveSrcSet(src, widths) : undefined;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [src, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ isolation: 'isolate' }}>
      {/* Blur Placeholder */}
      {!isLoaded && !error && (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50"
        />
      )}
      
      {/* Actual Image */}
      <img
        ref={imgRef}
        src={error ? '/fallback-image.png' : src} // Provide a fallback path if needed
        srcSet={error ? undefined : srcSet}
        sizes={sizes}
        alt={alt || ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{ objectFit, willChange: isLoaded ? 'auto' : 'opacity' }}
        {...props}
      />
    </div>
  );
};

export default React.memo(ImageOptimizer);
