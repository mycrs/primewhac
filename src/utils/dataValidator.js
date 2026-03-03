/**
 * Data Validation & Sanitization Middleware
 * Ensures all data from TMDB is clean, safe, and structured correctly.
 */

/**
 * Simple text sanitizer to prevent basic XSS when rendering HTML (though React escapes by default).
 * Used primarily for cleaning raw text data before storage or complex processing.
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates a single movie object structure.
 * @param {Object} movie 
 * @returns {Object|null} Validated movie object or null if invalid
 */
export const validateMovieData = (movie) => {
  if (!movie || typeof movie !== 'object') return null;
  if (!movie.id || (!movie.title && !movie.original_title)) return null;

  return {
    ...movie,
    id: Number(movie.id),
    title: sanitizeText(movie.title || movie.original_title),
    overview: sanitizeText(movie.overview || ''),
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    release_date: movie.release_date || null,
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0
  };
};

/**
 * Validates a single TV show object structure.
 * @param {Object} tv 
 * @returns {Object|null}
 */
export const validateTVData = (tv) => {
  if (!tv || typeof tv !== 'object') return null;
  if (!tv.id || (!tv.name && !tv.original_name)) return null;

  return {
    ...tv,
    id: Number(tv.id),
    name: sanitizeText(tv.name || tv.original_name),
    overview: sanitizeText(tv.overview || ''),
    poster_path: tv.poster_path || null,
    backdrop_path: tv.backdrop_path || null,
    first_air_date: tv.first_air_date || null,
    vote_average: typeof tv.vote_average === 'number' ? tv.vote_average : 0
  };
};

/**
 * General structure validator for list responses
 */
export const validateDataStructure = (response) => {
  if (!response || typeof response !== 'object') return false;
  
  // Clean generic list results if present
  if (Array.isArray(response.results)) {
    response.results = response.results
      .map(item => {
        // Detect type and validate accordingly
        if (item.title) return validateMovieData(item);
        if (item.name) return validateTVData(item);
        return item; // Return as is if unknown type, but sanitized where possible in specific funcs if expanded
      })
      .filter(item => item !== null);
  }
  
  return response;
};