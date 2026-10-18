'use client';

// S-11: maksājumu kalendārs.
import { useStore } from '../../../components/providers/StoreProvider.js';
import TopBar from '../../../components/ui/TopBar.js';
import CalendarView from '../../../components/CalendarView.js';
import LoadingState from '../../../components/states/LoadingState.js';
import ErrorState from '../../../components/states/ErrorState.js';

export default function KalendarsPage() {
  const { status, error, subscriptions, catalog, reload } = useStore();
  const catalogById = Object.fromEntries(catalog.map((item) => [item.id, item]));

  return (
    <>
      <TopBar title="Kalendārs" />
      <div className="content">
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'ready' && <CalendarView subscriptions={subscriptions} catalogById={catalogById} />}
      </div>
    </>
  );
}
