import { Outlet, useNavigate, useLocation } from 'react-router'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import { HOME_BY_ROLE } from '@/lib/roleRoutes'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import Logo from '@/components/Logo'
import Sidebar from '@/components/layout/Sidebar'
import { ASSETS_BRAND } from '@/data/cloudinaryAssets'
import { cn } from '@/lib/cn'
import packageJson from '../../package.json'

const APP_VERSION = packageJson.version

const BREADCRUMB_MAP = {
  '/dashboard': ['Inicio', 'Panel', 'Dashboard'],
  '/dashboard/lodges': ['Inicio', 'Panel', 'Gestión', 'Lodges'],
  '/dashboard/compras': ['Inicio', 'Panel', 'Ventas'],
  '/dashboard/ranking': ['Inicio', 'Panel', 'Operativa', 'Ranking'],
  '/dashboard/mantenimiento': ['Inicio', 'Panel', 'Operativa', 'Mantenimiento'],
  '/dashboard/clientes': ['Inicio', 'Panel', 'Gestión', 'Clientes'],
  '/dashboard/circuitos': ['Inicio', 'Panel', 'Gestión', 'Circuitos'],
  '/dashboard/usuarios': ['Inicio', 'Panel', 'Administración', 'Usuarios'],
  '/taquilla/nueva-compra':      ['Taquilla', 'Nueva Venta'],
  '/taquilla/mis-compras':       ['Taquilla', 'Mis Ventas'],
  '/taquilla/todas-las-ventas':  ['Taquilla', 'Todas las Ventas'],
  '/taquilla/clientes':          ['Taquilla', 'Clientes'],
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
  const homeRoute = HOME_BY_ROLE[user?.rol] ?? '/dashboard'

  return (
    <div className="min-h-screen bg-bg">
      {/* TOPBAR — sticky top */}
      <header className="sticky top-0 z-30 h-14 border-b border-border-strong bg-surface-1/95 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate(homeRoute)}
            className="block transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            aria-label="Ir al inicio"
          >
            <Logo className="h-7 w-auto text-text" />
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
                    <span className="font-mono text-[10px] text-text-dim" aria-hidden="true">
                      ›
                    </span>
                  )}
                </span>
              )
            })}
          </nav>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </header>

      {/* CONTENT: SIDEBAR + OUTLET */}
      <div className="flex">
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
                <Badge
                  variant={user?.rol === 'TECNICO' ? 'warning' : 'primary'}
                  size="xs"
                  className={user?.rol === 'TECNICO' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
                >
                  {user?.rol}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navegación filtrada por rol */}
          <Sidebar role={user?.rol} />

          {/* Footer del sidebar */}
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

        <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
