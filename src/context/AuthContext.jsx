import { useEffect, useState, useCallback } from 'react'

import { authApi } from '@/api/authApi'
import { setSession, getSession, clearSession } from '@/lib/storage'
import { AuthContext } from './authContextInstance'

/**
 * AuthProvider — provee el estado global de autenticación.
 *
 * Debe envolver la app en main.jsx para que useAuth() funcione en cualquier
 * componente del árbol.
 *
 * Provee:
 * - user: objeto con info del usuario logueado o null
 * - isAuthenticated: boolean derivado de la presencia del user
 * - isLoading: true mientras se rehidrata la sesión desde localStorage
 *   en el primer render (evita parpadeos UI antes de saber si hay sesión)
 * - login(credentials): hace login contra el backend y persiste la sesión
 * - logout(): borra la sesión local
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
