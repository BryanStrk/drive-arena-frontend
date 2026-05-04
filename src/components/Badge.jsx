import { cn } from '@/lib/cn'

/**
 * Badge para etiquetas, estados y categorías.
 *
 * @param {Object} props
 * @param {'default'|'primary'|'outline'|'success'|'warning'|'danger'} [props.variant='default']
 * @param {'xs'|'sm'|'md'} [props.size='sm']
 * @param {boolean} [props.dot=false] - Muestra un punto status a la izquierda (con pulso si pulse=true)
 * @param {boolean} [props.pulse=false] - Anima el dot con efecto pulse (live indicators)
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  pulse = false,
  className,
  children,
  ...rest
}) {
  // Clases base
  const baseClasses = cn(
    'inline-flex items-center gap-1.5',
    'font-mono font-medium uppercase tracking-wider',
    'rounded-sm whitespace-nowrap'
  )

  // Variantes de color
  const variantClasses = {
    default: 'bg-surface-2 text-text-muted',
    primary: 'bg-primary text-text',
    outline: 'bg-transparent text-primary border border-primary',
    success: 'bg-success/15 text-success border border-success/30',
    warning: 'bg-warning/15 text-warning border border-warning/30',
    danger: 'bg-danger/15 text-danger border border-danger/30',
  }

  // Tamaños
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
  }

  // Color del dot según variante
  const dotColorClasses = {
    default: 'bg-text-muted',
    primary: 'bg-text',
    outline: 'bg-primary',
    success: 'bg-success shadow-[0_0_6px_var(--color-success)]',
    warning: 'bg-warning shadow-[0_0_6px_var(--color-warning)]',
    danger: 'bg-danger shadow-[0_0_6px_var(--color-danger)]',
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotColorClasses[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  )
}

export default Badge