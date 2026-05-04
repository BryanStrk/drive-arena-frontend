import { Outlet } from 'react-router'

/**
 * Layout para páginas públicas (no requieren autenticación).
 * Es un wrapper minimal que solo renderiza el contenido de cada ruta.
 *
 * Cada página pública es responsable de mostrar su propio Badge de estado
 * (variant="success" dot pulse) en la esquina top-left, manteniendo
 * consistencia visual entre Home, Login y NotFound.
 */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout