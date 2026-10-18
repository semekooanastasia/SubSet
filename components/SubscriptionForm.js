'use client';

import { useState } from 'react';
import { CATEGORIES, findCatalogItem } from '../lib/catalog.js';
import { formatMoney, todayISO } from '../lib/dates.js';

export default function SubscriptionForm({ initial, onSave, onCancel, saveLabel = 'Saglabāt' }) {
  const catalogItem = findCatalogItem(initial.catalogId);
  const [name, setName] = useState(initial.name || '');
  const [amount, setAmount] = useState(initial.amount != null ? String(initial.amount) : '');
  const [cycle, setCycle] = useState(initial.cycle || 'monthly');
  const [category, setCategory] = useState(initial.category || 'Cits');
  const [nextPayment, setNextPayment] = useState(initial.nextPayment || '');
  const [planLabel, setPlanLabel] = useState(initial.planLabel || '');
  const [touched, setTouched] = useState(false);

  const amountValue = Number.parseFloat(String(amount).replace(',', '.'));
  const nameOk = name.trim().length > 0;
  const amountOk = !Number.isNaN(amountValue) && amountValue > 0;
  const dateOk = Boolean(nextPayment);
  const valid = nameOk && amountOk && dateOk;

  function choosePlan(plan) {
    setPlanLabel(plan.label);
    setAmount(String(plan.amount));
    setCycle(plan.cycle);
  }

  function submit(event) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSave({
      ...initial,
      name: name.trim(),
      amount: Math.round(amountValue * 100) / 100,
      currency: 'EUR',
      cycle,
      category,
      nextPayment,
      planLabel,
    });
  }

  return (
    <form onSubmit={submit}>
      {catalogItem && (
        <div className="field">
          <span className="label">Tarifa plāns</span>
          <div className="list">
            {catalogItem.plans.map((plan) => (
              <button
                key={plan.label}
                type="button"
                className={`plan ${planLabel === plan.label ? 'active' : ''}`}
                onClick={() => choosePlan(plan)}
              >
                <span>{plan.label}</span>
                <span className="plan-amount">
                  {formatMoney(plan.amount)} / {plan.cycle === 'yearly' ? 'gadā' : 'mēn.'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor="sub-name">Nosaukums *</label>
        <input
          id="sub-name"
          className={`input ${touched && !nameOk ? 'invalid' : ''}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Piemēram, sporta klubs"
        />
      </div>

      <div className="row">
        <div className="field">
          <label className="label" htmlFor="sub-amount">Summa (EUR) *</label>
          <input
            id="sub-amount"
            className={`input ${touched && !amountOk ? 'invalid' : ''}`}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="12.99"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="sub-cycle">Regularitāte</label>
          <select
            id="sub-cycle"
            className="select"
            value={cycle}
            onChange={(event) => setCycle(event.target.value)}
          >
            <option value="monthly">Reizi mēnesī</option>
            <option value="yearly">Reizi gadā</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="sub-date">Nākamā maksājuma datums *</label>
        <input
          id="sub-date"
          className={`input ${touched && !dateOk ? 'invalid' : ''}`}
          type="date"
          min={todayISO()}
          value={nextPayment}
          onChange={(event) => setNextPayment(event.target.value)}
        />
      </div>

      <div className="field">
        <span className="label">Kategorija</span>
        <div className="chips">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {touched && !valid && (
        <div className="error">
          Lūdzu, aizpildiet visus obligātos laukus: nosaukums, summa un nākamā maksājuma datums.
        </div>
      )}

      <div className="row" style={{ marginTop: 18 }}>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Atcelt</button>
        )}
        <button type="submit" className="btn btn-primary" disabled={!valid}>{saveLabel}</button>
      </div>
    </form>
  );
}
