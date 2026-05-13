import axiosClient from './axiosClient'

/**
 * API de Clientes (pilotos que reservan, NO usuarios del sistema).
 *
 * Endpoints utilizados:
 *  - GET    /clientes                    lista todos
 *  - GET    /clientes/{id}               detalle por id
 *  - GET    /clientes/by-dni/{dni}       búsqueda por DNI (uso central en taquilla)
 *  - GET    /clientes/by-email/{email}   búsqueda por email
 *  - POST   /clientes                    crear (fechaRegistro y activo automáticos)
 *  - PUT    /clientes/{id}               actualizar datos personales
 *  - DELETE /clientes/{id}               eliminar
 *
 * Reglas de negocio (validadas en el backend):
 *  - email y dni son UNIQUE → 409 si duplicados
 *  - DNI con formato español: 8 dígitos + 1 letra (ej: 12345678A)
 *
 * Todos los endpoints requieren JWT.
 */

const BASE_URL = '/clientes'

export const clientesApi = {
  async list() {
    const { data } = await axiosClient.get(BASE_URL)
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

  async getByEmail(email) {
    const { data } = await axiosClient.get(`${BASE_URL}/by-email/${email}`)
    return data
  },

  async buscar(q) {
    const { data } = await axiosClient.get(`${BASE_URL}/buscar`, { params: { q } })
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
