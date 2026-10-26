// Naudas loģika: mēneša ekvivalents, kopsummas, noapaļošana un formatēšana.

export const CURRENCY = 'EUR';

// Noapaļo līdz centiem, izvairoties no peldošā punkta kļūdām (1.005 -> 1.01).
export function roundCents(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Vai abonements šobrīd ir bezmaksas izmēģinājumā.
export function isInTrial(subscription, today = new Date()) {
  if (!subscription?.trialUntil) return false;
  const [y, m, d] = subscription.trialUntil.split('-').map(Number);
  const end = new Date(y, m - 1, d);
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return end >= base;
}

// Summa, kas tiks ieturēta nākamajā maksājumā.
export function chargeAmount(subscription, today = new Date()) {
  if (isInTrial(subscription, today)) return 0;
  if (subscription?.trialUntil && subscription?.amountAfterTrial != null) {
    return roundCents(subscription.amountAfterTrial);
  }
  return roundCents(subscription?.amount);
}

// Gada abonements tiek pārrēķināts mēneša ekvivalentā.
export function monthlyEquivalent(subscription, today = new Date()) {
  const amount = chargeAmount(subscription, today);
  return subscription?.cycle === 'yearly' ? roundCents(amount / 12) : amount;
}

// Cik abonements maksā gadā.
export function yearlyEquivalent(subscription, today = new Date()) {
  const amount = chargeAmount(subscription, today);
  return subscription?.cycle === 'yearly' ? amount : roundCents(amount * 12);
}

export function monthlyTotal(subscriptions = [], today = new Date()) {
  return roundCents(subscriptions.reduce((sum, item) => sum + monthlyEquivalent(item, today), 0));
}

export function yearlyTotal(subscriptions = [], today = new Date()) {
  return roundCents(monthlyTotal(subscriptions, today) * 12);
}

const formatter = new Intl.NumberFormat('lv-LV', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(amount) {
  return `${formatter.format(roundCents(amount))} €`;
}

export function formatSigned(amount) {
  const value = roundCents(amount);
  return value === 0 ? formatMoney(0) : `−${formatMoney(value)}`;
}
