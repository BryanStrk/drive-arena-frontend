import axiosClient from './axiosClient'

/**
 * API de Usuarios del sistema (operadores, no clientes/pilotos).
 *
 * Endpoints:
 *   GET    /usuarios                            lista paginada (q, rol, activo, page, size)
 *   POST   /usuarios                            crear usuario
 *   PUT    /usuarios/{id}                       actualizar rol
 *   PATCH  /usuarios/{id}/reset-password        resetear contraseña
 *   PATCH  /usuarios/{id}/toggle-active         activar/desactivar
 *
 * Reglas del back:
 *   - username UNIQUE → 409 si duplicado
 *   - No se puede desactivar el último ADMIN activo → 409
 *   - No se puede cambiar el rol del último ADMIN → 409/403
 *   - Todos los endpoints requieren rol ADMIN + JWT
 */

const BASE_URL = '/usuarios'

export const usuariosApi = {
  async list({ q, rol, activo, page, size } = {}, signal) {
    const params = {}
    if (q)            params.q      = q
    if (rol)          params.rol    = rol
    if (activo != null) params.activo = activo
    if (page != null) params.page   = page
    if (size != null) params.size   = size
    const { data } = await axiosClient.get(BASE_URL, { params, signal })
    return data
  },

  async create({ username, password, rol }) {
    const { data } = await axiosClient.post(BASE_URL, { username, password, rol })
    return data
  },

  async updateRol(id, rol) {
    const { data } = await axiosClient.put(`${BASE_URL}/${id}`, { rol })
    return data
  },

  async resetPassword(id, newPassword) {
    await axiosClient.patch(`${BASE_URL}/${id}/reset-password`, { newPassword })
  },

  async toggleActive(id) {
    const { data } = await axiosClient.patch(`${BASE_URL}/${id}/toggle-active`)
    return data
  },

  async listTecnicosActivos() {
    const { data } = await axiosClient.get(`${BASE_URL}/tecnicos-activos`)
    return data
  },
}
