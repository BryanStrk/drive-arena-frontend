import { Navigate } from 'react-router'
import { useAuth } from '@/context/useAuth'

/**
 * Componente espejo de ProtectedRoute.
 * Restringe rutas que solo deben ser visibles a usuarios SIN sesión activa.
 *
 * Comportamiento:
 * - Si NO hay sesión → renderiza children (login, registro...)
 * - Si HAY sesión → redirect al dashboard
 * - Si la sesión está cargando → no renderiza nada
 *
 * Uso típico: envolver el Login para que un usuario ya autenticado
 * no pueda volver al formulario.
 *
 * Uso en router.jsx:
 *   {
 *     path: '/login',
 *     element: <PublicOnlyRoute><Login /></PublicOnlyRoute>
 *   }
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido público
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute