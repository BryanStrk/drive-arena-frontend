/**
 * Helpers para gestionar la sesión del usuario en localStorage.
 *
 * Encapsulamos los accesos a localStorage en funciones para:
 * - Centralizar las claves usadas (evitar typos)
 * - Manejar errores de parseo de JSON
 * - Cambiar de storage en el futuro sin tocar el resto del código
 *
 * Sesión = token JWT + info del usuario (username, rol, userId).
 */

const STORAGE_KEYS = {
  TOKEN: 'drive_arena_token',
  USER: 'drive_arena_user',
}

/**
 * Guarda la sesión completa en localStorage.
 *
 * @param {Object} session
 * @param {string} session.token - JWT recibido del backend
 * @param {Object} session.user - { username, rol, userId }
 */
export function setSession({ token, user }) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

/**
 * Recupera la sesión actual desde localStorage.
 * Devuelve null si no hay sesión activa o si los datos están corruptos.
 *
 * @returns {{ token: string, user: Object } | null}
 */
export function getSession() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const userJson = localStorage.getItem(STORAGE_KEYS.USER)

  if (!token || !userJson) {
    return null
  }

  try {
    const user = JSON.parse(userJson)
    return { token, user }
  } catch {
    // Datos corruptos: limpiamos para evitar problemas futuros
    clearSession()
    return null
  }
}

/**
 * Elimina la sesión de localStorage.
 * Se invoca en logout o cuando el token expira (interceptor de Axios).
 */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

/**
 * Helper: indica si hay sesión activa.
 *
 * @returns {boolean}
 */
export function hasSession() {
  return getSession() !== null
}