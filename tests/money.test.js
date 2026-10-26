// Naudas loģikas testi: noapaļošana, mēneša ekvivalents, kopsummas, izmēģinājumi.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  roundCents,
  isInTrial,
  chargeAmount,
  monthlyEquivalent,
  yearlyEquivalent,
  monthlyTotal,
  yearlyTotal,
} from '../lib/domain/money.js';

const TODAY = new Date(2026, 9, 26); // 26.10.2026

function sub(values) {
  return { amount: 0, cycle: 'monthly', trialUntil: null, amountAfterTrial: null, ...values };
}

test('roundCents noapaļo pusi centa uz augšu, nevis uz leju', () => {
  assert.equal(roundCents(1.005), 1.01);
  assert.equal(roundCents(2.675), 2.68);
});

test('roundCents novērš peldošā punkta kļūdas kopsummās', () => {
  assert.equal(roundCents(0.1 + 0.2), 0.3);
  assert.equal(roundCents(7.99 + 0.99 + 11.99), 20.97);
});

test('roundCents atgriež 0 nederīgai vērtībai', () => {
  assert.equal(roundCents(undefined), 0);
  assert.equal(roundCents('nav skaitlis'), 0);
});

test('gada abonements tiek pārrēķināts mēneša ekvivalentā', () => {
  assert.equal(monthlyEquivalent(sub({ amount: 59.99, cycle: 'yearly' }), TODAY), 5);
  assert.equal(monthlyEquivalent(sub({ amount: 49, cycle: 'yearly' }), TODAY), 4.08);
});

test('mēneša abonementam ekvivalents ir pati summa', () => {
  assert.equal(monthlyEquivalent(sub({ amount: 10.99 }), TODAY), 10.99);
});

test('mēneša kopsumma saskaita mēneša un gada abonementus', () => {
  const items = [
    sub({ amount: 7.99 }),
    sub({ amount: 0.99 }),
    sub({ amount: 59.99, cycle: 'yearly' }), // 5.00 mēnesī
  ];
  assert.equal(monthlyTotal(items, TODAY), 13.98);
});

test('gada kopsumma ir mēneša kopsumma reiz divpadsmit', () => {
  const items = [sub({ amount: 7.99 }), sub({ amount: 0.99 })];
  assert.equal(monthlyTotal(items, TODAY), 8.98);
  assert.equal(yearlyTotal(items, TODAY), 107.76);
});

test('izmēģinājuma periods tiek atpazīts līdz beigu datumam ieskaitot', () => {
  assert.equal(isInTrial(sub({ trialUntil: '2026-10-31' }), TODAY), true);
  assert.equal(isInTrial(sub({ trialUntil: '2026-10-26' }), TODAY), true);
  assert.equal(isInTrial(sub({ trialUntil: '2026-10-25' }), TODAY), false);
  assert.equal(isInTrial(sub({ trialUntil: null }), TODAY), false);
});

test('abonements izmēģinājumā netiek ieskaitīts mēneša kopsummā', () => {
  const items = [
    sub({ amount: 7.99 }),
    sub({ amount: 0, trialUntil: '2026-10-31', amountAfterTrial: 12.99 }),
  ];
  assert.equal(chargeAmount(items[1], TODAY), 0);
  assert.equal(monthlyTotal(items, TODAY), 7.99);
});

test('pēc izmēģinājuma beigām tiek ieskaitīta summa, kas būs jāmaksā', () => {
  const trialOver = sub({ amount: 0, trialUntil: '2026-10-01', amountAfterTrial: 12.99 });
  assert.equal(chargeAmount(trialOver, TODAY), 12.99);
  assert.equal(monthlyTotal([trialOver], TODAY), 12.99);
});

test('gada kopsumma vienam abonementam: mēneša reiz divpadsmit', () => {
  assert.equal(yearlyEquivalent(sub({ amount: 12.99 }), TODAY), 155.88);
  assert.equal(yearlyEquivalent(sub({ amount: 7.99 }), TODAY), 95.88);
});

test('gada abonementam gada kopsumma ir pati summa', () => {
  assert.equal(yearlyEquivalent(sub({ amount: 59.99, cycle: 'yearly' }), TODAY), 59.99);
});
