import { NavLink, Outlet, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

/**
 * Layout del shell privado de Drive Arena.
 *
 * Estructura:
 * - Topbar fijo arriba con logo + info del usuario + botón logout
 * - Sidebar fijo a la izquierda con navegación principal
 * - Outlet para el contenido de la página activa
 *
 * Las rutas privadas se anidan dentro de este layout.
 * Solo accesible para usuarios autenticados (gestionado por
 * <ProtectedRoute> en el router).
 */

// Items de navegación. Los `disabled: true` son placeholders para
// CRUDs que se implementarán en futuras features.
const NAV_ITEMS = [
  { label: 'Inicio', to: '/dashboard', disabled: false },
  { label: 'Clientes', to: '/dashboard/clientes', disabled: true },
  { label: 'Atracciones', to: '/dashboard/atracciones', disabled: true },
  { label: 'Lodges', to: '/dashboard/lodges', disabled: true },
  { label: 'Empleados', to: '/dashboard/empleados', disabled: true },
  { label: 'Tarifas', to: '/dashboard/tarifas', disabled: true },
]

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /**
   * Cierra la sesión del usuario actual.
   * Limpia el estado del AuthContext + localStorage y redirige al login.
   */
  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* TOPBAR */}
      <header className="h-14 border-b border-border-strong bg-surface-1 flex items-center justify-between px-6">
        {/* Logo + label */}
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-xl tracking-tight text-text">
            DRIVE ARENA
          </span>
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted"
            aria-hidden="true"
          >
            · Sistema Operativo
          </span>
        </div>

        {/* Usuario activo + logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase text-text-muted">
              {user?.username}
            </span>
            <Badge variant="primary" size="xs">
              {user?.rol}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* CONTENT: SIDEBAR + OUTLET */}
      <div className="flex-1 flex">
        {/* SIDEBAR */}
        <aside className="w-56 border-r border-border-strong bg-surface-1 flex flex-col">
          <p className="px-4 pt-6 pb-3 font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            ▌ Navegación
          </p>

          <nav className="flex-1 px-2">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="border-t border-border-strong p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-text-dim">
              v0.2.0
            </p>
          </div>
        </aside>

        {/* OUTLET — aquí renderizan las páginas privadas */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/**
 * Sub-componente: link individual del sidebar.
 * Maneja estados active/inactive/disabled.
 */
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
