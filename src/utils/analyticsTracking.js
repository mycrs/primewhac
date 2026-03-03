/**
 * Analytics Tracking Utility
 * Handles event logging for Google Analytics (GA4) or other tracking services.
 * Uses window.dataLayer for GTM/GA integration.
 */

export const trackEvent = (eventName, params = {}) => {
  try {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString()
      });
    }
    
    // Log to console in development for verification
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event: ${eventName}`, params);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
};

/**
 * Track "Watch Now" button clicks (Conversion attempt)
 * @param {string} contentTitle - Title of the movie/show
 * @param {string} contentType - 'movie' or 'tv'
 * @param {string|number} contentId - TMDB ID
 */
export const trackWatchNowClick = (contentTitle, contentType, contentId) => {
  trackEvent('watch_now_clicked', {
    content_title: contentTitle,
    content_type: contentType,
    content_id: contentId,
    location: window.location.pathname
  });
};

/**
 * Track viewing of content details
 * @param {string} contentTitle 
 * @param {string} contentType 
 * @param {string|number} contentId 
 */
export const trackContentView = (contentTitle, contentType, contentId) => {
  trackEvent('content_detail_viewed', {
    content_title: contentTitle,
    content_type: contentType,
    content_id: contentId
  });
};

/**
 * Track arrival at packages page (Conversion Funnel Step)
 * @param {string} source - Where the user came from (e.g., 'what-to-watch')
 */
export const trackPackagesPageView = (source) => {
  trackEvent('packages_page_reached', {
    referrer_source: source
  });
};