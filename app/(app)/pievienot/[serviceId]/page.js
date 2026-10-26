'use client';

// S-06: abonementa dati izvēlētajam katalogā esošajam pakalpojumam.
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../components/providers/StoreProvider.js';
import TopBar from '../../../../components/ui/TopBar.js';
import ServiceIcon from '../../../../components/ui/ServiceIcon.js';
import SubscriptionForm from '../../../../components/SubscriptionForm.js';

export default function AbonementaDatiPage({ params }) {
  const { serviceId } = use(params);
  const router = useRouter();
  const { catalog, setDraft, status } = useStore();
  const item = catalog.find((entry) => entry.id === serviceId);

  if (status !== 'ready') return <div className="content"><p className="state-hint">Ielādē…</p></div>;

  if (!item) {
    return (
      <>
        <TopBar title="Pakalpojums nav atrasts" back />
        <div className="content"><p className="state-hint">Šāds pakalpojums katalogā nav atrodams.</p></div>
      </>
    );
  }

  const plan = item.plans[0];

  return (
    <>
      <TopBar title={item.name} back />
      <div className="content">
        <div className="form-hero">
          <ServiceIcon catalogId={item.id} category={item.category} name={item.name} size="icon-lg" />
          <span className="muted">{item.category}</span>
        </div>

        <SubscriptionForm
          catalogItem={item}
          initial={{
            name: item.name,
            category: item.category,
            amount: plan.amount,
            cycle: plan.cycle,
            planLabel: plan.label,
            nextPayment: '',
          }}
          submitLabel="Turpināt"
          onSubmit={(values) => {
            setDraft(values);
            router.push('/pievienot/parskats');
          }}
        />
      </div>
    </>
  );
}
