'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/sakums', label: 'Sākums', icon: '⌂' },
  { href: '/kalendars', label: 'Kalendārs', icon: '▦' },
  { href: '/statistika', label: 'Statistika', icon: '◔' },
  { href: '/iestatijumi', label: 'Iestatījumi', icon: '⚙' },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} className={active ? 'tab active' : 'tab'}>
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
