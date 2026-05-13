import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/context/useAuth'
import { HOME_BY_ROLE } from '@/lib/roleRoutes'

/**
 * Protege rutas privadas que requieren autenticación y opcionalmente un rol.
 *
 * Comportamiento:
 * - Si NO hay sesión → redirect a /login
 * - Si hay sesión pero el rol no está en allowedRoles → redirect al home del rol
 * - Si todo OK → renderiza children
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string[]} [props.allowedRoles] - Roles permitidos. Sin este prop, solo verifica auth.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    const home = HOME_BY_ROLE[user.rol] ?? '/login'
    return <Navigate to={home} replace />
  }

  return children
}

export default ProtectedRoute