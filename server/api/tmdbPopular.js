/**
 * TMDB popular movie/tv — ana sayfa hero poster mozaiği için.
 * Anahtar: TMDB_API_KEY veya VITE_TMDB_API_KEY
 */
export async function fetchTmdbPopularJson(path, query) {
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  if (!key) {
    return { status: 503, body: { success: false, error: 'TMDB_API_KEY tanımlı değil' } };
  }
  const lang = query.language || 'tr-TR';
  const page = query.page || '1';
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('language', String(lang));
  url.searchParams.set('page', String(page));
  url.searchParams.set('api_key', key);

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { success: false, error: 'Geçersiz TMDB yanıtı' };
  }
  return { status: res.status, body };
}
