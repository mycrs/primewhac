
import { migrateUrl, migrateContent } from './linkMigration';
import { executeDomainRedirect } from '@/middleware/redirectMiddleware';
import { SITE_URL } from '@/constants/siteUrl';

export const DomainMigrationManager = {
  checkAndRedirect: () => {
    return executeDomainRedirect();
  },
  
  updateContent: (content) => {
    return migrateContent(content);
  },
  
  updateUrl: (url) => {
    return migrateUrl(url);
  },
  
  getCanonicalUrl: (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${cleanPath}`;
  }
};
