// S-04A: ielādes stāvoklis.
export default function LoadingState() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="skeleton-card">
        <span className="sk sk-sm" />
        <span className="sk sk-lg" />
        <span className="sk sk-md" />
      </div>
      <div className="list-head">
        <span className="sk sk-title" />
      </div>
      <div className="card-list">
        {[0, 1, 2, 3, 4].map((index) => (
          <div className="row" key={index}>
            <span className="sk sk-icon" />
            <div className="row-body">
              <span className="sk sk-line" />
              <span className="sk sk-line short" />
            </div>
            <span className="sk sk-amount" />
          </div>
        ))}
      </div>
      <p className="state-hint">Ielādējam tavus abonementus…</p>
    </div>
  );
}
