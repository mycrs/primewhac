
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const buildImageUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=Kein+Bild';
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return `${rating.toFixed(1)}/10`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Kein Datum';
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export const handleTMDBError = (error) => {
  const code = error.response?.status;

  if (code === 401) {
    return 'API-Konfigurationsfehler: Nicht autorisierter Zugriff.';
  }
  if (code === 404) {
    return 'Der angeforderte Inhalt konnte nicht gefunden werden.';
  }
  if (code === 429) {
    return 'Zu viele Anfragen. Bitte warten Sie einen Moment.';
  }
  if (error.name === 'AbortError') {
    return 'Die Verbindung ist abgelaufen. Bitte überprüfen Sie Ihre Internetverbindung.';
  }
  if (!error.response && error.request) {
    return 'Der Server ist nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.';
  }
  
  return error.message || error.response?.data?.status_message || 'Ein unerwarteter Fehler ist aufgetreten.';
};

export const validateTMDBResponse = (response) => {
  if (!response || !response.results) {
    if (!response || (!response.id && !response.parts)) {
      throw new Error('Ungültige API-Antwort: Keine Daten empfangen.');
    }
  }
  return response;
};
