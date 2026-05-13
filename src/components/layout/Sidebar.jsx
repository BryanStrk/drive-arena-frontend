import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'

const NAV_BY_ROLE = {
  ADMIN: [
    {
      label: 'Principal',
      items: [{ label: 'Dashboard', to: '/dashboard' }],
    },
    {
      label: 'Ventas',
      items: [{ label: 'Compras', to: '/dashboard/compras' }],
    },
    {
      label: 'Gestión',
      items: [
        { label: 'Clientes', to: '/dashboard/clientes' },
        { label: 'Lodges', to: '/dashboard/lodges' },
        { label: 'Circuitos', to: '/dashboard/circuitos' },
      ],
    },
    {
      label: 'Operativa',
      items: [
        { label: 'Mantenimiento', to: '/dashboard/mantenimiento' },
        { label: 'Ranking', to: '/dashboard/ranking' },
      ],
    },
    {
      label: 'Administración',
      items: [{ label: 'Usuarios', to: '/dashboard/usuarios' }],
    },
  ],
  TAQUILLA: [
    {
      label: 'Ventas',
      items: [
        { label: 'Nueva Venta',      to: '/taquilla/nueva-compra'      },
        { label: 'Mis Ventas',       to: '/taquilla/mis-compras'       },
        { label: 'Todas las Ventas', to: '/taquilla/todas-las-ventas'  },
      ],
    },
    {
      label: 'Gestión',
      items: [{ label: 'Clientes', to: '/taquilla/clientes' }],
    },
  ],
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

function Sidebar({ role }) {
  const sections = NAV_BY_ROLE[role] ?? []
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {sections.map((section) => (
        <SidebarSection key={section.label} {...section} />
      ))}
    </nav>
  )
}

export default Sidebar
