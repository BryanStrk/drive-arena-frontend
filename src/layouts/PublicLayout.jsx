import { Outlet } from 'react-router'
import StatusBar from '@/components/StatusBar'

/**
 * Layout para páginas públicas (no requieren autenticación).
 * Incluye status bar superior y un slot <Outlet /> para el contenido.
 *
 * Las rutas hijas que usen este layout heredan automáticamente
 * el status bar y el footer.
 */
function PublicLayout() {
  // Fecha actual formateada DD.MM.YYYY (estilo del mockup)
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '.')

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Status bar superior */}
      <StatusBar
        label="PARQUE OPERATIVO · SESIÓN 2026"
        right={`v0.1.0 | ${today}`}
      />

      {/* Contenido principal — aquí se renderiza la ruta hija */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-border py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-text-dim">
          <span>© 2026 Drive Arena Resort · All Rights Reserved</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text transition-colors">Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:text-text transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout