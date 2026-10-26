'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon.js';

const TABS = [
  { href: '/sakums', label: 'Sākums', icon: 'home' },
  { href: '/kalendars', label: 'Kalendārs', icon: 'calendar' },
  { href: '/statistika', label: 'Statistika', icon: 'pie-chart' },
  { href: '/iestatijumi', label: 'Iestatījumi', icon: 'settings' },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} className={active ? 'tab active' : 'tab'}>
            <span className="tab-icon"><Icon name={tab.icon} /></span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
