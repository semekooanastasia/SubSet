'use client';

import { useRouter } from 'next/navigation';

export default function TopBar({ title, back = false, action = null }) {
  const router = useRouter();
  return (
    <header className="topbar">
      {back && (
        <button type="button" className="icon-btn" onClick={() => router.back()} aria-label="Atpakaļ">←</button>
      )}
      <h1 className={back ? 'topbar-title sm' : 'topbar-title'}>{title}</h1>
      <div className="topbar-action">{action}</div>
    </header>
  );
}
