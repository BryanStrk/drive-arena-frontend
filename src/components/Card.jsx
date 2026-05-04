import { cn } from '@/lib/cn'

/**
 * Card wrapper genérico. Composición libre del contenido vía children.
 *
 * @param {Object} props
 * @param {'default'|'elevated'|'flat'} [props.variant='default']
 * @param {boolean} [props.interactive=false] - Añade hover state para cards clickables
 * @param {boolean} [props.noPadding=false] - Quita el padding (útil cuando hay imagen full-bleed)
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function Card({
  variant = 'default',
  interactive = false,
  noPadding = false,
  className,
  children,
  ...rest
}) {
  const baseClasses = cn(
    'relative overflow-hidden',
    'rounded-card',
    'transition-colors duration-150'
  )

  const variantClasses = {
    default: 'bg-surface-1 border border-border-strong',
    elevated: 'bg-surface-2 border border-border-strong',
    flat: 'bg-surface-1',
  }

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:border-primary/40 hover:bg-surface-2'
    : ''

  const paddingClasses = noPadding ? '' : 'p-6'

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        paddingClasses,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Sub-componente para divisores dentro de un Card.
 */
Card.Divider = function CardDivider({ className }) {
  return <hr className={cn('border-border-strong my-4', className)} />
}

/**
 * Header pre-estilizado opcional para Cards.
 */
Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export default Card