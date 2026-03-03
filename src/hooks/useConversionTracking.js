import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackContentView, trackPackagesPageView } from '@/utils/analyticsTracking';

/**
 * Hook to track user journey through the conversion funnel.
 * Handles automatic page view tracking for specific conversion steps.
 */
export const useConversionTracking = (contentDetails = null) => {
  const location = useLocation();
  const trackedRef = useRef(new Set());

  useEffect(() => {
    const path = location.pathname;

    // Track Content Detail Views
    if (contentDetails && !trackedRef.current.has(`view_${contentDetails.id}`)) {
      trackContentView(
        contentDetails.title || contentDetails.name,
        contentDetails.media_type || (contentDetails.title ? 'movie' : 'tv'),
        contentDetails.id
      );
      trackedRef.current.add(`view_${contentDetails.id}`);
    }

    // Track Packages Page Arrival
    if ((path === '/packages' || path === '/paketler') && !trackedRef.current.has('packages_view')) {
      const searchParams = new URLSearchParams(location.search);
      const source = searchParams.get('source') || document.referrer;
      
      trackPackagesPageView(source);
      trackedRef.current.add('packages_view');
    }

  }, [location, contentDetails]);

  return true;
};