
import { OLD_DOMAIN, NEW_DOMAIN } from '@/utils/linkMigration';

/**
 * Handles client-side redirection from old domain to new domain.
 * Note: In a true frontend-only environment, actual 301 HTTP status codes
 * must be configured at the hosting/CDN level (e.g., Vercel, Netlify, Cloudflare).
 * This middleware simulates the redirect for users hitting the old domain.
 */
export const executeDomainRedirect = () => {
  if (typeof window !== 'undefined') {
    const currentHostname = window.location.hostname;
    
    if (currentHostname.includes(OLD_DOMAIN)) {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace(new RegExp(OLD_DOMAIN, 'gi'), NEW_DOMAIN);
      
      // Use replace to simulate a redirect (doesn't keep old URL in history)
      window.location.replace(newUrl);
      return true; // Indicates redirect is happening
    }
  }
  return false;
};
