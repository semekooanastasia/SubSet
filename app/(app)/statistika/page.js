'use client';

// S-14: izdevumu sadalījums pa kategorijām.
import { useStore } from '../../../components/providers/StoreProvider.js';
import TopBar from '../../../components/ui/TopBar.js';
import StatsView from '../../../components/StatsView.js';
import LoadingState from '../../../components/states/LoadingState.js';
import ErrorState from '../../../components/states/ErrorState.js';

export default function StatistikaPage() {
  const { status, error, subscriptions, reload } = useStore();

  return (
    <>
      <TopBar title="Statistika" />
      <div className="content">
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState error={error} onRetry={reload} />}
        {status === 'ready' && <StatsView subscriptions={subscriptions} />}
      </div>
    </>
  );
}
