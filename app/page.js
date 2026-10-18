'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthScreen from '../components/AuthScreen.js';
import AddSheet from '../components/AddSheet.js';
import DetailSheet from '../components/DetailSheet.js';
import CalendarView from '../components/CalendarView.js';
import StatsView from '../components/StatsView.js';
import SettingsView from '../components/SettingsView.js';
import ServiceIcon from '../components/ServiceIcon.js';
import { findCatalogItem } from '../lib/catalog.js';
import {
  daysLabel, daysUntil, formatDate, formatMoney, monthlyTotal, nextPaymentISO, yearlyTotal,
} from '../lib/dates.js';
import {
  clearSession, loadData, loadSession, loadTheme, loadUsers, saveData, saveSession, saveTheme,
} from '../lib/storage.js';
import { clearScheduled, scheduleNotifications } from '../lib/notifications.js';

export default function Page() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({ subscriptions: [], settings: { reminderDays: 2, notificationsEnabled: false }, notified: {} });
  const [theme, setTheme] = useState('light');

  const [tab, setTab] = useState('home');
  const [homeView, setHomeView] = useState('list');
  const [adding, setAdding] = useState(false);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;

    const session = loadSession();
    setUsers(loadUsers());
    if (session) {
      setEmail(session);
      setData(loadData(session));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (email) saveData(email, data);
  }, [email, data]);

  useEffect(() => {
    if (!email) return undefined;
    scheduleNotifications(data.subscriptions, data.settings, data.notified, (key) => {
      setData((current) => ({ ...current, notified: { ...current.notified, [key]: true } }));
    });
    return clearScheduled;
  }, [email, data.subscriptions, data.settings]);

  const sorted = useMemo(() => {
    return [...data.subscriptions].sort((a, b) => nextPaymentISO(a).localeCompare(nextPaymentISO(b)));
  }, [data.subscriptions]);

  const detail = data.subscriptions.find((sub) => sub.id === detailId) || null;
  const user = users.find((item) => item.email === email) || { name: '', email: email || '' };

  function signIn(nextEmail) {
    saveSession(nextEmail);
    setUsers(loadUsers());
    setEmail(nextEmail);
    setData(loadData(nextEmail));
    setTab('home');
  }

  function signOut() {
    clearSession();
    clearScheduled();
    setEmail(null);
    setTab('home');
  }

  function changeTheme(nextTheme) {
    setTheme(nextTheme);
    saveTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  function addSubscription(sub) {
    const catalogItem = findCatalogItem(sub.catalogId);
    const entry = {
      ...sub,
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      color: catalogItem ? catalogItem.color : sub.color || '#8a8f98',
      mark: catalogItem ? catalogItem.mark : (sub.name || '?').trim().charAt(0).toUpperCase(),
    };
    setData((current) => ({ ...current, subscriptions: [...current.subscriptions, entry] }));
    setAdding(false);
  }

  function updateSubscription(updated) {
    setData((current) => ({
      ...current,
      subscriptions: current.subscriptions.map((sub) => (sub.id === updated.id
        ? { ...updated, mark: updated.catalogId ? updated.mark : (updated.name || '?').trim().charAt(0).toUpperCase() }
        : sub)),
    }));
  }

  function deleteSubscription(id) {
    setData((current) => ({ ...current, subscriptions: current.subscriptions.filter((sub) => sub.id !== id) }));
    setDetailId(null);
  }

  function importSubscriptions(items) {
    const entries = items.map((item, index) => {
      const catalogItem = findCatalogItem(item.catalogId);
      return {
        id: `sub-${Date.now()}-${index}`,
        catalogId: item.catalogId,
        name: item.name,
        amount: item.amount,
        currency: 'EUR',
        cycle: 'monthly',
        category: item.category,
        nextPayment: item.date,
        planLabel: '',
        color: catalogItem ? catalogItem.color : '#8a8f98',
        mark: catalogItem ? catalogItem.mark : item.name.trim().charAt(0).toUpperCase(),
      };
    });
    setData((current) => ({ ...current, subscriptions: [...current.subscriptions, ...entries] }));
  }

  if (!ready) return null;
  if (!email) return <AuthScreen onSignedIn={signIn} />;

  const total = monthlyTotal(data.subscriptions);
  const yearly = yearlyTotal(data.subscriptions);

  return (
    <div className="phone">
      <div className="topbar">
        <div>
          <h1 className="screen-title">
            {tab === 'home' && 'Mani abonementi'}
            {tab === 'stats' && 'Statistika'}
            {tab === 'settings' && 'Iestatījumi'}
          </h1>
          {tab === 'home' && (
            <div className="topbar-sub">{data.subscriptions.length} aktīvi pakalpojumi</div>
          )}
        </div>
        <div className="avatar">{(user.name || 'S').charAt(0).toUpperCase()}</div>
      </div>

      {tab === 'home' && (
        <div className="total-card">
          <div className="total-label">Kopā mēnesī</div>
          <div className="total-value">{formatMoney(total)}</div>
          <div className="total-foot">
            <span>Gadā: {formatMoney(yearly)}</span>
            {sorted.length > 0 && (
              <span>Nākamais: {formatDate(nextPaymentISO(sorted[0]))}</span>
            )}
          </div>
        </div>
      )}

      <div className="content">
        {tab === 'home' && (
          <>
            <div className="segmented">
              <button
                type="button"
                className={homeView === 'list' ? 'active' : ''}
                onClick={() => setHomeView('list')}
              >Saraksts</button>
              <button
                type="button"
                className={homeView === 'calendar' ? 'active' : ''}
                onClick={() => setHomeView('calendar')}
              >Kalendārs</button>
            </div>

            {data.subscriptions.length === 0 ? (
              <div className="empty">
                <div className="empty-emoji">📭</div>
                <h3>Vēl nav neviena abonementa</h3>
                <p>Pievienojiet savu pirmo abonementu, lai redzētu gaidāmos maksājumus un kopējo mēneša summu.</p>
                <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
                  Pievienot abonementu
                </button>
              </div>
            ) : homeView === 'list' ? (
              <div className="list">
                {sorted.map((sub) => {
                  const dueISO = nextPaymentISO(sub);
                  const days = daysUntil(dueISO);
                  return (
                    <button key={sub.id} type="button" className="card" onClick={() => setDetailId(sub.id)}>
                      <ServiceIcon color={sub.color} mark={sub.mark} />
                      <div className="card-body">
                        <div className="card-name">{sub.name}</div>
                        <div className="card-meta">{sub.category} · {formatDate(dueISO)}</div>
                      </div>
                      <div className="card-right">
                        <div className="card-amount">{formatMoney(sub.amount)}</div>
                        <div className={`card-days ${days <= 3 ? 'soon' : 'muted'}`}>{daysLabel(days)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <CalendarView subscriptions={data.subscriptions} onOpen={(sub) => setDetailId(sub.id)} />
            )}
          </>
        )}

        {tab === 'stats' && <StatsView subscriptions={data.subscriptions} />}

        {tab === 'settings' && (
          <SettingsView
            user={user}
            settings={data.settings}
            theme={theme}
            onSettingsChange={(settings) => setData((current) => ({ ...current, settings }))}
            onThemeChange={changeTheme}
            onImport={importSubscriptions}
            onSignOut={signOut}
          />
        )}
      </div>

      {tab === 'home' && data.subscriptions.length > 0 && (
        <button type="button" className="fab" onClick={() => setAdding(true)} aria-label="Pievienot abonementu">+</button>
      )}

      <nav className="tabbar">
        <button type="button" className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>
          <span className="tab-icon">☰</span>
          Sākums
        </button>
        <button type="button" className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>
          <span className="tab-icon">◔</span>
          Statistika
        </button>
        <button type="button" className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>
          <span className="tab-icon">⚙</span>
          Iestatījumi
        </button>
      </nav>

      {adding && <AddSheet onAdd={addSubscription} onClose={() => setAdding(false)} />}

      {detail && (
        <DetailSheet
          subscription={detail}
          onSave={updateSubscription}
          onDelete={deleteSubscription}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
