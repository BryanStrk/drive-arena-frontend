import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { ASSETS_BRAND } from '@/data/cloudinaryAssets'
import { cn } from '@/lib/cn'
import packageJson from '../../package.json'

/**
 * Layout del shell privado de Drive Arena.
 *
 * Estructura:
 * - Topbar STICKY arriba con logo + breadcrumbs + logout
 * - Sidebar STICKY a la izquierda (avatar + nav agrupada + footer estado)
 * - Outlet para el contenido de la página activa
 *
 * Decisión: solo se renderizan items habilitados. Los disabled se omiten
 * completamente hasta que el módulo esté implementado, manteniendo el shell
 * limpio y sin "elementos al aire".
 */

const APP_VERSION = packageJson.version

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { label: 'Compras', to: '/dashboard/compras' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Lodges', to: '/dashboard/lodges' },
    ],
  },
  {
    label: 'Operativa',
    items: [
      { label: 'Ranking', to: '/dashboard/ranking' },
    ],
  },
]

const BREADCRUMB_MAP = {
  '/dashboard': ['Inicio', 'Panel', 'Dashboard'],
  '/dashboard/lodges': ['Inicio', 'Panel', 'Gestión', 'Lodges'],
  '/dashboard/compras': ['Inicio', 'Panel', 'Ventas', 'Compras'], 
  '/dashboard/ranking': ['Inicio', 'Panel', 'Operativa', 'Ranking'],
}

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login', { replace: true })
  }

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Panel']

  return (
    <div className="min-h-screen bg-bg">
      {/* TOPBAR — sticky top */}
      <header className="sticky top-0 z-30 h-14 border-b border-border-strong bg-surface-1/95 backdrop-blur-md flex items-center justify-between px-6">
        {/* Logo + Breadcrumbs */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="block transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            aria-label="Ir al Dashboard"
          >
            <img
              src={ASSETS_BRAND.logo}
              alt="Drive Arena"
              className="h-7 w-auto"
              style={{ mixBlendMode: 'lighten' }}
            />
          </button>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2">
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
        </div>

        {/* Acciones derecha — solo logout por ahora */}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </header>

      {/* CONTENT: SIDEBAR + OUTLET */}
      <div className="flex">
        {/* SIDEBAR — sticky bajo el topbar, llena el viewport */}
        <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border-strong bg-surface-1 flex flex-col">
          {/* Avatar + datos del usuario */}
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

          {/* Navegación scrollable interna */}
          <nav className="flex-1 overflow-y-auto py-4">
            {NAV_SECTIONS.map((section) => (
              <SidebarSection key={section.label} {...section} />
            ))}
          </nav>

          {/* Footer del sidebar — Sistema Operativo (versión sincronizada con package.json) */}
          <div className="border-t border-border-strong p-4">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1.5 align-middle animate-pulse" />
              Sistema Operativo
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-widest uppercase text-text-dim">
              Nodo BCN-01 · v{APP_VERSION}
            </p>
          </div>
        </aside>

        {/* MAIN — siempre llena al menos el alto del viewport bajo el topbar */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)]">
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

function SidebarLink({ label, to }) {
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
