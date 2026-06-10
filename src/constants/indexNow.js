import { SITE_URL, SITE_HOST } from './siteUrl.js';

/** Production site — IndexNow key file must live at `${ORIGIN}/${KEY}.txt` */
export const INDEXNOW_SITE_ORIGIN = SITE_URL;
export const INDEXNOW_HOST = SITE_HOST;

const FALLBACK_KEY = '2e414b37f51bf23d4a0c9fd875085ece';

export const INDEXNOW_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INDEXNOW_KEY) || FALLBACK_KEY;

export const INDEXNOW_KEY_LOCATION = `${INDEXNOW_SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
