import { formatMoney, monthlyTotal, yearlyTotal } from '../../lib/domain/money.js';

// Latviešu locījums: 0 abonementu, 1 abonements, 2 abonementi, 21 abonements.
function subscriptionWord(count) {
  if (count === 0) return 'abonementu';
  if (count % 10 === 1 && count % 100 !== 11) return 'abonements';
  return 'abonementi';
}

export default function TotalCard({ subscriptions }) {
  return (
    <section className="total-card">
      <div className="total-label">Kopā mēnesī</div>
      <div className="total-value">{formatMoney(monthlyTotal(subscriptions))}</div>
      <div className="total-pills">
        <span className="pill">Gadā {formatMoney(yearlyTotal(subscriptions))}</span>
        <span className="pill">{subscriptions.length} {subscriptionWord(subscriptions.length)}</span>
      </div>
    </section>
  );
}
