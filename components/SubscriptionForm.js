'use client';

import { useState } from 'react';
import { CATEGORIES } from '../lib/domain/categories.js';
import { formatMoney } from '../lib/domain/money.js';
import { todayISO } from '../lib/domain/dates.js';

export default function SubscriptionForm({ initial, catalogItem, onSubmit, submitLabel = 'Saglabāt' }) {
  const [name, setName] = useState(initial.name || '');
  const [amount, setAmount] = useState(initial.amount != null ? String(initial.amount) : '');
  const [cycle, setCycle] = useState(initial.cycle || 'monthly');
  const [category, setCategory] = useState(initial.category || 'Cits');
  const [nextPayment, setNextPayment] = useState(initial.nextPayment || '');
  const [planLabel, setPlanLabel] = useState(initial.planLabel || '');
  const [trial, setTrial] = useState(Boolean(initial.trialUntil));
  const [trialUntil, setTrialUntil] = useState(initial.trialUntil || '');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState(null);

  const amountValue = Number.parseFloat(String(amount).replace(',', '.'));
  const nameOk = name.trim().length > 0;
  const amountOk = Number.isFinite(amountValue) && amountValue > 0;
  // Ar izmēģinājumu obligātais datums ir izmēģinājuma beigas, nevis nākamais maksājums:
  // ar `Boolean(nextPayment)` poga nekad neatslēgtos, jo šo lauku forma tad nerāda.
  const dateOk = trial ? Boolean(trialUntil) : Boolean(nextPayment);
  const valid = nameOk && amountOk && dateOk;

  function choosePlan(plan) {
    setPlanLabel(plan.label);
    setAmount(String(plan.amount));
    setCycle(plan.cycle);
  }

  async function submit(event) {
    event.preventDefault();
    setTouched(true);
    setApiError(null);
    if (!valid || busy) return;
    setBusy(true);
    try {
      await onSubmit({
        catalogId: catalogItem?.id ?? initial.catalogId ?? null,
        name: name.trim(),
        planLabel,
        amount: trial ? 0 : Math.round(amountValue * 100) / 100,
        amountAfterTrial: trial ? Math.round(amountValue * 100) / 100 : null,
        trialUntil: trial ? trialUntil : null,
        cycle,
        category,
        nextPayment: trial ? trialUntil : nextPayment,
      });
    } catch (caught) {
      setApiError(caught);
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {catalogItem && (
        <div className="field">
          <span className="label">Tarifa plāns</span>
          <div className="card-list">
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
        <label className="label" htmlFor="name">Nosaukums *</label>
        <input
          id="name"
          className={`input ${touched && !nameOk ? 'invalid' : ''}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Piemēram, sporta klubs"
        />
      </div>

      <div className="row-fields">
        <div className="field">
          <label className="label" htmlFor="amount">Summa (EUR) *</label>
          <input
            id="amount"
            className={`input ${touched && !amountOk ? 'invalid' : ''}`}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="12,99"
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="cycle">Regularitāte</label>
          <select id="cycle" className="input" value={cycle} onChange={(event) => setCycle(event.target.value)}>
            <option value="monthly">Reizi mēnesī</option>
            <option value="yearly">Reizi gadā</option>
          </select>
        </div>
      </div>

      <div className="field switch-row">
        <span className="label" style={{ margin: 0 }}>Bezmaksas izmēģinājums</span>
        <button
          type="button"
          className={`switch ${trial ? 'on' : ''}`}
          onClick={() => setTrial((current) => !current)}
          aria-label="Bezmaksas izmēģinājums"
        />
      </div>

      {trial ? (
        <div className="field">
          <label className="label" htmlFor="trial">Izmēģinājums beidzas *</label>
          <input
            id="trial"
            className={`input ${touched && !dateOk ? 'invalid' : ''}`}
            type="date"
            min={todayISO()}
            value={trialUntil}
            onChange={(event) => setTrialUntil(event.target.value)}
          />
          <p className="hint">Pirmais maksājums tiks gaidīts šajā datumā.</p>
        </div>
      ) : (
        <div className="field">
          <label className="label" htmlFor="date">Nākamā maksājuma datums *</label>
          <input
            id="date"
            className={`input ${touched && !dateOk ? 'invalid' : ''}`}
            type="date"
            min={todayISO()}
            value={nextPayment}
            onChange={(event) => setNextPayment(event.target.value)}
          />
        </div>
      )}

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
        <p className="error">Aizpildi obligātos laukus: nosaukums, summa un datums.</p>
      )}
      {apiError && <p className="error">{apiError.message} (kods: {apiError.code})</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={!valid || busy}>
        {busy ? 'Saglabā…' : submitLabel}
      </button>
    </form>
  );
}
