
/**
 * Utility to migrate old domain to new domain in content and URLs
 */
export const OLD_DOMAIN = 'kaliteliiptv.com';
export const NEW_DOMAIN = 'streamtr.eu';

export const migrateUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  // Handle both http and https
  return url.replace(new RegExp(`https?://${OLD_DOMAIN}`, 'gi'), `https://${NEW_DOMAIN}`)
            .replace(new RegExp(OLD_DOMAIN, 'gi'), NEW_DOMAIN);
};

export const migrateContent = (content) => {
  if (!content || typeof content !== 'string') return content;
  return content.replace(new RegExp(`https?://${OLD_DOMAIN}`, 'gi'), `https://${NEW_DOMAIN}`)
                .replace(new RegExp(OLD_DOMAIN, 'gi'), NEW_DOMAIN);
};
