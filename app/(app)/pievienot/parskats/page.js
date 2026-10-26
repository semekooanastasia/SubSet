'use client';

// S-07: pārskats pirms saglabāšanas.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../components/providers/StoreProvider.js';
import TopBar from '../../../../components/ui/TopBar.js';
import ServiceIcon from '../../../../components/ui/ServiceIcon.js';
import Icon from '../../../../components/ui/Icon.js';
import { DEFAULT_SETTINGS, loadSettings } from '../../../../lib/settings.js';
import { formatDate, formatDateWithWeekdayYear, formatReminder } from '../../../../lib/domain/dates.js';
import {
  chargeAmount, formatMoney, formatSigned, monthlyTotal, yearlyEquivalent,
} from '../../../../lib/domain/money.js';

// "1 dienu", "2 dienas", "1 nedēļu" — tāpat kā iestatījumos.
function beforeLabel(days) {
  if (days === 7) return '1 nedēļu';
  if (days === 1) return '1 dienu';
  return `${days} dienas`;
}

export default function ParskatsPage() {
  const router = useRouter();
  const { draft, setDraft, add, subscriptions } = useStore();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => setSettings(loadSettings()), []);

  // Bez melnraksta ekrānam nav satura. Pēc saglabāšanas melnraksts tiek notīrīts,
  // tāpēc šeit nedrīkst iejaukties pārejai uz sākuma ekrānu.
  useEffect(() => {
    if (!draft && !saved) router.replace('/pievienot');
  }, [draft, saved, router]);

  if (!draft) return <div className="content"><p className="state-hint">Ielādē…</p></div>;

  const inTrial = Boolean(draft.trialUntil);

  // Pārskats rāda, cik maksās, kad norakstīšana sāksies — arī izmēģinājuma gadījumā.
  const charged = {
    ...draft,
    trialUntil: null,
    amount: inTrial ? draft.amountAfterTrial : draft.amount,
  };
  const cycleLabel = draft.cycle === 'yearly' ? '/gadā' : '/mēn.';

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setApiError(null);
    try {
      await add(draft);
      setSaved(true);
      setDraft(null);
      router.replace('/sakums');
    } catch (caught) {
      setApiError(caught);
      setBusy(false);
    }
  }

  return (
    <>
      <TopBar title="Pārbaudi pirms saglabāšanas" back />

      <div className="review-content">
        <section className="review-card">
          <div className="review-head">
            <ServiceIcon catalogId={draft.catalogId} category={draft.category} name={draft.name} />
            <div>
              <div className="review-service">{[draft.name, draft.planLabel].filter(Boolean).join(' ')}</div>
              <div className="review-amount">{formatSigned(chargeAmount(charged))} {cycleLabel}</div>
            </div>
          </div>

          <div className="info-row">
            <span>Pakalpojums</span>
            <span>{draft.planLabel ? `${draft.name}, ${draft.planLabel}` : draft.name}</span>
          </div>
          {inTrial && (
            <div className="info-row">
              <span>Bez maksas līdz</span>
              <span>{formatDate(draft.trialUntil)}</span>
            </div>
          )}
          <div className="info-row">
            <span>{inTrial ? 'Pirmais maksājums' : 'Nākamais maksājums'}</span>
            <span>{formatDateWithWeekdayYear(draft.nextPayment)}</span>
          </div>
          <div className="info-row">
            <span>Kategorija</span>
            <span>{draft.category}</span>
          </div>
          <div className="info-row">
            <span>Gadā kopā</span>
            <span>{formatMoney(yearlyEquivalent(charged))}</span>
          </div>
        </section>

        <div className="notice">
          <Icon name="info" size={20} />
          <div>
            <p className="notice-title">Atgādinājums {formatReminder(draft.nextPayment, settings.reminderDays)}</p>
            <p className="notice-text">
              {beforeLabel(settings.reminderDays)} pirms norakstīšanas. Laiku var mainīt iestatījumos.
            </p>
          </div>
        </div>

        <p className="impact">
          <span>Kopā mēnesī: {formatMoney(monthlyTotal(subscriptions))} →</span>
          <strong>{formatMoney(monthlyTotal([...subscriptions, draft]))}</strong>
        </p>

        {apiError && <p className="error">{apiError.message} (kods: {apiError.code})</p>}
      </div>

      <div className="action-bar">
        <button type="button" className="btn btn-primary btn-block" onClick={confirm} disabled={busy}>
          {busy ? 'Saglabā…' : 'Apstiprināt un saglabāt'}
        </button>
        <button type="button" className="btn-link" onClick={() => router.back()}>Labot</button>
      </div>
    </>
  );
}
