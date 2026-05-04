import axiosClient from './axiosClient'

/**
 * API de autenticación contra el backend Drive Arena.
 *
 * Endpoint: POST /auth/login
 * Espera: { username, password }
 * Devuelve: { token, tokenType, username, rol, userId }
 *
 * Errores manejados por el caller:
 * - 401: credenciales inválidas
 * - timeout / network: backend caído o sin conexión
 * - 5xx: error interno del backend
 */
export const authApi = {
  /**
   * Hace login contra el backend y devuelve la respuesta del servidor.
   * NO guarda el token en localStorage — eso lo hace el AuthContext.
   *
   * @param {Object} credentials
   * @param {string} credentials.username
   * @param {string} credentials.password
   * @returns {Promise<{ token: string, tokenType: string, username: string, rol: string, userId: number }>}
   */
  async login({ username, password }) {
    const { data } = await axiosClient.post('/auth/login', {
      username,
      password,
    })
    return data
  },
}