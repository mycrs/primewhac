/** Hero mozaiğinde TMDB verisi yokken gradient placeholder slot sayısı */
export const HERO_PLACEHOLDER_POSTER_COUNT = 18;

export function buildPlaceholderPosterList(count = HERO_PLACEHOLDER_POSTER_COUNT) {
  return Array.from({ length: count }, (_, i) => ({
    key: `ph-${i}`,
    url: null,
    hue: i % 6,
  }));
}
