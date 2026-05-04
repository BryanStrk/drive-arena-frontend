import { useContext } from 'react'
import { AuthContext } from './authContextInstance'

/**
 * Hook para consumir el AuthContext desde cualquier componente.
 * Lanza un error claro si se usa fuera del Provider (defensivo).
 *
 * @returns {{
 *   user: Object | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   login: Function,
 *   logout: Function
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}