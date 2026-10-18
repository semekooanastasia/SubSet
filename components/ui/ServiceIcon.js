export default function ServiceIcon({ color = '#8A8F98', mark = '•', size = '' }) {
  return <div className={`icon ${size}`} style={{ background: color }}>{mark}</div>;
}
