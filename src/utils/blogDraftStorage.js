const BLOG_DRAFT_PREFIX = 'qruzetv_blog_draft_v1';
const BLOG_ACTIVE_DRAFT_KEY = `${BLOG_DRAFT_PREFIX}:active`;

export function getBlogDraftKey(userId, postId) {
  return `${BLOG_DRAFT_PREFIX}:${userId || 'unknown'}:${postId || 'new'}`;
}

export function readBlogDraft(userId, postId) {
  try {
    const raw = window.sessionStorage.getItem(getBlogDraftKey(userId, postId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeBlogDraft(userId, postId, draft) {
  try {
    window.sessionStorage.setItem(
      getBlogDraftKey(userId, postId),
      JSON.stringify({ ...draft, savedAt: Date.now() }),
    );
  } catch {
    // Taslak yardımcı özelliktir; storage hatası blog editörünü engellemez.
  }
}

export function clearBlogDraft(userId, postId) {
  try {
    window.sessionStorage.removeItem(getBlogDraftKey(userId, postId));
  } catch {
    // Oturum kapatmayı storage hatası nedeniyle durdurmayız.
  }
}

export function readActiveBlogDraft(userId) {
  try {
    const raw = window.sessionStorage.getItem(`${BLOG_ACTIVE_DRAFT_KEY}:${userId || 'unknown'}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeActiveBlogDraft(userId, draft) {
  try {
    window.sessionStorage.setItem(
      `${BLOG_ACTIVE_DRAFT_KEY}:${userId || 'unknown'}`,
      JSON.stringify(draft),
    );
  } catch {
    // Taslak yardımcı özelliktir; storage hatası blog editörünü engellemez.
  }
}

export function clearActiveBlogDraft(userId) {
  try {
    window.sessionStorage.removeItem(`${BLOG_ACTIVE_DRAFT_KEY}:${userId || 'unknown'}`);
  } catch {
    // Oturum kapatmayı storage hatası nedeniyle durdurmayız.
  }
}

export function clearAllBlogDrafts(userId) {
  if (!userId) return;
  try {
    const prefix = `${BLOG_DRAFT_PREFIX}:${userId}:`;
    const activeKey = `${BLOG_ACTIVE_DRAFT_KEY}:${userId}`;
    Array.from({ length: window.sessionStorage.length }, (_, index) => window.sessionStorage.key(index))
      .filter((key) => key && (key.startsWith(prefix) || key === activeKey))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Oturum kapatmayı storage hatası nedeniyle durdurmayız.
  }
}
