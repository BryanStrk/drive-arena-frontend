import { Outlet } from 'react-router'
import StatusBar from '@/components/StatusBar'

/**
 * Layout para páginas públicas (no requieren autenticación).
 * Incluye status bar superior y un slot Outlet para el contenido.
 *
 * El footer es responsabilidad de cada página, ya que pueden tener
 * variantes (rico para Home, minimal para Login).
 */
function PublicLayout() {
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '.')

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <StatusBar
        label="PARQUE OPERATIVO · SESIÓN 2026"
        right={`v0.1.0 | ${today}`}
      />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout