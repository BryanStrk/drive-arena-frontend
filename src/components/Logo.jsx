/**
 * Logo de Drive Arena
 *
 * Variantes:
 *  - "full"  → wordmark "DRIVE | ARENA" con barra vertical roja (default)
 *  - "mark"  → marca compacta DA con racing stripe
 *
 * El color blanco usa currentColor (hereda del padre con text-text,
 * text-white, etc.). El rojo está hardcodeado a #DC2626.
 * Si tu paleta usa otro rojo, edita las dos líneas con #DC2626.
 *
 * El tamaño se controla con className (ej: "h-7 w-auto").
 */
function Logo({ variant = 'full', className = '', ariaLabel }) {
  const ariaProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': true }

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...ariaProps}
      >
        <rect x="2" y="2" width="60" height="60" rx="8" fill="#0A0A0A" />
        <rect x="2" y="2" width="60" height="3" fill="#DC2626" />
        <text
          x="32"
          y="46"
          textAnchor="middle"
          fontFamily="'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
          fontSize="34"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="1"
        >
          DA
        </text>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 260 56"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...ariaProps}
    >
      <text
        x="0"
        y="42"
        fontFamily="'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
        fontSize="44"
        fontWeight="400"
        fill="currentColor"
        letterSpacing="1"
      >
        DRIVE
      </text>
      <rect x="118" y="14" width="3" height="32" fill="#DC2626" />
      <text
        x="128"
        y="42"
        fontFamily="'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
        fontSize="44"
        fontWeight="400"
        fill="currentColor"
        letterSpacing="1"
      >
        ARENA
      </text>
    </svg>
  )
}

export default Logo
