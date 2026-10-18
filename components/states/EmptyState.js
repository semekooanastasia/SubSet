import Link from 'next/link';

// S-04B: tukšais stāvoklis.
export default function EmptyState() {
  return (
    <div className="state-card">
      <div className="state-icons">
        <span className="icon" style={{ background: '#1DB954' }}>S</span>
        <span className="icon" style={{ background: '#E50914' }}>N</span>
        <span className="icon" style={{ background: '#0A84FF' }}>☁</span>
      </div>
      <h2 className="state-title">Pievieno savu pirmo abonementu</h2>
      <p className="state-text">
        Izvēlies no kataloga vai pievieno manuāli.
        Atgādināsim 2 dienas pirms katra maksājuma.
      </p>
      <Link className="btn btn-primary btn-block" href="/pievienot">Pievienot abonementu</Link>
      <Link className="btn-link" href="/iestatijumi?imports=1">Importēt bankas izrakstu (.csv)</Link>
    </div>
  );
}
