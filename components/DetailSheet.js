'use client';

import { useState } from 'react';
import { findCatalogItem } from '../lib/catalog.js';
import {
  daysLabel, daysUntil, formatFullDate, formatMoney, monthlyEquivalent, nextPaymentISO,
} from '../lib/dates.js';
import ServiceIcon from './ServiceIcon.js';
import SubscriptionForm from './SubscriptionForm.js';
import ConfirmModal from './ConfirmModal.js';

export default function DetailSheet({ subscription, onSave, onDelete, onClose }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const catalogItem = findCatalogItem(subscription.catalogId);
  const dueISO = nextPaymentISO(subscription);
  const days = daysUntil(dueISO);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="grabber" />
        <div className="sheet-head">
          <h2>{editing ? 'Rediģēt abonementu' : 'Abonementa detaļas'}</h2>
          <button type="button" className="btn-link" onClick={editing ? () => setEditing(false) : onClose}>
            {editing ? 'Atpakaļ' : 'Aizvērt'}
          </button>
        </div>

        {editing ? (
          <SubscriptionForm
            initial={subscription}
            onSave={(updated) => { onSave(updated); setEditing(false); }}
            onCancel={() => setEditing(false)}
            saveLabel="Saglabāt izmaiņas"
          />
        ) : (
          <>
            <div className="detail-head">
              <ServiceIcon color={subscription.color} mark={subscription.mark} size="icon-lg" />
              <div className="detail-name">{subscription.name}</div>
              <div className="detail-amount">
                {formatMoney(subscription.amount)} / {subscription.cycle === 'yearly' ? 'gadā' : 'mēnesī'}
              </div>
            </div>

            <div className="info-list">
              <div className="info-row">
                <span>Nākamais maksājums</span>
                <span>{formatFullDate(dueISO)}</span>
              </div>
              <div className="info-row">
                <span>Atlikušas</span>
                <span>{daysLabel(days)}</span>
              </div>
              <div className="info-row">
                <span>Regularitāte</span>
                <span>{subscription.cycle === 'yearly' ? 'Reizi gadā' : 'Reizi mēnesī'}</span>
              </div>
              <div className="info-row">
                <span>Kategorija</span>
                <span>{subscription.category}</span>
              </div>
              {subscription.planLabel && (
                <div className="info-row">
                  <span>Plāns</span>
                  <span>{subscription.planLabel}</span>
                </div>
              )}
              <div className="info-row">
                <span>Mēneša ekvivalents</span>
                <span>{formatMoney(monthlyEquivalent(subscription))}</span>
              </div>
              <div className="info-row">
                <span>Gadā</span>
                <span>{formatMoney(monthlyEquivalent(subscription) * 12)}</span>
              </div>
            </div>

            {catalogItem && (
              <a
                className="btn btn-ghost btn-block"
                style={{ marginTop: 16, display: 'block', textAlign: 'center', textDecoration: 'none' }}
                href={catalogItem.cancelUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Kā atcelt abonementu ↗
              </a>
            )}

            <div className="row" style={{ marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => setEditing(true)}>Rediģēt</button>
              <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>Dzēst</button>
            </div>
          </>
        )}

        {confirming && (
          <ConfirmModal
            title="Vai tiešām vēlaties dzēst?"
            message={`Abonements "${subscription.name}" tiks neatgriezeniski izdzēsts no saraksta.`}
            confirmLabel="Dzēst"
            onConfirm={() => { setConfirming(false); onDelete(subscription.id); }}
            onCancel={() => setConfirming(false)}
          />
        )}
      </div>
    </div>
  );
}
