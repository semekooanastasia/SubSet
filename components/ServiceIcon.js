export default function ServiceIcon({ color, mark, size = '' }) {
  return (
    <div className={`icon ${size}`} style={{ background: color || '#8a8f98' }}>
      {mark || '•'}
    </div>
  );
}
