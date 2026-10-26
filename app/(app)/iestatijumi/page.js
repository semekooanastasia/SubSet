'use client';

// S-12: iestatījumi, paziņojumi un datu imports.
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../../components/providers/StoreProvider.js';
import TopBar from '../../../components/ui/TopBar.js';
import Icon from '../../../components/ui/Icon.js';
import ImportSheet from '../../../components/ImportSheet.js';
import ConfirmModal from '../../../components/ConfirmModal.js';
import { loadSettings, saveSettings } from '../../../lib/settings.js';
import { clearSession, getUser } from '../../../lib/session.js';
import { BASE_URL } from '../../../lib/api/client.js';
import { notificationsSupported, permissionGranted, requestPermission } from '../../../lib/notifications.js';

const REMINDERS = [
  { value: 1, label: '1 dienu pirms' },
  { value: 2, label: '2 dienas pirms' },
  { value: 3, label: '3 dienas pirms' },
  { value: 7, label: '1 nedēļu pirms' },
];

export default function IestatijumiPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { catalog, addMany } = useStore();
  const [settings, setSettings] = useState(loadSettings());
  const [importing, setImporting] = useState(params.get('imports') === '1');
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    saveSettings(settings);
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  async function toggleNotifications() {
    if (settings.notificationsEnabled) {
      setSettings({ ...settings, notificationsEnabled: false });
      return;
    }
    if (!notificationsSupported()) {
      setNotice('Šī ierīce neatbalsta lokālos paziņojumus.');
      return;
    }
    const granted = permissionGranted() || await requestPermission();
    if (!granted) {
      setNotice('Paziņojumi ir bloķēti ierīces iestatījumos.');
      return;
    }
    setNotice('');
    setSettings({ ...settings, notificationsEnabled: true });
  }

  const user = getUser();

  return (
    <>
      <TopBar title="Iestatījumi" />

      <div className="content">
        <h2 className="section-title">Profils</h2>
        <div className="info-list">
          <div className="info-row"><span>Vārds</span><span>{user?.name || '—'}</span></div>
          <div className="info-row"><span>E-pasts</span><span>{user?.email || '—'}</span></div>
        </div>

        <h2 className="section-title">Paziņojumi</h2>
        <div className="info-list">
          <div className="info-row">
            <span>Atgādinājumi pirms maksājuma</span>
            <button
              type="button"
              className={`switch ${settings.notificationsEnabled ? 'on' : ''}`}
              onClick={toggleNotifications}
              aria-label="Ieslēgt paziņojumus"
            />
          </div>
          <div className="info-row">
            <span>Brīdināt</span>
            <select
              className="input compact"
              value={settings.reminderDays}
              onChange={(event) => setSettings({ ...settings, reminderDays: Number(event.target.value) })}
            >
              {REMINDERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>
        {notice && <p className="error">{notice}</p>}

        <h2 className="section-title">Izskats</h2>
        <div className="info-list">
          <div className="info-row">
            <span>Tumšais režīms</span>
            <button
              type="button"
              className={`switch ${settings.theme === 'dark' ? 'on' : ''}`}
              onClick={() => setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              aria-label="Tumšais režīms"
            />
          </div>
        </div>

        <h2 className="section-title">Dati</h2>
        <div className="info-list">
          <button type="button" className="info-row as-button" onClick={() => setImporting(true)}>
            <span>Importēt bankas izrakstu (.csv)</span><Icon name="chevron-right" size={20} className="muted" />
          </button>
          <div className="info-row"><span>Serveris</span><span className="muted mono">{BASE_URL}</span></div>
          <button type="button" className="info-row as-button" onClick={() => setSigningOut(true)}>
            <span className="danger">Iziet no profila</span><Icon name="chevron-right" size={20} className="muted" />
          </button>
        </div>
      </div>

      {importing && (
        <ImportSheet
          catalog={catalog}
          onClose={() => setImporting(false)}
          onImport={async (items) => {
            await addMany(items.map((item) => ({
              catalogId: item.catalogId,
              name: item.name,
              amount: item.amount,
              cycle: 'monthly',
              category: item.category,
              nextPayment: item.date,
            })));
            setImporting(false);
            router.push('/sakums');
          }}
        />
      )}

      {signingOut && (
        <ConfirmModal
          title="Iziet no profila?"
          message="Dati paliek serverī, tu vari atkal pieteikties ar to pašu e-pastu."
          confirmLabel="Iziet"
          onCancel={() => setSigningOut(false)}
          onConfirm={() => { clearSession(); router.replace('/ieeja'); }}
        />
      )}
    </>
  );
}
