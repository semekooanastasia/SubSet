'use client';

// S-05: pakalpojumu katalogs.
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../../components/providers/StoreProvider.js';
import TopBar from '../../../components/ui/TopBar.js';
import ServiceIcon from '../../../components/ui/ServiceIcon.js';
import LoadingState from '../../../components/states/LoadingState.js';
import ErrorState from '../../../components/states/ErrorState.js';
import { formatMoney } from '../../../lib/domain/money.js';

export default function KatalogsPage() {
  const { catalog, status, error, reload } = useStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Visi');

  const tabs = ['Visi', ...new Set(catalog.map((item) => item.category))];
  const visible = catalog.filter((item) => {
    const matchesTab = tab === 'Visi' || item.category === tab;
    const matchesQuery = item.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <>
      <TopBar title="Pievienot abonementu" back />

      <div className="content">
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}

        {status === 'ready' && (
          <>
            <input
              className="input search"
              placeholder="Meklē, piem., Netflix"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="tabs">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`tab-link ${tab === item ? 'active' : ''}`}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="section-title">Populārie pakalpojumi</h2>

            {visible.length === 0 ? (
              <p className="state-hint">Nekas netika atrasts.</p>
            ) : (
              <div className="catalog-grid">
                {visible.map((item) => {
                  const cheapest = Math.min(...item.plans.map((plan) => plan.amount));
                  return (
                    <Link key={item.id} className="catalog-item" href={`/pievienot/${item.id}`}>
                      <ServiceIcon color={item.color} mark={item.mark} />
                      <span className="catalog-name">{item.name}</span>
                      <span className="catalog-price">
                        {item.plans.length > 1 ? 'no ' : ''}{formatMoney(cheapest)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            <p className="state-hint">Nav sarakstā?</p>
            <Link className="btn btn-soft btn-block" href="/pievienot/manuali">Pievienot manuāli</Link>
          </>
        )}
      </div>
    </>
  );
}
