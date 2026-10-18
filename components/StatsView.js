'use client';

import { CATEGORIES, CATEGORY_COLORS } from '../lib/domain/categories.js';
import { formatMoney, monthlyEquivalent, monthlyTotal } from '../lib/domain/money.js';

const SIZE = 200;
const RADIUS = 78;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatsView({ subscriptions }) {
  const total = monthlyTotal(subscriptions);

  const groups = CATEGORIES
    .map((category) => ({
      category,
      color: CATEGORY_COLORS[category],
      amount: subscriptions
        .filter((sub) => sub.category === category)
        .reduce((sum, sub) => sum + monthlyEquivalent(sub), 0),
    }))
    .filter((group) => group.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (subscriptions.length === 0) {
    return (
      <div className="empty">
        <div className="empty-emoji">📊</div>
        <h3>Statistikas vēl nav</h3>
        <p>Pievienojiet abonementus, lai redzētu izdevumu sadalījumu pa kategorijām.</p>
      </div>
    );
  }

  let offset = 0;

  return (
    <div>
      <div className="donut-wrap">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Izdevumu sadalījums pa kategorijām">
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {groups.map((group) => {
              const share = total > 0 ? group.amount / total : 0;
              const length = share * CIRCUMFERENCE;
              const circle = (
                <circle
                  key={group.category}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={group.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += length;
              return circle;
            })}
          </g>
        </svg>
        <div className="donut-center">
          <div className="tiny muted">Mēnesī</div>
          <div className="donut-total">{formatMoney(total)}</div>
        </div>
      </div>

      <h2 className="section-title">Sadalījums pa kategorijām</h2>
      <div className="legend">
        {groups.map((group) => (
          <div key={group.category} className="legend-row">
            <span className="legend-dot" style={{ background: group.color }} />
            <span className="legend-name">{group.category}</span>
            <span className="legend-value">{formatMoney(group.amount)}</span>
            <span className="legend-share">
              {total > 0 ? Math.round((group.amount / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 26 }}>Kopā</h2>
      <div className="info-list">
        <div className="info-row">
          <span>Aktīvie abonementi</span>
          <span>{subscriptions.length}</span>
        </div>
        <div className="info-row">
          <span>Kopā mēnesī</span>
          <span>{formatMoney(total)}</span>
        </div>
        <div className="info-row">
          <span>Kopā gadā</span>
          <span>{formatMoney(total * 12)}</span>
        </div>
      </div>
    </div>
  );
}
