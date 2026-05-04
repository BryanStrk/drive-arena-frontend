import { cn } from '@/lib/cn'

/**
 * Barra horizontal con métricas clave del resort.
 * Renderiza una colección de estadísticas separadas por divisores verticales.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.stats
 * @param {string} [props.className]
 */
function StatsBar({ stats, className }) {
  return (
    <section
      aria-label="Estadísticas del resort"
      className={cn(
        'border-y border-border',
        'bg-bg',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={cn(
                'flex items-center justify-center gap-3',
                'py-5 px-4',
                // Divisor vertical entre items (excepto el último de cada fila)
                idx < stats.length - 1 && 'md:border-r md:border-border',
                // En mobile, también separamos verticalmente filas
                idx < 2 && 'border-b border-border md:border-b-0'
              )}
            >
              <span className="font-display font-extrabold text-xl text-primary">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar