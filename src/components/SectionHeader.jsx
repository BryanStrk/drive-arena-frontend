import { cn } from '@/lib/cn'

/**
 * Header de sección con la línea-roja + eyebrow + heading + subtitle + action.
 * Replica el patrón visual del Home público y dashboards.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow] - Sub-label superior tipo "SECCIÓN 02 · LIVE"
 * @param {string} props.title - Heading principal en mayúsculas
 * @param {string} [props.subtitle] - Línea descriptiva debajo del heading
 * @param {React.ReactNode} [props.action] - Elemento alineado a la derecha (típicamente <Button variant="ghost">)
 * @param {'md'|'lg'} [props.size='lg']
 * @param {string} [props.className]
 */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  size = 'lg',
  className,
}) {
  const titleSizes = {
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  return (
    <header className={cn('w-full', className)}>
      {/* Top row: eyebrow (con línea decorativa) + action */}
      <div className="flex items-center justify-between mb-3">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-[2px] w-12 bg-primary"
            />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
              {eyebrow}
            </span>
          </div>
        )}

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Heading principal en Saira */}
      <h2
        className={cn(
          'font-display font-extrabold uppercase tracking-tight leading-none text-text',
          titleSizes[size]
        )}
      >
        {title}
      </h2>

      {/* Subtitle opcional */}
      {subtitle && (
        <p className="mt-2 font-mono text-xs tracking-wider uppercase text-text-muted">
          {subtitle}
        </p>
      )}
    </header>
  )
}

export default SectionHeader
