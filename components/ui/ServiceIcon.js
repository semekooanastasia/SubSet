import { logoFor } from '../../lib/domain/logos.js';

// Pakalpojuma plāksnīte: kataloga logotips, bet nezināmam pakalpojumam — monogramma.
export default function ServiceIcon({ catalogId, category, name = '', size = '' }) {
  const logo = logoFor(catalogId, category);

  if (!logo) {
    return <span className={`icon icon-mono ${size}`.trim()}>{name.charAt(0).toUpperCase() || '•'}</span>;
  }

  const glyph = logo.tint
    ? <span className="icon-tint" style={{ '--ic-url': `url(${logo.file})`, width: `${Math.round(logo.scale * 100)}%` }} />
    : <img src={logo.file} alt="" style={{ width: `${Math.round(logo.scale * 100)}%` }} />;

  return (
    <span
      className={`icon ${logo.border ? 'icon-bordered' : ''} ${size}`.trim()}
      style={{ background: logo.background }}
    >
      {glyph}
    </span>
  );
}
