'use client';

import { useState } from 'react';
import ImportSheet from './ImportSheet.js';
import ConfirmModal from './ConfirmModal.js';
import { notificationsSupported, permissionGranted, requestPermission } from '../lib/notifications.js';

const REMINDER_OPTIONS = [
  { value: 1, label: '1 dienu pirms' },
  { value: 2, label: '2 dienas pirms' },
  { value: 3, label: '3 dienas pirms' },
  { value: 7, label: '1 nedēļu pirms' },
];

export default function SettingsView({
  user, settings, theme, onSettingsChange, onThemeChange, onImport, onSignOut,
}) {
  const [importing, setImporting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState('');

  async function toggleNotifications() {
    if (settings.notificationsEnabled) {
      onSettingsChange({ ...settings, notificationsEnabled: false });
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
    onSettingsChange({ ...settings, notificationsEnabled: true });
  }

  return (
    <div>
      <p className="section-title">Profils</p>
      <div className="settings-group">
        <div className="settings-row">
          <span className="label">Vārds</span>
          <span>{user.name}</span>
        </div>
        <div className="settings-row">
          <span className="label">E-pasts</span>
          <span>{user.email}</span>
        </div>
      </div>

      <p className="section-title">Paziņojumi</p>
      <div className="settings-group">
        <div className="settings-row">
          <span className="label">Atgādinājumi pirms maksājuma</span>
          <button
            type="button"
            className={`switch ${settings.notificationsEnabled ? 'on' : ''}`}
            onClick={toggleNotifications}
            aria-label="Ieslēgt paziņojumus"
          />
        </div>
        <div className="settings-row">
          <span className="label">Brīdināt</span>
          <select
            className="select"
            style={{ width: 'auto' }}
            value={settings.reminderDays}
            onChange={(event) => onSettingsChange({ ...settings, reminderDays: Number(event.target.value) })}
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      {notice && <div className="error" style={{ marginTop: -8, marginBottom: 18 }}>{notice}</div>}

      <p className="section-title">Izskats</p>
      <div className="settings-group">
        <div className="settings-row">
          <span className="label">Tumšais režīms</span>
          <button
            type="button"
            className={`switch ${theme === 'dark' ? 'on' : ''}`}
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Tumšais režīms"
          />
        </div>
      </div>

      <p className="section-title">Dati</p>
      <div className="settings-group">
        <button type="button" className="settings-row" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--border)' }} onClick={() => setImporting(true)}>
          <span className="label">Importēt bankas izrakstu (.csv)</span>
          <span className="muted">›</span>
        </button>
        <button type="button" className="settings-row" style={{ width: '100%', background: 'none', border: 'none' }} onClick={() => setSigningOut(true)}>
          <span className="label" style={{ color: 'var(--danger)' }}>Iziet no profila</span>
          <span className="muted">›</span>
        </button>
      </div>

      {importing && (
        <ImportSheet
          onClose={() => setImporting(false)}
          onImport={(items) => { onImport(items); setImporting(false); }}
        />
      )}

      {signingOut && (
        <ConfirmModal
          title="Iziet no profila?"
          message="Jūsu dati paliks saglabāti šajā ierīcē."
          confirmLabel="Iziet"
          onConfirm={onSignOut}
          onCancel={() => setSigningOut(false)}
        />
      )}
    </div>
  );
}
