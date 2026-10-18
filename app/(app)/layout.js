'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../lib/session.js';
import { StoreProvider } from '../../components/providers/StoreProvider.js';
import TabBar from '../../components/ui/TabBar.js';

export default function AppLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/ieeja');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <StoreProvider>
      <div className="screen">
        {children}
        <TabBar />
      </div>
    </StoreProvider>
  );
}
