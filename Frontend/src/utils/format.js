/**
 * Utilidades de formato para fechas, texto, etc.
 */

export function formatFecha(dateStr, locale = 'es-SV') {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(locale);
}

export function formatFechaHora(dateStr, locale = 'es-SV') {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(locale);
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str = '', max = 80) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
