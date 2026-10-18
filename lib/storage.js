const USERS_KEY = 'subset.users';
const SESSION_KEY = 'subset.session';
const THEME_KEY = 'subset.theme';

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* lokālā atmiņa nav pieejama */
  }
}

export function loadUsers() {
  return read(USERS_KEY, []);
}

export function saveUsers(users) {
  write(USERS_KEY, users);
}

export function loadSession() {
  return read(SESSION_KEY, null);
}

export function saveSession(email) {
  write(SESSION_KEY, email);
}

export function clearSession() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_KEY);
}

const DEFAULT_DATA = {
  subscriptions: [],
  settings: { reminderDays: 2, notificationsEnabled: false },
  notified: {},
};

export function loadData(email) {
  const data = read(`subset.data.${email}`, null);
  if (!data) return { ...DEFAULT_DATA, subscriptions: [], settings: { ...DEFAULT_DATA.settings }, notified: {} };
  return {
    subscriptions: data.subscriptions || [],
    settings: { ...DEFAULT_DATA.settings, ...(data.settings || {}) },
    notified: data.notified || {},
  };
}

export function saveData(email, data) {
  write(`subset.data.${email}`, data);
}

export function loadTheme() {
  return read(THEME_KEY, 'light');
}

export function saveTheme(theme) {
  write(THEME_KEY, theme);
}
