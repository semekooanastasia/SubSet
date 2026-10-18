export const MONTHS = [
  'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
  'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris',
];

export const MONTHS_SHORT = [
  'jan.', 'feb.', 'mar.', 'apr.', 'mai.', 'jūn.',
  'jūl.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.',
];

export const WEEKDAYS_SHORT = ['P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'];

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO() {
  return toISO(new Date());
}

export function addMonths(date, count) {
  const day = date.getDate();
  const result = new Date(date.getFullYear(), date.getMonth() + count, 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

// Maksājuma datums, kas pārritināts uz nākamo aktuālo termiņu.
export function nextPaymentDate(sub, fromDate = new Date()) {
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  let date = fromISO(sub.nextPayment);
  let guard = 0;
  while (date < base && guard < 600) {
    date = sub.cycle === 'yearly' ? addMonths(date, 12) : addMonths(date, 1);
    guard += 1;
  }
  return date;
}

export function nextPaymentISO(sub, fromDate = new Date()) {
  return toISO(nextPaymentDate(sub, fromDate));
}

export function daysUntil(iso, fromDate = new Date()) {
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const target = fromISO(iso);
  return Math.round((target - base) / 86400000);
}

export function daysLabel(days) {
  if (days === 0) return 'Šodien';
  if (days === 1) return 'Rīt';
  return `Pēc ${days} dienām`;
}

export function formatDate(iso) {
  const d = fromISO(iso);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatFullDate(iso) {
  const d = fromISO(iso);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMoney(amount) {
  return `${Number(amount || 0).toFixed(2)} €`;
}

export function monthlyEquivalent(sub) {
  const amount = Number(sub.amount || 0);
  return sub.cycle === 'yearly' ? amount / 12 : amount;
}

export function monthlyTotal(subs) {
  return subs.reduce((sum, sub) => sum + monthlyEquivalent(sub), 0);
}

export function yearlyTotal(subs) {
  return monthlyTotal(subs) * 12;
}
