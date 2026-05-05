import { cn } from '@/lib/cn'

/**
 * Widget "Ventas por rango de edad".
 *
 * Muestra una distribución horizontal de ventas segmentada por
 * rangos de edad de los clientes. Cada rango se renderiza con
 * una barra horizontal proporcional al porcentaje.
 *
 * El rango con mayor porcentaje se destaca en color primario
 * (rojo Drive Arena) automáticamente.
 *
 * @param {Object} props
 * @param {Array<{label: string, value: number, percentage: number}>} props.ranges
 * @param {number} props.total - Total absoluto de ventas (mostrado en header)
 */
function AgeRangeSalesWidget({ ranges, total }) {
  // Identificamos el rango dominante para destacarlo
  const maxPercentage = Math.max(...ranges.map((r) => r.percentage))

  return (
    <article className="bg-surface-1 border border-border-strong rounded-card p-6">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            ▌ Analítica
          </p>
          <h2 className="mt-1 font-display font-bold text-lg tracking-tight text-text">
            Ventas por rango de edad
          </h2>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            Total
          </p>
          <p className="font-display font-bold text-lg tabular-nums text-text">
            {total.toLocaleString('es-ES')}
          </p>
        </div>
      </header>

      {/* Lista de rangos */}
      <ul className="space-y-4">
        {ranges.map((range) => {
          const isDominant = range.percentage === maxPercentage

          return (
            <li key={range.label}>
              {/* Label + porcentaje */}
              <div className="flex items-baseline justify-between mb-2">
                <span
                  className={cn(
                    'font-mono text-xs tracking-wider uppercase',
                    isDominant ? 'text-primary font-bold' : 'text-text-muted'
                  )}
                >
                  {range.label}
                </span>
                <span
                  className={cn(
                    'font-display font-bold text-sm tabular-nums',
                    isDominant ? 'text-primary' : 'text-text'
                  )}
                >
                  {range.percentage}%
                </span>
              </div>

              {/* Barra horizontal */}
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isDominant
                      ? 'bg-primary shadow-[0_0_12px_rgba(224,22,43,0.5)]'
                      : 'bg-text-dim'
                  )}
                  style={{ width: `${range.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={range.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${range.label}: ${range.percentage}%`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export default AgeRangeSalesWidget
