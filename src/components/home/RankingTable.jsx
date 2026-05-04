import Card from '@/components/Card'
import Badge from '@/components/Badge'
import { cn } from '@/lib/cn'

/**
 * Tabla de ranking top-5 por atracción.
 * Replica el patrón de la sección "RANKING DEL MES" del Home.
 *
 * @param {Object} props
 * @param {string} props.attractionName - Nombre de la atracción (ej. "Phantom GT")
 * @param {Array<{position: number, name: string, time: string, date?: string}>} props.entries - Top 5 pilotos
 * @param {boolean} [props.live=false] - Muestra el indicador LIVE
 */
function RankingTable({ attractionName, entries, live = false }) {
  return (
    <Card variant="default" className="h-full">
      {/* Header de tabla: nombre atracción + LIVE */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-xl tracking-tight uppercase">
          {attractionName}
        </h3>
        {live && (
          <Badge variant="success" dot pulse size="xs">
            Live
          </Badge>
        )}
      </div>

      {/* Lista de entries */}
      <ol className="space-y-1" role="list">
        {entries.map((entry, idx) => {
          const isFirst = idx === 0

          return (
            <li
              key={entry.position}
              className={cn(
                'flex items-center justify-between',
                'px-3 py-2.5 rounded-inner',
                'transition-colors',
                // Primera posición: highlight en rojo
                isFirst && 'bg-primary/10 border-l-2 border-primary',
                // Resto: hover sutil
                !isFirst && 'hover:bg-surface-2'
              )}
            >
              {/* Izquierda: posición + nombre + fecha */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    'font-mono font-bold text-sm tabular-nums shrink-0',
                    isFirst ? 'text-primary' : 'text-text-muted'
                  )}
                >
                  #{entry.position}
                </span>
                <div className="min-w-0">
                  <div
                    className={cn(
                      'font-mono font-medium text-sm uppercase tracking-wide truncate',
                      isFirst ? 'text-text' : 'text-text-muted'
                    )}
                  >
                    {entry.name}
                  </div>
                  {isFirst && entry.date && (
                    <div className="font-mono text-[10px] tracking-widest text-text-dim mt-0.5">
                      {entry.date}
                    </div>
                  )}
                </div>
              </div>

              {/* Derecha: tiempo */}
              <span
                className={cn(
                  'font-mono font-bold text-sm tabular-nums shrink-0 ml-3',
                  isFirst ? 'text-primary' : 'text-text-muted'
                )}
              >
                {entry.time}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export default RankingTable