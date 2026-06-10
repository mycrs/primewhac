/**
 * Cyclic accents for review cards: mor, turkuaz, turuncu, yeşil, pembe, mavi.
 * Use: getReviewAccent(i)  // i % palette.length
 */
export const REVIEW_CARD_ACCENTS = [
  { solid: '#a855f7', rgb: '168, 85, 247' },
  { solid: '#2dd4bf', rgb: '45, 212, 191' },
  { solid: '#fb923c', rgb: '251, 146, 60' },
  { solid: '#4ade80', rgb: '74, 222, 128' },
  { solid: '#f472b6', rgb: '244, 114, 182' },
  { solid: '#60a5fa', rgb: '96, 165, 250' },
];

export function getReviewAccent(index) {
  const n = REVIEW_CARD_ACCENTS.length;
  const i = ((index % n) + n) % n;
  return REVIEW_CARD_ACCENTS[i];
}

export function reviewerInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
