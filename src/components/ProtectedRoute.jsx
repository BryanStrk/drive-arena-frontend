import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/context/useAuth'

/**
 * Protege rutas privadas que requieren autenticación.
 *
 * Comportamiento:
 * - Si hay sesión activa → renderiza children
 * - Si NO hay sesión → redirect a /login (preservando la ruta intentada
 *   en location.state.from para volver tras login)
 * - Si la sesión está cargando → no renderiza nada (placeholder vacío)
 *
 * Uso en router.jsx:
 *   {
 *     path: '/dashboard',
 *     element: <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   }
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a proteger
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Mientras rehidrata la sesión, no renderizamos nada para evitar
  // un parpadeo de redirect/redirect-back. Hoy es síncrono pero
  // dejamos la guarda para futuras validaciones async.
  if (isLoading) {
    return null
  }

  // Sin sesión: redirect al login. Guardamos la ruta intentada
  // para que el login pueda redirigir aquí tras autenticación exitosa.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}

export default ProtectedRoute