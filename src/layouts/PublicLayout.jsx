import { Outlet, useLocation } from 'react-router'
import StatusBar from '@/components/StatusBar'

/**
 * Layout para páginas públicas (no requieren autenticación).
 * Incluye status bar superior (excepto en Home, que tiene su propio badge en el Hero)
 * y un slot Outlet para el contenido.
 */
function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '.')

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!isHome && (
        <StatusBar
          label="SISTEMA OPERATIVO · NODO BCN-01"
          right={`v0.1.0 | ${today}`}
        />
      )}

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout