import { cn } from '@/lib/cn'
import Badge from '@/components/Badge'

/**
 * Widget "Top 3 Lodges del Mes".
 *
 * Muestra el podio de los 3 lodges con más ingresos del mes actual.
 * La posición #1 se destaca con border + glow rojo Drive Arena.
 *
 * Si hay menos de 3 lodges activos, las posiciones vacías se rellenan
 * con un placeholder "Sin tercer lodge" en gris (basado en Mockup 3).
 *
 * @param {Object} props
 * @param {Array<{position: number, name: string, zone: string, category: string, revenue: number}>} props.lodges
 *   Array ordenado por posición (1, 2, 3). Puede tener menos de 3 elementos.
 */
function TopLodgesWidget({ lodges }) {
  // Garantizamos siempre 3 slots (rellenamos con null los que falten)
  const slots = [1, 2, 3].map(
    (position) => lodges.find((l) => l.position === position) || null
  )

  return (
    <article className="bg-surface-1 border border-border-strong rounded-card p-6">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            ▌ Ranking
          </p>
          <h2 className="mt-1 font-display font-bold text-lg tracking-tight text-text">
            Top 3 Lodges del Mes
          </h2>
        </div>

        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
          Por Ingresos
        </p>
      </header>

      {/* Podio: 3 slots */}
      <ul className="space-y-3">
        {slots.map((lodge, idx) => (
          <PodiumSlot key={idx} position={idx + 1} lodge={lodge} />
        ))}
      </ul>
    </article>
  )
}

/**
 * Sub-componente: una fila del podio.
 * Maneja estado activo (hay lodge) y vacío (placeholder).
 */
function PodiumSlot({ position, lodge }) {
  const isFirst = position === 1
  const isEmpty = lodge === null

  if (isEmpty) {
    return (
      <li
        className="flex items-center gap-4 px-4 py-3 rounded-inner border border-dashed border-border-strong opacity-60"
        aria-label={`Posición ${position}, sin lodge asignado`}
      >
        <span className="font-display text-2xl text-text-dim tabular-nums">
          {position}
        </span>
        <p className="font-mono text-xs tracking-wider uppercase text-text-dim italic">
          Sin {position === 2 ? 'segundo' : 'tercer'} lodge
        </p>
      </li>
    )
  }

  return (
    <li
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-inner transition-colors',
        isFirst
          ? 'bg-primary/10 border border-primary/40 shadow-[0_0_20px_rgba(224,22,43,0.15)]'
          : 'bg-surface-2 border border-border-strong'
      )}
    >
      {/* Posición numérica */}
      <span
        className={cn(
          'font-display font-bold text-2xl tabular-nums w-7 text-center',
          isFirst ? 'text-primary' : 'text-text-muted'
        )}
      >
        {position}
      </span>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-display font-bold text-base tracking-tight truncate',
            isFirst ? 'text-text' : 'text-text'
          )}
        >
          {lodge.name}
        </p>
        <p className="mt-0.5 font-mono text-[10px] tracking-wider uppercase text-text-muted truncate">
          {lodge.zone}
        </p>
      </div>

      {/* Categoría + Revenue */}
      <div className="flex flex-col items-end gap-1.5">
        <p
          className={cn(
            'font-display font-bold text-sm tabular-nums',
            isFirst ? 'text-primary' : 'text-text'
          )}
        >
          € {lodge.revenue.toLocaleString('es-ES')}
        </p>
        <Badge variant={isFirst ? 'primary' : 'default'} size="xs">
          {lodge.category}
        </Badge>
      </div>
    </li>
  )
}

export default TopLodgesWidget
