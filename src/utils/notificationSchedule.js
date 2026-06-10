/** Ziyaretçi duyurusu — start_date / end_date penceresi (boş = sınırsız). */
export function isNotificationInSchedule(notification, now = new Date()) {
  if (!notification) return false;

  const t = now.getTime();
  if (notification.start_date) {
    const start = new Date(notification.start_date).getTime();
    if (!Number.isNaN(start) && t < start) return false;
  }
  if (notification.end_date) {
    const end = new Date(notification.end_date).getTime();
    if (!Number.isNaN(end) && t > end) return false;
  }
  return true;
}

export function filterScheduledNotifications(notifications, now = new Date()) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter((n) => isNotificationInSchedule(n, now));
}
