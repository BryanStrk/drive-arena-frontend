import Badge from '@/components/Badge'
import { useAuth } from '@/context/useAuth'

/**
 * Dashboard de zona privada — placeholder inicial.
 *
 * Esta página solo se renderiza para usuarios autenticados (protegida
 * por <ProtectedRoute> en el router). Muestra info básica del usuario
 * activo como confirmación de sesión.
 *
 * En la feature feature/page-dashboard se sustituirá por widgets de KPIs.
 */
function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      {/* Eyebrow + heading */}
      <div className="text-center max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Sistema Operativo · Sesión Activa
        </p>

        <h1 className="mt-4 font-display font-extrabold text-6xl tracking-tight text-text">
          Panel de Control
        </h1>

        <p className="mt-4 font-sans text-base text-text-muted">
          Bienvenido al sistema operativo Drive Arena.
          Próximamente verás aquí los KPIs operativos del resort.
        </p>
      </div>

      {/* Card con info del usuario */}
      <section className="mt-12 w-full max-w-md bg-surface-1 border border-border-strong rounded-card p-6">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
          Operador Activo
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-muted">
              Username
            </span>
            <span className="font-display text-lg text-text tabular-nums">
              {user?.username}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-muted">
              Rol
            </span>
            <Badge variant="primary" size="sm">
              {user?.rol}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-muted">
              ID
            </span>
            <span className="font-mono text-sm text-text tabular-nums">
              #{user?.userId}
            </span>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <p className="mt-12 font-mono text-[10px] tracking-widest uppercase text-text-dim">
        Drive Arena · v0.2.0
      </p>
    </div>
  )
}

export default Dashboard
