'use client';

import { useState } from 'react';
import {
  MONTHS, WEEKDAYS_SHORT, formatMoney, fromISO, nextPaymentISO, toISO,
} from '../lib/dates.js';
import ServiceIcon from './ServiceIcon.js';

export default function CalendarView({ subscriptions, onOpen }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(toISO(today));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  // Maksājumi šajā mēnesī (ieskaitot gada abonementus, kas iekrīt šajā mēnesī).
  const byDay = {};
  subscriptions.forEach((sub) => {
    let due = fromISO(nextPaymentISO(sub));
    let guard = 0;
    while (due < firstDay && guard < 24) {
      due = new Date(due.getFullYear(), due.getMonth() + (sub.cycle === 'yearly' ? 12 : 1), due.getDate());
      guard += 1;
    }
    if (due.getFullYear() === year && due.getMonth() === month) {
      const iso = toISO(due);
      byDay[iso] = byDay[iso] || [];
      byDay[iso].push(sub);
    }
  });

  const selectedItems = byDay[selected] || [];
  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return (
    <div>
      <div className="cal-head">
        <button
          type="button"
          className="cal-nav"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Iepriekšējais mēnesis"
        >‹</button>
        <div className="cal-month">{MONTHS[month]} {year}</div>
        <button
          type="button"
          className="cal-nav"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Nākamais mēnesis"
        >›</button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS_SHORT.map((day) => (
          <div key={day} className="cal-weekday">{day}</div>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} className="cal-day blank" />;
          const iso = toISO(new Date(year, month, day));
          const items = byDay[iso] || [];
          const isToday = iso === toISO(today);
          const isSelected = iso === selected;
          return (
            <button
              key={iso}
              type="button"
              className={`cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelected(iso)}
            >
              <span>{day}</span>
              <span className="cal-dots">
                {items.slice(0, 3).map((sub) => (
                  <span key={sub.id} className="cal-dot" style={{ background: sub.color }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 22 }}>
        <p className="section-title">
          {selected.split('-').reverse().join('.')} — maksājumi
        </p>
        {selectedItems.length === 0 ? (
          <p className="muted tiny">Šajā dienā maksājumu nav.</p>
        ) : (
          <div className="list">
            {selectedItems.map((sub) => (
              <button key={sub.id} type="button" className="card" onClick={() => onOpen(sub)}>
                <ServiceIcon color={sub.color} mark={sub.mark} />
                <div className="card-body">
                  <div className="card-name">{sub.name}</div>
                  <div className="card-meta">{sub.category}</div>
                </div>
                <div className="card-right">
                  <div className="card-amount">{formatMoney(sub.amount)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
