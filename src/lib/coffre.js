export function fmt(n) {
  const neg = n < 0;
  return (neg ? '-$' : '$') + Math.abs(n).toLocaleString('fr-FR');
}

export function initials(str) {
  return str.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function dateStr(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}