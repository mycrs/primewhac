/** datetime-local input ↔ ISO (timestamptz) */

export function isoToDatetimeLocalInput(iso) {
  if (iso == null || iso === '') return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** @param {string} localValue - datetime-local value */
export function datetimeLocalInputToIso(localValue) {
  if (!localValue || !String(localValue).trim()) return null;
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
