// Lietotāja iestatījumi tiek glabāti lokāli ierīcē.
const KEY = 'subset.settings';

export const DEFAULT_SETTINGS = { reminderDays: 2, notificationsEnabled: false, theme: 'light' };

export function loadSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* lokālā atmiņa nav pieejama */
  }
}
