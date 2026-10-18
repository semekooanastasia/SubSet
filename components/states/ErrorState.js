// S-04C: kļūdas stāvoklis.
export default function ErrorState({ error, onRetry }) {
  return (
    <div className="state-card" role="alert">
      <div className="state-badge error">⚠</div>
      <h2 className="state-title">Neizdevās ielādēt abonementus</h2>
      <p className="state-text">
        {error?.isNetwork
          ? 'Nav savienojuma ar serveri — pārbaudi, vai testa serveris ir palaists ar npm run mock.'
          : error?.message || 'Nezināma kļūda.'}
      </p>
      <button type="button" className="btn btn-primary btn-block" onClick={onRetry}>Mēģināt vēlreiz</button>
      <p className="state-code">Kļūdas kods: {error?.code || 'UNKNOWN'}</p>
    </div>
  );
}
