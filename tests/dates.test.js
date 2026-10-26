// Datumu loģikas testi: maksājuma pārritināšana un atlikušās dienas.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addMonths,
  nextPaymentISO,
  daysUntil,
  toISO,
  fromISO,
  formatDateWithWeekdayYear,
  reminderTime,
  formatReminder,
} from '../lib/domain/dates.js';

const TODAY = new Date(2026, 9, 26); // 26.10.2026

test('addMonths nepārlec pāri īsākam mēnesim', () => {
  assert.equal(toISO(addMonths(fromISO('2026-01-31'), 1)), '2026-02-28');
  assert.equal(toISO(addMonths(fromISO('2026-03-31'), 1)), '2026-04-30');
  assert.equal(toISO(addMonths(fromISO('2024-01-31'), 1)), '2024-02-29'); // garais gads
});

test('maksājuma datums 31.01. pārritinās uz 28.02.', () => {
  const sub = { nextPayment: '2026-01-31', cycle: 'monthly' };
  assert.equal(nextPaymentISO(sub, new Date(2026, 1, 15)), '2026-02-28');
});

test('pagājis maksājums tiek pārritināts uz nākamo termiņu', () => {
  const monthly = { nextPayment: '2026-08-05', cycle: 'monthly' };
  assert.equal(nextPaymentISO(monthly, TODAY), '2026-11-05');

  const yearly = { nextPayment: '2024-03-10', cycle: 'yearly' };
  assert.equal(nextPaymentISO(yearly, TODAY), '2027-03-10');
});

test('šodienas maksājums netiek pārritināts uz nākamo mēnesi', () => {
  const sub = { nextPayment: '2026-10-26', cycle: 'monthly' };
  assert.equal(nextPaymentISO(sub, TODAY), '2026-10-26');
});

test('daysUntil rēķina pilnas dienas neatkarīgi no pulksteņa', () => {
  assert.equal(daysUntil('2026-10-26', TODAY), 0);
  assert.equal(daysUntil('2026-10-27', TODAY), 1);
  assert.equal(daysUntil('2026-11-02', TODAY), 7);
  assert.equal(daysUntil('2026-10-25', TODAY), -1);
});

test('daysUntil pareizi pārvar vasaras laika maiņu', () => {
  // Latvijā pulkstenis tiek pārcelts 25.10.2026. Starpībai jāpaliek veselās dienās.
  assert.equal(daysUntil('2026-10-30', new Date(2026, 9, 23)), 7);
});

test('atgādinājums iekrīt N dienas pirms maksājuma plkst. 09:00', () => {
  const date = reminderTime('2026-10-15', 2);
  assert.equal(toISO(date), '2026-10-13');
  assert.equal(date.getHours(), 9);
  assert.equal(date.getMinutes(), 0);
});

test('atgādinājums pārlec pāri mēneša sākumam', () => {
  assert.equal(toISO(reminderTime('2026-11-02', 7)), '2026-10-26');
});

test('formatReminder atgriež tekstu ar nedēļas dienu un laiku', () => {
  assert.equal(formatReminder('2026-10-15', 2), 'otrdien, 13. okt. 09:00');
});

test('formatDateWithWeekdayYear pievieno gadu', () => {
  assert.equal(formatDateWithWeekdayYear('2026-10-15'), 'ceturtdien, 15. okt. 2026');
});
