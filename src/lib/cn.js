import clsx from 'clsx'

/**
 * Helper para componer clases CSS de forma condicional.
 * Wrapper sobre clsx para uso consistente en todo el proyecto.
 *
 * @example
 * cn('base', isActive && 'active', { 'disabled': !enabled })
 */
    export function cn(...inputs) {
    return clsx(inputs)
    }