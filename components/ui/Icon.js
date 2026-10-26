// Saskarnes ikonas no K2 prototipa (`public/icons/`).
// Zīmējums nāk no SVG faila kā maska, bet krāsu dod `currentColor`,
// tāpēc viena un tā pati ikona der gaišajā un tumšajā režīmā.
export default function Icon({ name, size = 24, flip = false, className = '' }) {
  return (
    <span
      className={`ic ${flip ? 'ic-flip' : ''} ${className}`.trim()}
      style={{ '--ic-url': `url(/icons/${name}.svg)`, '--ic-size': `${size}px` }}
      aria-hidden="true"
    />
  );
}
