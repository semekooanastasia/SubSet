export const CATEGORIES = ['Izklaide', 'Darbs', 'Veselība/Sports', 'Izglītība', 'Cits'];

export const CATEGORY_COLORS = {
  'Izklaide': '#e0457b',
  'Darbs': '#3b7ddd',
  'Veselība/Sports': '#22a06b',
  'Izglītība': '#f0a020',
  'Cits': '#8a8f98',
};

// Populāro pakalpojumu katalogs ar iepriekš definētiem tarifiem.
export const CATALOG = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Izklaide',
    color: '#e50914',
    mark: 'N',
    cancelUrl: 'https://www.netflix.com/cancelplan',
    plans: [
      { label: 'Standarta ar reklāmām', amount: 5.99, cycle: 'monthly' },
      { label: 'Standarta', amount: 13.99, cycle: 'monthly' },
      { label: 'Premium', amount: 19.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Izklaide',
    color: '#1db954',
    mark: 'S',
    cancelUrl: 'https://www.spotify.com/account/subscription/',
    plans: [
      { label: 'Student', amount: 5.99, cycle: 'monthly' },
      { label: 'Individual', amount: 10.99, cycle: 'monthly' },
      { label: 'Family', amount: 17.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'Izklaide',
    color: '#ff0000',
    mark: '▶',
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    plans: [
      { label: 'Individual', amount: 12.99, cycle: 'monthly' },
      { label: 'Family', amount: 25.99, cycle: 'monthly' },
      { label: 'Gada plāns', amount: 129.99, cycle: 'yearly' },
    ],
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'Darbs',
    color: '#0a84ff',
    mark: '☁',
    cancelUrl: 'https://support.apple.com/lv-lv/HT202039',
    plans: [
      { label: '50 GB', amount: 0.99, cycle: 'monthly' },
      { label: '200 GB', amount: 2.99, cycle: 'monthly' },
      { label: '2 TB', amount: 9.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'wolt',
    name: 'Wolt+',
    category: 'Cits',
    color: '#009de0',
    mark: 'W',
    cancelUrl: 'https://wolt.com/lv/me/subscriptions',
    plans: [
      { label: 'Mēneša plāns', amount: 5.90, cycle: 'monthly' },
      { label: 'Gada plāns', amount: 59.00, cycle: 'yearly' },
    ],
  },
  {
    id: 'myfitness',
    name: 'MyFitness',
    category: 'Veselība/Sports',
    color: '#c8102e',
    mark: 'M',
    cancelUrl: 'https://myfitness.lv/lv/kontakti/',
    plans: [
      { label: 'Studentu', amount: 29.99, cycle: 'monthly' },
      { label: 'Standarta', amount: 44.99, cycle: 'monthly' },
      { label: 'Gada karte', amount: 399.00, cycle: 'yearly' },
    ],
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'Izglītība',
    color: '#58cc02',
    mark: 'D',
    cancelUrl: 'https://www.duolingo.com/settings/subscription',
    plans: [
      { label: 'Super mēnesī', amount: 12.99, cycle: 'monthly' },
      { label: 'Super gadā', amount: 59.99, cycle: 'yearly' },
    ],
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'Izklaide',
    color: '#113ccf',
    mark: 'D+',
    cancelUrl: 'https://www.disneyplus.com/account/subscription',
    plans: [
      { label: 'Standarta ar reklāmām', amount: 5.99, cycle: 'monthly' },
      { label: 'Standarta', amount: 9.99, cycle: 'monthly' },
      { label: 'Premium', amount: 13.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'hbomax', 
    name: 'HBO Max',
    category: 'Izklaide',
    color: '#7b2bf9',
    mark: 'H',
    cancelUrl: 'https://www.max.com/lv/lv/settings/subscription',
    plans: [
      { label: 'Basic ar reklāmām', amount: 5.99, cycle: 'monthly' },
      { label: 'Standarta', amount: 8.99, cycle: 'monthly' },
      { label: 'Premium', amount: 11.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    category: 'Darbs',
    color: '#d83b01',
    mark: '365',
    cancelUrl: 'https://account.microsoft.com/services/',
    plans: [
      { label: 'Personal', amount: 7.00, cycle: 'monthly' },
      { label: 'Family', amount: 10.00, cycle: 'monthly' },
      { label: 'Personal gadā', amount: 69.00, cycle: 'yearly' },
    ],
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'Darbs',
    color: '#ff0000',
    mark: 'A',
    cancelUrl: 'https://account.adobe.com/plans',
    plans: [
      { label: 'Studentu plāns', amount: 19.99, cycle: 'monthly' },
      { label: 'Photography', amount: 11.99, cycle: 'monthly' },
      { label: 'All Apps', amount: 65.99, cycle: 'monthly' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    category: 'Darbs',
    color: '#10a37f',
    mark: '✦',
    cancelUrl: 'https://chatgpt.com/#settings/Subscription',
    plans: [
      { label: 'Plus', amount: 20.00, cycle: 'monthly' },
    ],
  },
];

export function findCatalogItem(id) {
  return CATALOG.find((item) => item.id === id) || null;
}

// Nosaukuma atpazīšana bankas izraksta rindās.
export function matchCatalogByText(text) {
  const value = String(text || '').toLowerCase();
  return CATALOG.find((item) => {
    const name = item.name.toLowerCase();
    const firstWord = name.split(/[\s+]/)[0];
    return value.includes(name) || (firstWord.length > 3 && value.includes(firstWord));
  }) || null;
}
