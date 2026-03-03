
import { migrateUrl, migrateContent } from './linkMigration';
import { executeDomainRedirect } from '@/middleware/redirectMiddleware';

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
    return `https://primewatch.tv${cleanPath}`;
  }
};
