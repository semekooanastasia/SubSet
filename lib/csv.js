import { toISO } from './domain/dates.js';

// Nosaukuma atpazīšana bankas izraksta rindās.
function matchCatalogByText(catalog, text) {
  const value = String(text || '').toLowerCase();
  return catalog.find((item) => {
    const name = item.name.toLowerCase();
    const firstWord = name.split(/[\s+]/)[0];
    return value.includes(name) || (firstWord.length > 3 && value.includes(firstWord));
  }) || null;
}

// Atdalītājs tiek noteikts vienreiz visam failam: bankas izrakstā ar ';'
// komats ir decimāldaļas zīme (-7,99), tāpēc pēc tā dalīt nedrīkst.
function detectDelimiter(line) {
  const counts = { ';': 0, '\t': 0, ',': 0 };
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') i += 1;
      else quoted = !quoted;
    } else if (!quoted && counts[char] !== undefined) {
      counts[char] += 1;
    }
  }
  if (counts[';'] > 0) return ';';
  if (counts['\t'] > 0) return '\t';
  return ',';
}

function splitLine(line, delimiter) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && char === delimiter) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseAmount(value) {
  const cleaned = String(value || '')
    .replace(/\s/g, '')
    .replace(/[€"]/g, '')
    .replace(',', '.');
  const number = Number.parseFloat(cleaned);
  if (Number.isNaN(number)) return null;
  return Math.abs(number);
}

function parseDate(value) {
  const text = String(value || '').trim();
  let match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  match = text.match(/^(\d{2})[.\/](\d{2})[.\/](\d{4})/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return null;
}

// Atrod bankas izrakstā regulāros maksājumus un piedāvā tos importēšanai.
export function parseStatement(text, catalog = []) {
  const lines = String(text || '').split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = detectDelimiter(lines[0]);
  const rows = lines.map((line) => splitLine(line, delimiter));
  const header = rows[0].map((cell) => cell.toLowerCase());
  const looksLikeHeader = header.some((cell) => /datum|date|summ|amount|apraksts|description|details/.test(cell));
  const body = looksLikeHeader ? rows.slice(1) : rows;

  const found = new Map();

  body.forEach((cells) => {
    let date = null;
    let amount = null;
    const textParts = [];

    cells.forEach((cell) => {
      const cellDate = parseDate(cell);
      if (cellDate && !date) {
        date = cellDate;
        return;
      }
      const cellAmount = parseAmount(cell);
      if (cellAmount !== null && cellAmount > 0 && /^[-+\s€"]*\d/.test(cell)) {
        if (amount === null) amount = cellAmount;
        return;
      }
      if (cell.length > 1) textParts.push(cell);
    });

    const description = textParts.join(' ');
    if (amount === null || !description) return;

    const item = matchCatalogByText(catalog, description);
    const key = item ? item.id : description.toLowerCase().slice(0, 32);
    const existing = found.get(key);
    if (existing) {
      existing.occurrences += 1;
      if (date && (!existing.date || date > existing.date)) existing.date = date;
      return;
    }

    found.set(key, {
      key,
      catalogId: item ? item.id : null,
      name: item ? item.name : description.slice(0, 40),
      category: item ? item.category : 'Cits',
      amount,
      date: date || toISO(new Date()),
      occurrences: 1,
    });
  });

  return Array.from(found.values()).filter((entry) => entry.catalogId || entry.occurrences > 1);
}
