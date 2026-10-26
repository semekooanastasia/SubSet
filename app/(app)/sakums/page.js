'use client';

// S-04: sākuma ekrāns ar četriem stāvokļiem (ielāde, tukšs, kļūda, dati).
import Link from 'next/link';
import { useStore } from '../../../components/providers/StoreProvider.js';
import TopBar from '../../../components/ui/TopBar.js';
import Icon from '../../../components/ui/Icon.js';
import TotalCard from '../../../components/ui/TotalCard.js';
import SubscriptionRow from '../../../components/ui/SubscriptionRow.js';
import LoadingState from '../../../components/states/LoadingState.js';
import EmptyState from '../../../components/states/EmptyState.js';
import ErrorState from '../../../components/states/ErrorState.js';

export default function SakumsPage() {
  const { status, error, sorted, catalog, reload } = useStore();
  const catalogById = Object.fromEntries(catalog.map((item) => [item.id, item]));

  return (
    <>
      <TopBar title="Mani abonementi" action={<Link className="icon-btn" href="/iestatijumi" aria-label="Paziņojumi"><Icon name="bell" /></Link>} />

      <div className="content">
        {status === 'loading' && <LoadingState />}

        {status === 'error' && <ErrorState error={error} onRetry={reload} />}

        {status === 'ready' && (
          <>
            <TotalCard subscriptions={sorted} />

            {sorted.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="list-head">
                  <h2>Visi abonementi ({sorted.length})</h2>
                  <span className="list-sort">Pēc datuma</span>
                </div>
                <div className="card-list">
                  {sorted.map((subscription) => (
                    <SubscriptionRow
                      key={subscription.id}
                      subscription={subscription}
                      catalogItem={catalogById[subscription.catalogId]}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {status === 'ready' && sorted.length > 0 && (
        <Link className="fab" href="/pievienot">+ Pievienot</Link>
      )}
    </>
  );
}
