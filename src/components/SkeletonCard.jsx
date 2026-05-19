import { cn } from '@/lib/cn'

/**
 * Skeleton de una card de listado (mobile). Imita la forma "título + sub-línea"
 * de las cards reales en Clientes / Ventas / Usuarios.
 *
 * Uso individual:
 *   <SkeletonCard />
 *
 * Uso como lista completa (incluye divide-y y N skeletons):
 *   <SkeletonList count={6} />
 */
export function SkeletonCard({ className }) {
  return (
    <div className={cn('p-4', className)}>
      <div className="h-4 w-2/3 rounded bg-surface-2 animate-pulse" />
      <div className="mt-2 h-3 w-1/3 rounded bg-surface-2 animate-pulse" />
    </div>
  )
}

export function SkeletonList({ count = 6, className }) {
  return (
    <div className={cn('divide-y divide-border-strong/60', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default SkeletonCard
