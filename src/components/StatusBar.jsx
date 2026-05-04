import { cn } from '@/lib/cn'

/**
 * Barra superior estilo "system status".
 * Replica el patrón visual de las cabeceras del Cover, Home y Login.
 *
 * @param {Object} props
 * @param {string} props.label - Texto principal a la izquierda (ej. "SISTEMA OPERATIVO · NODO BCN-01")
 * @param {'success'|'warning'|'danger'|'muted'} [props.status='success'] - Color del dot
 * @param {boolean} [props.pulse=false] - Anima el dot con efecto pulse
 * @param {React.ReactNode} [props.right] - Contenido alineado a la derecha (versión, fecha, etc.)
 * @param {boolean} [props.bordered=true] - Muestra borde inferior sutil
 * @param {string} [props.className]
 */
function StatusBar({
  label,
  status = 'success',
  pulse = false,
  right,
  bordered = true,
  className,
}) {
  const dotColorClasses = {
    success: 'bg-success shadow-[0_0_8px_var(--color-success)]',
    warning: 'bg-warning shadow-[0_0_8px_var(--color-warning)]',
    danger: 'bg-danger shadow-[0_0_8px_var(--color-danger)]',
    muted: 'bg-text-muted',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-between',
        'px-6 py-3',
        'font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted',
        bordered && 'border-b border-border',
        className
      )}
    >
      {/* Izquierda — dot + label */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'w-2 h-2 rounded-full',
            dotColorClasses[status],
            pulse && 'animate-pulse'
          )}
        />
        <span>{label}</span>
      </div>

      {/* Derecha — contenido opcional */}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}

export default StatusBar