'use client';

// S-01 / S-02: ieeja ar e-pastu.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api/auth.js';
import { saveSession } from '../../lib/session.js';
import { toApiError } from '../../lib/api/errors.js';
import { formatMoney } from '../../lib/domain/money.js';
import ServiceIcon from '../../components/ui/ServiceIcon.js';

const ORBIT = [
  { id: 'chatgpt', x: 50, y: 6 },
  { id: 'disney', x: 88, y: 34 },
  { id: 'duolingo', x: 76, y: 76 },
  { id: 'icloud', x: 32, y: 88 },
  { id: 'youtube', x: 4, y: 58 },
  { id: 'spotify', x: 10, y: 18 },
];

export default function IeejaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token, user } = await login(email.trim());
      saveSession(token, user);
      router.replace('/sakums');
    } catch (caught) {
      setError(toApiError(caught));
      setBusy(false);
    }
  }

  return (
    <main className="screen auth">
      <div className="auth-hero">
        <div className="brand"><span className="brand-dot" /> subset</div>
        <div className="orbit">
          {ORBIT.map((item) => (
            <span
              key={item.id}
              className="orbit-item"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <ServiceIcon catalogId={item.id} />
            </span>
          ))}
          <div className="orbit-center">
            <div className="orbit-amount">{formatMoney(62.96)}</div>
            <div className="orbit-caption">mēnesī par 6 abonementiem</div>
          </div>
        </div>
      </div>

      <form className="auth-form" onSubmit={submit}>
        <h1>Ienāc vai izveido kontu</h1>
        <p className="auth-lead">Ievadi savu e-pastu. Ja konta vēl nav, mēs to izveidosim.</p>

        <label className="label" htmlFor="email">E-pasts</label>
        <input
          id="email"
          className={`input ${error ? 'invalid' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="vards@epasts.lv"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setError(null); }}
          required
        />

        {error && <p className="error">{error.message} (kods: {error.code})</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Pieslēdzas…' : 'Turpināt'}
        </button>

        <p className="auth-terms">
          Turpinot tu piekrīti <u>Lietošanas noteikumiem</u> un <u>Privātuma paziņojumam</u>.
        </p>
      </form>
    </main>
  );
}
