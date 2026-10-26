'use client';

// S-10: abonementa detaļas, rediģēšana un dzēšana (S-10D).
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../components/providers/StoreProvider.js';
import TopBar from '../../../../components/ui/TopBar.js';
import ServiceIcon from '../../../../components/ui/ServiceIcon.js';
import Icon from '../../../../components/ui/Icon.js';
import SubscriptionForm from '../../../../components/SubscriptionForm.js';
import ConfirmModal from '../../../../components/ConfirmModal.js';
import { daysLabel, daysUntil, formatFullDate, nextPaymentISO } from '../../../../lib/domain/dates.js';
import { chargeAmount, formatMoney, isInTrial, monthlyEquivalent } from '../../../../lib/domain/money.js';

export default function AbonementaDetalasPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { subscriptions, catalog, status, update, remove } = useStore();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  if (status !== 'ready') return <div className="content"><p className="state-hint">Ielādē…</p></div>;

  const subscription = subscriptions.find((item) => item.id === id);
  if (!subscription) {
    return (
      <>
        <TopBar title="Abonements nav atrasts" back />
        <div className="content"><p className="state-hint">Šis abonements ir dzēsts vai nav pieejams.</p></div>
      </>
    );
  }

  const catalogItem = catalog.find((item) => item.id === subscription.catalogId);
  const dueISO = nextPaymentISO(subscription);
  const trial = isInTrial(subscription);

  if (editing) {
    return (
      <>
        <TopBar title="Rediģēt abonementu" back />
        <div className="content">
          <SubscriptionForm
            catalogItem={catalogItem}
            initial={subscription}
            submitLabel="Saglabāt izmaiņas"
            onSubmit={async (values) => {
              await update(subscription.id, values);
              setEditing(false);
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Abonementa detaļas" back />

      <div className="content">
        <div className="detail-hero">
          <ServiceIcon catalogId={subscription.catalogId} category={subscription.category} name={subscription.name} size="icon-lg" />
          <h2>{subscription.name}</h2>
          <p className="muted">
            {formatMoney(chargeAmount(subscription))} / {subscription.cycle === 'yearly' ? 'gadā' : 'mēnesī'}
          </p>
        </div>

        <div className="info-list">
          <div className="info-row"><span>Nākamais maksājums</span><span>{formatFullDate(dueISO)}</span></div>
          <div className="info-row"><span>Atlikušas</span><span>{daysLabel(daysUntil(dueISO))}</span></div>
          {trial && (
            <div className="info-row">
              <span>Izmēģinājums līdz</span>
              <span>{formatFullDate(subscription.trialUntil)}</span>
            </div>
          )}
          <div className="info-row"><span>Regularitāte</span><span>{subscription.cycle === 'yearly' ? 'Reizi gadā' : 'Reizi mēnesī'}</span></div>
          <div className="info-row"><span>Kategorija</span><span>{subscription.category}</span></div>
          {subscription.planLabel && (
            <div className="info-row"><span>Plāns</span><span>{subscription.planLabel}</span></div>
          )}
          <div className="info-row"><span>Mēneša ekvivalents</span><span>{formatMoney(monthlyEquivalent(subscription))}</span></div>
        </div>

        {catalogItem?.cancelUrl && (
          <a className="btn btn-soft btn-block" href={catalogItem.cancelUrl} target="_blank" rel="noreferrer noopener">
            Kā atcelt abonementu <Icon name="open-in-new" size={18} />
          </a>
        )}

        {error && <p className="error">{error.message} (kods: {error.code})</p>}

        <div className="row-fields">
          <button type="button" className="btn" onClick={() => setEditing(true)}>Rediģēt</button>
          <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>Dzēst</button>
        </div>
      </div>

      {confirming && (
        <ConfirmModal
          title="Vai tiešām vēlaties dzēst?"
          message={`Abonements "${subscription.name}" tiks dzēsts no servera.`}
          confirmLabel="Dzēst"
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            try {
              await remove(subscription.id);
              router.replace('/sakums');
            } catch (caught) {
              setError(caught);
            }
          }}
        />
      )}
    </>
  );
}
