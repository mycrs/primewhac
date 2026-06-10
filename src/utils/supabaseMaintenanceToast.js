import { PUBLIC_MAINTENANCE_TOAST_DESCRIPTION } from '@/constants/publicMaintenanceMessage';

const STORAGE_KEY = 'sb_public_maintenance_toast_once_v1';

/**
 * Oturum başına bir kez bakım bildirimi (8+ sn). Teknik hata metni göstermez.
 * @param {(opts: object) => void} toastFn — useToast().toast
 */
export function showPublicMaintenanceToastOnce(toastFn) {
  if (typeof toastFn !== 'function') return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
  toastFn({
    title: 'Bilgilendirme',
    description: PUBLIC_MAINTENANCE_TOAST_DESCRIPTION,
    duration: 8000,
    className: 'border-amber-600/40 bg-[#14121a] text-white',
  });
}
