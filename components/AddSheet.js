'use client';

import { useState } from 'react';
import { CATALOG } from '../lib/catalog.js';
import ServiceIcon from './ServiceIcon.js';
import SubscriptionForm from './SubscriptionForm.js';

export default function AddSheet({ onAdd, onClose }) {
  const [step, setStep] = useState('catalog');
  const [initial, setInitial] = useState(null);

  function pickCatalogItem(item) {
    const plan = item.plans[0];
    setInitial({
      catalogId: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      mark: item.mark,
      amount: plan.amount,
      cycle: plan.cycle,
      planLabel: plan.label,
      nextPayment: '',
    });
    setStep('form');
  }

  function pickManual() {
    setInitial({
      catalogId: null,
      name: '',
      category: 'Cits',
      color: '#8a8f98',
      mark: '•',
      amount: null,
      cycle: 'monthly',
      planLabel: '',
      nextPayment: '',
    });
    setStep('form');
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="grabber" />

        {step === 'catalog' ? (
          <>
            <div className="sheet-head">
              <h2>Pievienot abonementu</h2>
              <button type="button" className="btn-link" onClick={onClose}>Aizvērt</button>
            </div>

            <p className="section-title">Populārie pakalpojumi</p>
            <div className="catalog-grid">
              {CATALOG.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="catalog-item"
                  onClick={() => pickCatalogItem(item)}
                >
                  <ServiceIcon color={item.color} mark={item.mark} />
                  {item.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-block"
              style={{ marginTop: 16 }}
              onClick={pickManual}
            >
              Cits / Pievienot manuāli
            </button>
          </>
        ) : (
          <>
            <div className="sheet-head">
              <h2>{initial.catalogId ? initial.name : 'Jauns abonements'}</h2>
              <button type="button" className="btn-link" onClick={() => setStep('catalog')}>Atpakaļ</button>
            </div>

            {initial.catalogId && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <ServiceIcon color={initial.color} mark={initial.mark} size="icon-lg" />
              </div>
            )}

            <SubscriptionForm
              initial={initial}
              onSave={onAdd}
              onCancel={onClose}
              saveLabel="Saglabāt"
            />
          </>
        )}
      </div>
    </div>
  );
}
