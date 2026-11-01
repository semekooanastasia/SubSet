'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '../../lib/session.js';
import { StoreProvider } from '../../components/providers/StoreProvider.js';
import TabBar from '../../components/ui/TabBar.js';

// Prototipā apakšējā navigācija ir tikai uz šīm četrām sadaļām. Pievienošanas
// plūsmā un abonementa detaļās tās vietā ir kājene ar darbības pogu.
const TAB_ROUTES = ['/sakums', '/kalendars', '/statistika', '/iestatijumi'];

export default function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
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
        {TAB_ROUTES.includes(pathname) && <TabBar />}
      </div>
    </StoreProvider>
  );
}
