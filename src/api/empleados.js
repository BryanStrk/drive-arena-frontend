import axiosClient from './axiosClient'

/**
 * API de Empleados (staff del parque) contra el backend Drive Arena.
 *
 * Endpoints utilizados:
 *  - GET    /empleados                                       lista todos
 *  - GET    /empleados?oficio=TECNICO                        filtra por oficio
 *  - GET    /empleados?soloActivos=true                      solo activos
 *  - GET    /empleados?oficio=TECNICO&soloActivos=true       combinado (técnicos activos)
 *  - GET    /empleados/{id}                                  detalle por id
 *  - GET    /empleados/by-dni/{dni}                          búsqueda por DNI
 *  - POST   /empleados                                       crear (rol ADMIN)
 *  - PUT    /empleados/{id}                                  actualizar (rol ADMIN)
 *  - DELETE /empleados/{id}                                  eliminar (rol ADMIN)
 *
 * Caso de uso principal del módulo Mantenimiento:
 *   `GET /empleados?oficio=TECNICO&soloActivos=true` → poblar el select de
 *   técnicos disponibles en el form de mantenimiento.
 *
 * Ojo: dni es UNIQUE en BBDD → POST/PUT con DNI duplicado devuelve 409.
 */

const BASE_URL = '/empleados'

export const empleadosApi = {
  /**
   * Lista empleados con filtros opcionales.
   * @param {{oficio?: string, soloActivos?: boolean}} filters
   */
  async list(filters = {}) {
    const params = {}
    if (filters.oficio) params.oficio = filters.oficio
    if (filters.soloActivos != null) params.soloActivos = filters.soloActivos

    const { data } = await axiosClient.get(BASE_URL, { params })
    return data
  },

  async getById(id) {
    const { data } = await axiosClient.get(`${BASE_URL}/${id}`)
    return data
  },

  async getByDni(dni) {
    const { data } = await axiosClient.get(`${BASE_URL}/by-dni/${dni}`)
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
}
