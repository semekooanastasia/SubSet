'use client';

import { useState } from 'react';
import { parseStatement } from '../lib/csv.js';
import { formatDate } from '../lib/domain/dates.js';
import { formatMoney } from '../lib/domain/money.js';
import ServiceIcon from './ui/ServiceIcon.js';

export default function ImportSheet({ catalog = [], onImport, onClose }) {
  const findCatalogItem = (id) => catalog.find((item) => item.id === id) || null;
  const [candidates, setCandidates] = useState(null);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    const text = await file.text();
    const found = parseStatement(text, catalog);
    if (found.length === 0) {
      setCandidates([]);
      setError('Failā netika atrasti regulārie maksājumi.');
      return;
    }
    setCandidates(found);
    setSelected(Object.fromEntries(found.map((item) => [item.key, true])));
  }

  function toggle(key) {
    setSelected((current) => ({ ...current, [key]: !current[key] }));
  }

  function confirm() {
    const chosen = (candidates || []).filter((item) => selected[item.key]);
    onImport(chosen);
  }

  const chosenCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Importēt no bankas izraksta</h2>
          <button type="button" className="btn-link" onClick={onClose}>Aizvērt</button>
        </div>

        {candidates === null ? (
          <>
            <label className="file-drop" style={{ display: 'block' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
              Izvēlieties bankas pēdējā mēneša pārskata .csv failu
              <input type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <p className="tiny muted" style={{ marginTop: 12 }}>
              Sistēma pārbaudīs transakcijas un piedāvās apstiprināt atpazītos regulāros maksājumus.
            </p>
          </>
        ) : (
          <>
            {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
            {candidates.length > 0 && (
              <>
                <p className="section-title">Atrastie pakalpojumi</p>
                <div className="list">
                  {candidates.map((item) => {
                    const catalogItem = findCatalogItem(item.catalogId);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className="card"
                        onClick={() => toggle(item.key)}
                      >
                        <span className={`check ${selected[item.key] ? 'on' : ''}`}>
                          {selected[item.key] ? '✓' : ''}
                        </span>
                        <ServiceIcon
                          color={catalogItem ? catalogItem.color : '#8a8f98'}
                          mark={catalogItem ? catalogItem.mark : '•'}
                          size="icon-sm"
                        />
                        <div className="card-body">
                          <div className="card-name">{item.name}</div>
                          <div className="card-meta">
                            {item.category} · {formatDate(item.date)}
                          </div>
                        </div>
                        <div className="card-right">
                          <div className="card-amount">{formatMoney(item.amount)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="row" style={{ marginTop: 18 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Atcelt</button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={chosenCount === 0}
                onClick={confirm}
              >
                Importēt ({chosenCount})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
