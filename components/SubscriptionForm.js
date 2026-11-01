'use client';

import { useRef, useState } from 'react';
import { CATEGORIES } from '../lib/domain/categories.js';
import { formatMoney } from '../lib/domain/money.js';
import { todayISO } from '../lib/domain/dates.js';
import ServiceIcon from './ui/ServiceIcon.js';
import Icon from './ui/Icon.js';

function decimal(value) {
  return String(value).replace('.', ',');
}

// K2 prototipā ir divi ekrāni ar atšķirīgiem laukiem:
// S-06 (no kataloga) — tarifs, summa, regularitāte, datums;
// S-05M (manuāli) — priekšskatījums, nosaukums, summa, regularitāte, datums, kategorija.
export default function SubscriptionForm({ initial, catalogItem, onSubmit, submitLabel = 'Turpināt' }) {
  const fromCatalog = Boolean(catalogItem);
  const dateRef = useRef(null);

  const [name, setName] = useState(initial.name || '');
  // Latviski decimāldaļu atdala komats, tāpat kā prototipā un formatMoney izvadē.
  const [amount, setAmount] = useState(initial.amount != null ? decimal(initial.amount) : '');
  const [cycle, setCycle] = useState(initial.cycle || 'monthly');
  const [category, setCategory] = useState(initial.category || 'Cits');
  const [nextPayment, setNextPayment] = useState(initial.nextPayment || '');
  const [planLabel, setPlanLabel] = useState(initial.planLabel || '');
  const [trial, setTrial] = useState(Boolean(initial.trialUntil));
  const [trialUntil, setTrialUntil] = useState(initial.trialUntil || '');
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
    setAmount(decimal(plan.amount));
    setCycle(plan.cycle);
  }

  function openPicker() {
    const field = dateRef.current;
    if (!field) return;
    if (typeof field.showPicker === 'function') field.showPicker();
    else field.focus();
  }

  async function submit(event) {
    event.preventDefault();
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

  const cycleChips = [
    { value: 'monthly', label: 'Reizi mēnesī' },
    { value: 'yearly', label: 'Reizi gadā' },
  ];

  return (
    <form className="form" onSubmit={submit}>
      {fromCatalog ? (
        <div className="service-card">
          <ServiceIcon catalogId={catalogItem.id} category={catalogItem.category} name={catalogItem.name} />
          <div>
            <div className="service-name">{catalogItem.name}</div>
            <div className="service-meta">{catalogItem.category}, aizpildīts no kataloga</div>
          </div>
        </div>
      ) : (
        <div className="field">
          <span className="label">Priekšskatījums sarakstā</span>
          <div className="service-card muted-card">
            <ServiceIcon category={category} name={name} />
            <div className="service-body">
              <div className="service-name">{name.trim() || 'Nosaukums'}</div>
              <div className="service-meta">
                {nextPayment ? nextPayment.split('-').reverse().join('.') : 'Datums'}, {category}
              </div>
            </div>
            <div className="service-amount">{formatMoney(amountOk ? amountValue : 0)}</div>
          </div>
        </div>
      )}

      {fromCatalog && (
        <div className="field">
          <span className="label">Tarifs</span>
          <div className="chips">
            {catalogItem.plans.map((plan) => (
              <button
                key={plan.label}
                type="button"
                className={`chip ${planLabel === plan.label ? 'active' : ''}`}
                onClick={() => choosePlan(plan)}
              >
                {planLabel === plan.label && <Icon name="check" size={16} />}
                {plan.label} {formatMoney(plan.amount)}
              </button>
            ))}
          </div>
        </div>
      )}

      {!fromCatalog && (
        <div className="field">
          <label className="label" htmlFor="name">Nosaukums *</label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Piem., sporta klubs"
          />
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor="amount">Summa (€) *</label>
        <div className="input-suffix">
          <input
            id="amount"
            className="input"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Piem., 12,99"
          />
          <span className="suffix-text">€</span>
        </div>
      </div>

      <div className="field">
        <span className="label">Regularitāte *</span>
        <div className="chips">
          {cycleChips.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`chip ${cycle === item.value ? 'active' : ''}`}
              onClick={() => setCycle(item.value)}
            >
              {cycle === item.value && <Icon name="check" size={16} />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="date">
          {trial ? 'Izmēģinājums beidzas *' : 'Nākamā maksājuma datums *'}
        </label>
        <div className="input-suffix">
          <input
            id="date"
            ref={dateRef}
            className="input date-input"
            type="date"
            min={todayISO()}
            value={trial ? trialUntil : nextPayment}
            onChange={(event) => (trial ? setTrialUntil : setNextPayment)(event.target.value)}
          />
          <button type="button" className="suffix-link" onClick={openPicker}>Izvēlēties</button>
        </div>
        {trial && <p className="hint">Pirmais maksājums tiks gaidīts šajā datumā.</p>}
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

      {!fromCatalog && (
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
                {category === item && <Icon name="check" size={16} />}
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {apiError && <p className="error">{apiError.message} (kods: {apiError.code})</p>}

      <div className="action-bar">
        <p className="action-hint">Aizpildi obligātos laukus (*), lai turpinātu.</p>
        <button type="submit" className="btn btn-primary btn-block" disabled={!valid || busy}>
          {busy ? 'Saglabā…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
