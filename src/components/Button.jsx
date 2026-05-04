import { cn } from '@/lib/cn'

/**
 * Botón reutilizable con variantes acorde al Design System V1.0.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Clases extra para casos puntuales
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...rest
}) {
  // Clases base compartidas por todas las variantes
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2',
    'font-mono font-medium uppercase tracking-widest',
    'transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'cursor-pointer'
  )

  // Variantes de color
  const variantClasses = {
    primary: cn(
      'bg-primary text-text',
      'hover:bg-primary-dark',
      'active:scale-[0.98]'
    ),
    secondary: cn(
      'bg-transparent text-text',
      'border border-border-strong',
      'hover:bg-surface-2 hover:border-text-muted',
      'active:scale-[0.98]'
    ),
    ghost: cn(
      'bg-transparent text-text-muted',
      'hover:text-primary',
      'px-0'
    ),
    danger: cn(
      'bg-danger text-text',
      'hover:bg-danger/80',
      'active:scale-[0.98]'
    ),
  }

  // Tamaños — afectan padding y font-size
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  }

  // Para variante ghost, ignoramos padding del size
  const finalSizeClasses = variant === 'ghost' ? 'text-xs' : sizeClasses[size]

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        finalSizeClasses,
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button