// Testa datu kopa. Datumi tiek rēķināti attiecībā pret šodienu,
// lai demonstrācijā vienmēr būtu redzami gaidāmie maksājumi.

function isoInDays(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const CATALOG = [
  { id: 'netflix', name: 'Netflix', category: 'Izklaide', color: '#E50914', mark: 'N',
    cancelUrl: 'https://www.netflix.com/cancelplan',
    plans: [
      { label: 'Standarta ar reklāmām', amount: 5.99, cycle: 'monthly' },
      { label: 'Standarta', amount: 13.99, cycle: 'monthly' },
      { label: 'Premium', amount: 19.99, cycle: 'monthly' },
    ] },
  { id: 'spotify', name: 'Spotify', category: 'Mūzika', color: '#1DB954', mark: 'S',
    cancelUrl: 'https://www.spotify.com/account/subscription/',
    plans: [
      { label: 'Student', amount: 7.99, cycle: 'monthly' },
      { label: 'Premium', amount: 10.99, cycle: 'monthly' },
      { label: 'Family', amount: 17.99, cycle: 'monthly' },
    ] },
  { id: 'youtube', name: 'YouTube Premium', category: 'Izklaide', color: '#FF0000', mark: '▶',
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    plans: [
      { label: 'Individual', amount: 11.99, cycle: 'monthly' },
      { label: 'Family', amount: 25.99, cycle: 'monthly' },
    ] },
  { id: 'icloud', name: 'iCloud+', category: 'Cits', color: '#0A84FF', mark: '☁',
    cancelUrl: 'https://support.apple.com/lv-lv/HT202039',
    plans: [
      { label: '50 GB', amount: 0.99, cycle: 'monthly' },
      { label: '200 GB', amount: 2.99, cycle: 'monthly' },
      { label: '2 TB', amount: 9.99, cycle: 'monthly' },
    ] },
  { id: 'disney', name: 'Disney+', category: 'Izklaide', color: '#113CCF', mark: 'D+',
    cancelUrl: 'https://www.disneyplus.com/account/subscription',
    plans: [
      { label: 'Standarta', amount: 5.99, cycle: 'monthly' },
      { label: 'Premium', amount: 11.99, cycle: 'monthly' },
    ] },
  { id: 'duolingo', name: 'Duolingo', category: 'Izglītība', color: '#58CC02', mark: 'D',
    cancelUrl: 'https://www.duolingo.com/settings/subscription',
    plans: [
      { label: 'Super', amount: 12.99, cycle: 'monthly' },
      { label: 'Super gadā', amount: 59.99, cycle: 'yearly' },
    ] },
  { id: 'chatgpt', name: 'ChatGPT Plus', category: 'Darbs', color: '#10A37F', mark: '✦',
    cancelUrl: 'https://chatgpt.com/#settings/Subscription',
    plans: [{ label: 'Plus', amount: 22.99, cycle: 'monthly' }] },
  { id: 'wolt', name: 'Wolt+', category: 'Cits', color: '#009DE0', mark: 'W',
    cancelUrl: 'https://wolt.com/lv/me/subscriptions',
    plans: [
      { label: 'Mēneša plāns', amount: 4.99, cycle: 'monthly' },
      { label: 'Gada plāns', amount: 49.00, cycle: 'yearly' },
    ] },
  { id: 'applemusic', name: 'Apple Music', category: 'Mūzika', color: '#FA243C', mark: '♪',
    cancelUrl: 'https://support.apple.com/lv-lv/HT202039',
    plans: [
      { label: 'Student', amount: 5.99, cycle: 'monthly' },
      { label: 'Individual', amount: 10.99, cycle: 'monthly' },
    ] },
];

export function seedSubscriptions() {
  return [
    { id: 'sub-1', catalogId: 'spotify', name: 'Spotify Premium', planLabel: 'Student',
      amount: 7.99, cycle: 'monthly', category: 'Mūzika', nextPayment: isoInDays(2),
      trialUntil: null, amountAfterTrial: null },
    { id: 'sub-2', catalogId: 'duolingo', name: 'Duolingo Super', planLabel: 'Super',
      amount: 0, cycle: 'monthly', category: 'Izglītība', nextPayment: isoInDays(5),
      trialUntil: isoInDays(5), amountAfterTrial: 12.99 },
    { id: 'sub-3', catalogId: 'icloud', name: 'iCloud+ 50 GB', planLabel: '50 GB',
      amount: 0.99, cycle: 'monthly', category: 'Cits', nextPayment: isoInDays(8),
      trialUntil: null, amountAfterTrial: null },
    { id: 'sub-4', catalogId: 'youtube', name: 'YouTube Premium', planLabel: 'Individual',
      amount: 11.99, cycle: 'monthly', category: 'Izklaide', nextPayment: isoInDays(14),
      trialUntil: null, amountAfterTrial: null },
    { id: 'sub-5', catalogId: null, name: 'MyFitness sporta klubs', planLabel: '',
      amount: 29.00, cycle: 'monthly', category: 'Sports', nextPayment: isoInDays(24),
      trialUntil: null, amountAfterTrial: null },
  ];
}
