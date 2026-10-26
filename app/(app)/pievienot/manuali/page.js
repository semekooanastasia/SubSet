'use client';

// S-05M: manuāla pievienošana.
import { useRouter } from 'next/navigation';
import { useStore } from '../../../../components/providers/StoreProvider.js';
import TopBar from '../../../../components/ui/TopBar.js';
import SubscriptionForm from '../../../../components/SubscriptionForm.js';

export default function ManualiPage() {
  const router = useRouter();
  const { setDraft } = useStore();

  return (
    <>
      <TopBar title="Pievienot manuāli" back />
      <div className="content">
        <SubscriptionForm
          initial={{ name: '', category: 'Cits', cycle: 'monthly', nextPayment: '' }}
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
