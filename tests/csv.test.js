// Bankas izraksta parsēšanas testi: atdalītāji, summu formāts, atkārtojumi.
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseStatement } from '../lib/csv.js';

const CATALOG = [
  { id: 'spotify', name: 'Spotify', category: 'Mūzika' },
  { id: 'netflix', name: 'Netflix', category: 'Izklaide' },
];

test('parsē izrakstu ar semikolu atdalītāju', () => {
  const text = [
    'Datums;Apraksts;Summa',
    '2026-10-05;SPOTIFY P12345 STOCKHOLM;-7,99',
  ].join('\n');

  const rows = parseStatement(text, CATALOG);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].catalogId, 'spotify');
  assert.equal(rows[0].amount, 7.99);
  assert.equal(rows[0].date, '2026-10-05');
  assert.equal(rows[0].category, 'Mūzika');
});

test('parsē izrakstu ar komatu atdalītāju un punktu decimāldaļā', () => {
  const text = [
    'Date,Description,Amount',
    '05.10.2026,NETFLIX.COM AMSTERDAM,-13.99',
  ].join('\n');

  const rows = parseStatement(text, CATALOG);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].catalogId, 'netflix');
  assert.equal(rows[0].amount, 13.99);
  assert.equal(rows[0].date, '2026-10-05');
});

test('viens un tas pats pakalpojums vairākos mēnešos tiek apvienots', () => {
  const text = [
    'Datums;Apraksts;Summa',
    '2026-08-05;SPOTIFY P12345;-7,99',
    '2026-09-05;SPOTIFY P12345;-7,99',
    '2026-10-05;SPOTIFY P12345;-7,99',
  ].join('\n');

  const rows = parseStatement(text, CATALOG);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].occurrences, 3);
  assert.equal(rows[0].date, '2026-10-05'); // saglabā jaunāko datumu
});

test('vienreizējs maksājums ārpus kataloga netiek piedāvāts importam', () => {
  const text = [
    'Datums;Apraksts;Summa',
    '2026-10-05;RIMI RIGA;-24,30',
  ].join('\n');

  assert.deepEqual(parseStatement(text, CATALOG), []);
});

test('atkārtots maksājums ārpus kataloga tiek piedāvāts importam', () => {
  const text = [
    'Datums;Apraksts;Summa',
    '2026-09-05;MYFITNESS RIGA;-29,00',
    '2026-10-05;MYFITNESS RIGA;-29,00',
  ].join('\n');

  const rows = parseStatement(text, CATALOG);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].catalogId, null);
  assert.equal(rows[0].amount, 29);
  assert.equal(rows[0].category, 'Cits');
});

test('tukšs izraksts neizraisa kļūdu', () => {
  assert.deepEqual(parseStatement('', CATALOG), []);
  assert.deepEqual(parseStatement(null, CATALOG), []);
});
