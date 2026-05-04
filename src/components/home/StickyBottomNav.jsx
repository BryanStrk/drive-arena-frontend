import { Link } from 'react-router'
import { cn } from '@/lib/cn'

/**
 * Barra de navegación pegada al fondo de la pantalla.
 * Siempre visible mientras el usuario hace scroll por el Home público.
 */
function StickyBottomNav() {
  const navLinks = [
    { href: '#experiencias', label: 'Experiencias' },
    { href: '#ranking', label: 'Ranking' },
    { href: '#packs', label: 'Packs', badge: '-30%' },
    { href: '#lodges', label: 'Lodges' },
  ]

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        'sticky bottom-0 z-40',
        'bg-bg/95 backdrop-blur-md',
        'border-t border-border-strong',
        'px-6 py-3'
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <a
          href="#"
          className="font-display font-extrabold text-base tracking-tight uppercase shrink-0 hover:text-primary transition-colors"
          aria-label="Drive Arena - Inicio"
        >
          Drive Arena
        </a>

        <ul
          role="list"
          className="hidden md:flex items-center gap-6 flex-1 justify-center"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="font-mono text-[9px] text-primary">
                    {link.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        <Link
          to="/login"
          className={cn(
            'shrink-0',
            'font-mono text-[10px] tracking-[0.25em] uppercase font-medium',
            'px-5 py-2',
            'border border-border-strong rounded-inner',
            'text-text hover:bg-primary hover:border-primary hover:text-text',
            'transition-colors'
          )}
        >
          Login
        </Link>
      </div>
    </nav>
  )
}

export default StickyBottomNav