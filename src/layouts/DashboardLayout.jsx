import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { ASSETS_BRAND } from '@/data/cloudinaryAssets'
import { cn } from '@/lib/cn'

/**
 * Layout del shell privado de Drive Arena.
 *
 * Estructura:
 * - Topbar fijo arriba con breadcrumbs + buscador + notificaciones + logout
 * - Sidebar fijo a la izquierda con avatar + navegación agrupada por secciones
 * - Outlet para el contenido de la página activa
 */

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', to: '/dashboard', disabled: false },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { label: 'Nueva venta', to: '/dashboard/ventas/nueva', disabled: true },
      { label: 'Compras', to: '/dashboard/compras', disabled: true },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Clientes', to: '/dashboard/clientes', disabled: true },
      { label: 'Lodges', to: '/dashboard/lodges', disabled: true },
      { label: 'Circuitos', to: '/dashboard/atracciones', disabled: true },
      { label: 'Empleados', to: '/dashboard/empleados', disabled: true },
      { label: 'Tarifas', to: '/dashboard/tarifas', disabled: true },
    ],
  },
  {
    label: 'Operativa',
    items: [
      { label: 'Turnos', to: '/dashboard/turnos', disabled: true },
      { label: 'Mantenimiento', to: '/dashboard/mantenimiento', disabled: true },
      { label: 'Ranking', to: '/dashboard/ranking', disabled: true },
    ],
  },
  {
    label: 'Usuario',
    items: [
      { label: 'Mi perfil', to: '/dashboard/perfil', disabled: true },
    ],
  },
]

const BREADCRUMB_MAP = {
  '/dashboard': ['Inicio', 'Panel', 'Dashboard'],
}

// Mock count de notificaciones (se conectará al backend en una feature futura)
const MOCK_NOTIFICATIONS_COUNT = 3

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login', { replace: true })
  }

  const handleNotificationsClick = () => {
    toast('Bandeja de notificaciones · Próximamente', {
      icon: '🔔',
    })
  }

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Panel']

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* TOPBAR */}
      <header className="h-14 border-b border-border-strong bg-surface-1 flex items-center justify-between px-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <span key={crumb} className="flex items-center gap-2">
                <span
                  className={cn(
                    'font-mono text-[11px] tracking-[0.2em] uppercase',
                    isLast ? 'text-text font-bold' : 'text-text-muted'
                  )}
                >
                  {crumb}
                </span>
                {!isLast && (
                  <span
                    className="font-mono text-[10px] text-text-dim"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
              </span>
            )
          })}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-mono text-xs"
              aria-hidden="true"
            >
              ⌕
            </span>
            <input
              type="search"
              placeholder="Buscar..."
              disabled
              className="pl-8 pr-4 py-1.5 w-64 bg-surface-2 border border-border-strong rounded-inner text-sm text-text placeholder:text-text-dim font-sans focus:outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              title="Próximamente"
            />
          </div>

          {/* Notificaciones */}
          <button
            type="button"
            onClick={handleNotificationsClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-inner border border-border-strong bg-surface-2 text-text-muted hover:text-text hover:border-primary transition-colors"
            aria-label="Notificaciones"
          >
            <span className="text-base" aria-hidden="true">🔔</span>
            {MOCK_NOTIFICATIONS_COUNT > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary rounded-full font-mono text-[10px] font-bold text-white"
                aria-label={`${MOCK_NOTIFICATIONS_COUNT} notificaciones nuevas`}
              >
                {MOCK_NOTIFICATIONS_COUNT}
              </span>
            )}
          </button>

          {/* Logout */}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* CONTENT: SIDEBAR + OUTLET */}
      <div className="flex-1 flex">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-border-strong bg-surface-1 flex flex-col">
          <div className="px-4 pt-5 pb-5 border-b border-border-strong">
            <div className="flex items-center gap-3">
              <img
                src={ASSETS_BRAND.avatarDefault}
                alt="Avatar de usuario"
                className="w-12 h-12 rounded-full object-cover border border-border-strong"
              />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm tracking-wide text-text uppercase truncate">
                  {user?.username}
                </p>
                <Badge variant="primary" size="xs">
                  {user?.rol}
                </Badge>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {NAV_SECTIONS.map((section) => (
              <SidebarSection key={section.label} {...section} />
            ))}
          </nav>

          <div className="border-t border-border-strong p-4">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1.5 align-middle animate-pulse" />
              Sistema Operativo
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-widest uppercase text-text-dim">
              Nodo BCN-01 · v0.3.0
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarSection({ label, items }) {
  return (
    <div className="px-2 mb-4">
      <p className="px-3 mb-2 font-mono text-[10px] tracking-[0.25em] uppercase text-text-dim">
        {label}
      </p>
      {items.map((item) => (
        <SidebarLink key={item.to} {...item} />
      ))}
    </div>
  )
}

function SidebarLink({ label, to, disabled }) {
  if (disabled) {
    return (
      <span
        className="block px-3 py-2 my-0.5 font-sans text-sm text-text-dim cursor-not-allowed select-none"
        aria-disabled="true"
        title="Próximamente"
      >
        {label}
      </span>
    )
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'block px-3 py-2 my-0.5 rounded-inner font-sans text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-text-muted hover:text-text hover:bg-surface-2'
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default DashboardLayout
