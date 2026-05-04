import { createContext, useContext, useEffect, useState, useCallback } from 'react'

import { authApi } from '@/api/authApi'
import { setSession, getSession, clearSession } from '@/lib/storage'

/**
 * AuthContext — estado global del usuario autenticado.
 *
 * Provee:
 * - user: objeto con info del usuario logueado o null
 * - isAuthenticated: boolean derivado de la presencia del user
 * - isLoading: true mientras se rehidrata la sesión desde localStorage
 *   en el primer render (evita parpadeos UI antes de saber si hay sesión)
 * - login(credentials): hace login contra el backend y persiste la sesión
 * - logout(): borra la sesión local
 *
 * Uso:
 *   const { user, login, logout } = useAuth()
 *
 * Patrón:
 * - Provider envuelve el árbol entero en main.jsx
 * - Hook useAuth() lo consume desde cualquier componente
 * - La sesión se rehidrata automáticamente al recargar la página
 */

const AuthContext = createContext(null)

/**
 * Provider del AuthContext.
 * Debe envolver la app en main.jsx para que useAuth() funcione.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Rehidratación de sesión al montar el provider.
   * Lee localStorage y actualiza el state si hay sesión válida.
   *
   * setIsLoading(false) al final desbloquea las rutas protegidas
   * (que esperan a saber si hay sesión antes de redirigir o renderizar).
   */
  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
    }
    setIsLoading(false)
  }, [])

  /**
   * Hace login contra el backend y persiste la sesión.
   * El componente que llama esta función maneja errores via try/catch.
   *
   * @param {{ username: string, password: string }} credentials
   * @returns {Promise<Object>} usuario logueado
   */
  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)

    // El backend devuelve: { token, tokenType, username, rol, userId }
    // Separamos token (auth) de user info (UI)
    const { token, ...userInfo } = response

    // Persistencia + estado en memoria
    setSession({ token, user: userInfo })
    setUser(userInfo)

    return userInfo
  }, [])

  /**
   * Borra la sesión local. No llama al backend (con JWT stateless,
   * basta con olvidar el token; no hay sesión server-side que invalidar).
   */
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

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
