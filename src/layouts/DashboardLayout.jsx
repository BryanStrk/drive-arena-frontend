import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Cierra el drawer con ESC
  useEffect(() => {
    if (!sidebarOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen])

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
      <header className="sticky top-0 z-40 h-14 border-b border-border-strong bg-surface-1/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="md:hidden -ml-1 p-2 text-text-muted hover:text-text transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => navigate(homeRoute)}
            className="block transition-all duration-200 hover:opacity-80 sm:hover:scale-[1.02] focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            aria-label="Ir al inicio"
          >
            <Logo className="h-7 w-auto text-text" />
          </button>

          {/* Mobile: solo la página actual (los intermedios se omiten) */}
          <span className="sm:hidden max-w-[45vw] truncate font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-text">
            {breadcrumbs[breadcrumbs.length - 1]}
          </span>

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

      {/* Backdrop del drawer — solo mobile, click fuera para cerrar */}
      {sidebarOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-20 bg-bg/80 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENT: SIDEBAR + OUTLET */}
      <div className="flex">
        <aside
          id="dashboard-sidebar"
          className={cn(
            // Común a mobile y desktop
            'top-14 h-[calc(100vh-3.5rem)] w-64 border-r border-border-strong bg-surface-1 flex flex-col',
            // Mobile: drawer fijo fuera de pantalla, slide-in al abrir
            'fixed left-0 z-30 transition-transform duration-300 ease-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            // Desktop (md+): sidebar fijo en flujo, comportamiento original intacto
            'md:sticky md:z-auto md:shrink-0 md:translate-x-0 md:transition-none'
          )}
        >
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

          {/* Navegación filtrada por rol. El click cierra el drawer en mobile;
              en desktop el aside es siempre visible, así que no tiene efecto. */}
          <div className="flex-1 min-h-0 flex flex-col" onClick={() => setSidebarOpen(false)}>
            <Sidebar role={user?.rol} />
          </div>

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
