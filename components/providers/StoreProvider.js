'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createSubscription, deleteSubscription, fetchSubscriptions, updateSubscription,
} from '../../lib/api/subscriptions.js';
import { fetchCatalog } from '../../lib/api/catalog.js';
import { toApiError } from '../../lib/api/errors.js';
import { nextPaymentISO } from '../../lib/domain/dates.js';

const StoreContext = createContext(null);

const DEFAULT_SETTINGS = { reminderDays: 2, notificationsEnabled: false };

export function StoreProvider({ children }) {
  // status: loading | error | ready  (tukšais stāvoklis = ready + items.length === 0)
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  // Melnraksts no formas (S-06) uz pārskatu (S-07) un atpakaļ.
  const [draft, setDraft] = useState(null);

  const load = useCallback(async (signal) => {
    setStatus('loading');
    setError(null);
    try {
      const [items, catalogItems] = await Promise.all([
        fetchSubscriptions(signal),
        fetchCatalog(signal),
      ]);
      setSubscriptions(items);
      setCatalog(catalogItems);
      setStatus('ready');
    } catch (caught) {
      if (caught?.name === 'AbortError') return;
      setError(toApiError(caught));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const add = useCallback(async (subscription) => {
    const created = await createSubscription(subscription);
    setSubscriptions((current) => [...current, created]);
    return created;
  }, []);

  const addMany = useCallback(async (items) => {
    const created = [];
    for (const item of items) {
      created.push(await createSubscription(item));
    }
    setSubscriptions((current) => [...current, ...created]);
    return created;
  }, []);

  const update = useCallback(async (id, changes) => {
    const updated = await updateSubscription(id, changes);
    setSubscriptions((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteSubscription(id);
    setSubscriptions((current) => current.filter((item) => item.id !== id));
  }, []);

  const sorted = useMemo(
    () => [...subscriptions].sort((a, b) => nextPaymentISO(a).localeCompare(nextPaymentISO(b))),
    [subscriptions],
  );

  const value = useMemo(() => ({
    status,
    error,
    subscriptions,
    sorted,
    catalog,
    settings,
    setSettings,
    draft,
    setDraft,
    reload: () => load(),
    add,
    addMany,
    update,
    remove,
  }), [status, error, subscriptions, sorted, catalog, settings, draft, load, add, addMany, update, remove]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore jālieto StoreProvider iekšienē');
  return value;
}
