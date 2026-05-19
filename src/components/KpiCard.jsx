import { cn } from '@/lib/cn'

/**
 * Tarjeta de KPI para el Dashboard.
 *
 * Muestra una métrica destacada con label, valor grande, y un delta opcional
 * que indica variación vs período anterior.
 *
 * @param {Object} props
 * @param {string} props.label - Texto descriptivo en mono uppercase
 * @param {string|number} props.value - Valor principal (formateado)
 * @param {string} [props.suffix] - Unidad o sufijo opcional (ej. "h", "€", "%")
 * @param {string} [props.delta] - Texto del delta (ej. "+12.5% vs ayer")
 * @param {'positive'|'negative'|'neutral'} [props.deltaType='neutral']
 * @param {string} [props.icon] - Icono emoji o símbolo opcional
 */
function KpiCard({
  label,
  value,
  suffix,
  delta,
  deltaType = 'neutral',
  icon,
}) {
  return (
    <article className="bg-surface-1 border border-border-strong rounded-card p-5 transition-colors hover:border-border-strong">
      {/* Header: label + icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
          {label}
        </p>
        {icon && (
          <span className="text-text-dim text-base" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Valor principal — glow sutil de marca */}
      <p className="mt-3 font-display font-bold text-3xl tracking-tight text-primary tabular-nums drop-shadow-[0_0_8px_rgba(255,45,45,0.3)]">
        {value}
        {suffix && (
          <span className="ml-1 text-xl text-text-muted font-normal">
            {suffix}
          </span>
        )}
      </p>

      {/* Delta opcional */}
      {delta && (
        <p
          className={cn(
            'mt-2 font-mono text-[11px] tracking-wider flex items-center gap-1',
            deltaType === 'positive' && 'text-success',
            deltaType === 'negative' && 'text-danger',
            deltaType === 'neutral' && 'text-text-muted'
          )}
        >
          <span aria-hidden="true">
            {deltaType === 'positive' && '↗'}
            {deltaType === 'negative' && '↘'}
            {deltaType === 'neutral' && '—'}
          </span>
          <span>{delta}</span>
        </p>
      )}
    </article>
  )
}

export default KpiCard