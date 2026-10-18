'use client';

import { useState } from 'react';
import { loadUsers, saveUsers } from '../lib/storage.js';

export default function AuthScreen({ onSignedIn }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  function submit(event) {
    event.preventDefault();
    const users = loadUsers();
    const normalized = email.trim().toLowerCase();

    if (!normalized || !password) {
      setError('Lūdzu, aizpildiet visus laukus.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError('Lūdzu, norādiet savu vārdu.');
        return;
      }
      if (users.some((user) => user.email === normalized)) {
        setError('Lietotājs ar šādu e-pastu jau eksistē.');
        return;
      }
      if (password.length < 6) {
        setError('Parolei jābūt vismaz 6 simbolus garai.');
        return;
      }
      saveUsers([...users, { email: normalized, name: name.trim(), password }]);
      onSignedIn(normalized);
      return;
    }

    const user = users.find((item) => item.email === normalized);
    if (!user || user.password !== password) {
      setError('Nepareizs e-pasts vai parole.');
      return;
    }
    onSignedIn(normalized);
  }

  return (
    <div className="phone">
      <div className="auth">
        <div className="brand">
          <div className="brand-logo">S</div>
          <h1>SubSet</h1>
          <p>Visi tavi abonementi vienuviet</p>
        </div>

        <form onSubmit={submit}>
          {isRegister && (
            <div className="field">
              <label className="label" htmlFor="name">Vārds</label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(event) => { setName(event.target.value); setError(''); }}
                placeholder="Anastasija"
              />
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="email">E-pasts</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError(''); }}
              placeholder="vards@epasts.lv"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Parole</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(''); }}
              placeholder="••••••"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
            {isRegister ? 'Izveidot profilu' : 'Pieteikties'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Jau ir profils? ' : 'Nav profila? '}
          <button
            type="button"
            className="btn-link"
            onClick={() => { setMode(isRegister ? 'login' : 'register'); setError(''); }}
          >
            {isRegister ? 'Pieteikties' : 'Reģistrēties'}
          </button>
        </div>
      </div>
    </div>
  );
}
