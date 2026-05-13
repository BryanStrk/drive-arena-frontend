import axiosClient from './axiosClient'

/**
 * API de Mantenimientos contra el backend Drive Arena.
 *
 * Endpoints utilizados:
 *  - GET    /mantenimientos                          lista todos
 *  - GET    /mantenimientos?estado=PENDIENTE         filtra por estado
 *  - GET    /mantenimientos?atraccionId=N            filtra por atracción
 *  - GET    /mantenimientos?tecnicoId=N              filtra por técnico
 *  - GET    /mantenimientos?fechaDesde=...&fechaHasta=...   rango de fechas
 *  - GET    /mantenimientos/{id}                     detalle
 *  - POST   /mantenimientos                          crear (estado se fuerza a PENDIENTE)
 *  - PUT    /mantenimientos/{id}                     actualizar (incluido cambio de estado)
 *  - DELETE /mantenimientos/{id}                     eliminar
 *
 * Reglas de negocio (validadas en el backend):
 *  - Solo empleados con oficio TECNICO pueden ser asignados → 400 si no
 *  - En POST se ignora el estado del payload y se fuerza a PENDIENTE
 *
 * Todos los endpoints requieren JWT.
 */

const BASE_URL = '/mantenimientos'

export const mantenimientosApi = {
  /**
   * Lista mantenimientos con filtros opcionales.
   * @param {{estado?: string, atraccionId?: number, tecnicoId?: number,
   *          fechaDesde?: string, fechaHasta?: string}} filters
   */
  async list(filters = {}) {
    const params = {}
    if (filters.estado) params.estado = filters.estado
    if (filters.atraccionId) params.atraccionId = filters.atraccionId
    if (filters.tecnicoId) params.tecnicoId = filters.tecnicoId
    if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde
    if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta

    const { data } = await axiosClient.get(BASE_URL, { params })
    return data
  },

  async getById(id) {
    const { data } = await axiosClient.get(`${BASE_URL}/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await axiosClient.post(BASE_URL, payload)
    return data
  },

  async update(id, payload) {
    const { data } = await axiosClient.put(`${BASE_URL}/${id}`, payload)
    return data
  },

  async remove(id) {
    await axiosClient.delete(`${BASE_URL}/${id}`)
  },

  async changeEstado(id, estado) {
    const { data } = await axiosClient.patch(`${BASE_URL}/${id}/estado`, { estado })
    return data
  },

  async asignarTecnico(id, tecnicoId) {
    const { data } = await axiosClient.patch(`${BASE_URL}/${id}/asignar-tecnico`, { tecnicoId })
    return data
  },
}
