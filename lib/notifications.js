import { daysUntil, fromISO, nextPaymentISO, formatMoney } from './dates.js';

const timers = [];
const MAX_TIMEOUT = 2147483647;

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function permissionGranted() {
  return notificationsSupported() && Notification.permission === 'granted';
}

export async function requestPermission() {
  if (!notificationsSupported()) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function show(title, body) {
  if (!permissionGranted()) return;
  try {
    new Notification(title, { body, tag: title + body });
  } catch {
    /* paziņojumu nevar parādīt */
  }
}

export function clearScheduled() {
  while (timers.length) clearTimeout(timers.pop());
}

// Lokālie paziņojumi: precīzi N x 24 stundas pirms maksājuma datuma.
export function scheduleNotifications(subscriptions, settings, notified, onNotified) {
  clearScheduled();
  if (!permissionGranted() || !settings.notificationsEnabled) return;

  const reminderDays = Number(settings.reminderDays || 2);
  const now = Date.now();

  subscriptions.forEach((sub) => {
    const dueISO = nextPaymentISO(sub);
    const dueTime = fromISO(dueISO).getTime();
    const fireTime = dueTime - reminderDays * 86400000;
    const key = `${sub.id}:${dueISO}`;
    if (notified[key]) return;

    const body = (days) => `Pēc ${days} dienām tiks ieturēti ${formatMoney(sub.amount)} par ${sub.name}`;

    if (fireTime <= now) {
      // Atgādinājums, kura brīdis jau ir pagājis (lietotne nebija atvērta).
      if (dueTime >= now) {
        show('SubSet atgādinājums', body(Math.max(1, daysUntil(dueISO))));
        onNotified(key);
      }
      return;
    }

    const delay = fireTime - now;
    if (delay > MAX_TIMEOUT) return;

    timers.push(setTimeout(() => {
      show('SubSet atgādinājums', body(reminderDays));
      onNotified(key);
    }, delay));
  });
}
