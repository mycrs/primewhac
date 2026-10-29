import { useEffect } from 'react';

const ADMIN_DRAFT_PREFIX = 'qruzetv_admin_draft_v1';
const OMITTED_FIELD_PATTERN = /password|token|secret|api[_-]?key|access[_-]?key/i;

function getDraftKey(userId, pathname) {
  return `${ADMIN_DRAFT_PREFIX}:${userId || 'unknown'}:${pathname || '/yonetim'}`;
}

function isPersistableControl(control) {
  if (!control || control.disabled || control.type === 'file' || control.type === 'password') return false;
  const identity = `${control.name || ''} ${control.id || ''} ${control.getAttribute('data-draft-key') || ''}`;
  return !OMITTED_FIELD_PATTERN.test(identity);
}

function controlKey(control, index) {
  const identity = control.getAttribute('data-draft-key') || control.name || control.id;
  return `${identity || 'field'}:${index}`;
}

function getControls(root) {
  return [...root.querySelectorAll('input, textarea, select')].filter(isPersistableControl);
}

function readDraft(root) {
  const controls = {};
  getControls(root).forEach((control, index) => {
    const isCheckable = control.type === 'checkbox' || control.type === 'radio';
    controls[controlKey(control, index)] = {
      type: isCheckable ? 'checked' : control.tagName.toLowerCase(),
      value: isCheckable ? Boolean(control.checked) : control.value,
    };
  });
  return { savedAt: Date.now(), controls };
}

function setNativeValue(control, value) {
  const prototype = Object.getPrototypeOf(control);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
  if (descriptor?.set) descriptor.set.call(control, value);
  else control.value = value;
}

function setNativeChecked(control, checked) {
  const prototype = Object.getPrototypeOf(control);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'checked');
  if (descriptor?.set) descriptor.set.call(control, checked);
  else control.checked = checked;
}

function restoreDraft(root, draft) {
  if (!draft?.controls) return false;
  const controls = getControls(root);
  let restored = false;

  controls.forEach((control, index) => {
    const saved = draft.controls[controlKey(control, index)];
    if (!saved) return;

    if (saved.type === 'checked') {
      setNativeChecked(control, Boolean(saved.value));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (typeof saved.value === 'string') {
      setNativeValue(control, saved.value);
      control.dispatchEvent(new Event(control.tagName.toLowerCase() === 'select' ? 'change' : 'input', { bubbles: true }));
    }
    restored = true;
  });

  return restored;
}

function loadDraft(key) {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(key, root) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(readDraft(root)));
  } catch {
    // Taslak saklama yardımcı bir özelliktir; kota veya gizli mod hatası formu engellememeli.
  }
}

/**
 * Admin route'ları yeniden mount olduğunda yazılmamış input değerlerini korur.
 * Parola, token ve API anahtarı alanları bilinçli olarak saklanmaz.
 */
export function useAdminDraftPersistence({ rootRef, userId, pathname }) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !userId) return undefined;

    const key = getDraftKey(userId, pathname);
    const draft = loadDraft(key);
    let saveTimer;
    let hasUserInteracted = false;
    const restoreTimers = [100, 700, 1600, 3200].map((delay) => (
      window.setTimeout(() => {
        if (root.isConnected && !hasUserInteracted) restoreDraft(root, draft);
      }, delay)
    ));

    const persist = (event) => {
      if (!isPersistableControl(event.target)) return;
      hasUserInteracted = true;
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveDraft(key, root), 160);
    };

    root.addEventListener('input', persist, true);
    root.addEventListener('change', persist, true);

    return () => {
      if (hasUserInteracted && root.isConnected) saveDraft(key, root);
      window.clearTimeout(saveTimer);
      restoreTimers.forEach((timer) => window.clearTimeout(timer));
      root.removeEventListener('input', persist, true);
      root.removeEventListener('change', persist, true);
    };
  }, [pathname, rootRef, userId]);
}

export function clearAdminDrafts(userId) {
  if (!userId) return;
  try {
    const prefix = `${ADMIN_DRAFT_PREFIX}:${userId}:`;
    Array.from({ length: window.sessionStorage.length }, (_, index) => window.sessionStorage.key(index))
      .filter(Boolean)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Oturum kapatmayı taslak temizleme hatası nedeniyle durdurmayız.
  }
}

export default getDraftKey;
