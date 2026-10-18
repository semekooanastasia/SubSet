import Link from 'next/link';
import ServiceIcon from './ServiceIcon.js';
import {
  daysUntil, formatDate, formatDateWithWeekday, nextPaymentISO, shortDaysBadge,
} from '../../lib/domain/dates.js';
import { chargeAmount, formatMoney, formatSigned, isInTrial } from '../../lib/domain/money.js';

export default function SubscriptionRow({ subscription, catalogItem }) {
  const dueISO = nextPaymentISO(subscription);
  const days = daysUntil(dueISO);
  const trial = isInTrial(subscription);

  return (
    <Link className="row" href={`/abonements/${subscription.id}`}>
      <ServiceIcon color={catalogItem?.color || subscription.color} mark={catalogItem?.mark || subscription.name.charAt(0).toUpperCase()} />
      <div className="row-body">
        <div className="row-name">{subscription.name}</div>
        <div className="row-meta">
          {trial
            ? `Bez maksas līdz ${formatDate(subscription.trialUntil)}, tad ${formatMoney(subscription.amountAfterTrial)}`
            : `${formatDateWithWeekday(dueISO)}, ${subscription.category}`}
        </div>
      </div>
      <div className="row-right">
        <div className="row-amount">{formatSigned(chargeAmount(subscription))}</div>
        <span className={trial ? 'badge trial' : `badge ${days <= 3 ? 'soon' : ''}`}>
          {trial ? 'IZMĒĢINĀJUMS' : shortDaysBadge(days)}
        </span>
      </div>
    </Link>
  );
}
