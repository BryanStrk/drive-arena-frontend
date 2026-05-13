import { Navigate } from 'react-router'
import { useAuth } from '@/context/useAuth'
import { HOME_BY_ROLE } from '@/lib/roleRoutes'

/**
 * Restringe rutas que solo deben ser visibles a usuarios SIN sesión activa.
 * Si hay sesión activa, redirige al home del rol correspondiente.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    const home = HOME_BY_ROLE[user?.rol] ?? '/dashboard'
    return <Navigate to={home} replace />
  }

  return children
}

export default PublicOnlyRoute
