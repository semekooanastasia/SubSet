// Pakalpojumu logotipi no K2 prototipa (Figma komponente "Service logo", mezgls 5:35).
// `scale` ir glifa daļa no plāksnītes malas — tā pati proporcija, kas prototipā (44 px plāksnīte).
// Augstums netiek uzdots: to nosaka pats attēls, lai proporcijas nesabojātos.
export const SERVICE_LOGOS = {
  netflix: { file: '/logos/netflix.svg', background: '#000000', scale: 26 / 44 },
  spotify: { file: '/logos/spotify.svg', background: '#000000', scale: 30 / 44 },
  youtube: { file: '/logos/youtube.svg', background: '#ffffff', scale: 30 / 44, border: true },
  icloud: { file: '/logos/icloud.svg', background: 'linear-gradient(#4fa9fa, #1c6fe3)', scale: 28 / 44 },
  duolingo: { file: '/logos/duolingo.svg', background: '#ffffff', scale: 1 },
  wolt: { file: '/logos/wolt.png', background: '#ffffff', scale: 1, border: true },
  chatgpt: { file: '/logos/chatgpt.svg', background: '#000000', scale: 28 / 44 },
  disney: { file: '/logos/disney.svg', background: 'linear-gradient(#0b1a4f, #1a3e9e)', scale: 36 / 44 },
  applemusic: { file: '/logos/applemusic.svg', background: '#ffffff', scale: 1 },
};

// Sporta klubiem kataloga nav, bet prototipā tiem ir savs glifs. Tas nav zīmola
// logotips, tāpēc krāsu ņem no tēmas (`tint`) — citādi tumšajā režīmā tas pazūd.
const SPORTS_LOGO = { file: '/logos/myfitness.svg', background: 'var(--surface-2)', scale: 24 / 44, tint: true };

// Logotips pakalpojumam vai `null`, ja tāda nav — tad tiek rādīta monogramma.
export function logoFor(catalogId, category) {
  if (catalogId && SERVICE_LOGOS[catalogId]) return SERVICE_LOGOS[catalogId];
  if (category === 'Sports') return SPORTS_LOGO;
  return null;
}
