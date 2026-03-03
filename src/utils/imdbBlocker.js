/**
 * IMDb Scraping Prevention System
 * strictly blocks any attempts to access IMDb directly or use IMDb URLs.
 */

const IMDB_DOMAINS = [
  'imdb.com',
  'm.imdb.com',
  'www.imdb.com',
  'imdb-api.com'
];

const IMDB_ID_PATTERN = /^tt\d{7,8}$/;

/**
 * Validates that the data source is explicitly TMDB.
 * @param {string} source - The source identifier
 * @returns {boolean}
 */
export const validateDataSource = (source) => {
  if (!source || source.toLowerCase() !== 'tmdb') {
    console.error('Security Alert: Invalid data source detected. Only TMDB is authorized.');
    return false;
  }
  return true;
};

/**
 * Checks if a URL belongs to IMDb.
 * @param {string} url 
 * @returns {boolean}
 */
export const isIMDbURL = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return IMDB_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch (e) {
    // If not a valid URL object, check string content
    return IMDB_DOMAINS.some(domain => url.includes(domain));
  }
};

/**
 * Blocks execution if an IMDb URL is detected.
 * Throws a security error to stop processing.
 * @param {string} url 
 */
export const blockIMDbAccess = (url) => {
  if (isIMDbURL(url)) {
    const error = new Error('SECURITY VIOLATION: Direct IMDb access is prohibited.');
    error.code = 'IMDB_ACCESS_DENIED';
    console.error(error.message);
    throw error;
  }
};

/**
 * Validates an ID to ensure it's not being used for scraping attempts alongside IMDb URLs.
 * While TMDB allows external_source=imdb_id, we want to ensure we aren't constructing IMDb URLs.
 * @param {string} id 
 */
export const validateIdFormat = (id) => {
  // We allow tt IDs for lookup via TMDB API /find endpoint, but we flag if it looks like a scraping URL construction
  if (typeof id === 'string' && id.includes('imdb.com')) {
    throw new Error('SECURITY VIOLATION: IMDb URL detected in ID field.');
  }
};