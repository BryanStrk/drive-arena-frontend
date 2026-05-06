import axiosClient from './axiosClient'

/**
 * API de Lodges (alojamientos del resort) contra el backend Drive Arena.
 *
 * NOTA DE NAMING: Este módulo se llama "lodges" (branding interno del frontend),
 * pero internamente apunta al endpoint backend `/hotels` (técnico).
 * Si el día de mañana el backend renombra el endpoint, solo hay que tocar
 * la constante BASE_URL aquí — el resto del frontend no se entera.
 *
 * Endpoints utilizados:
 * - GET    /hotels         → lista todos los lodges
 * - GET    /hotels/{id}    → detalle por id
 * - POST   /hotels         → crear (rol ADMIN)
 * - PUT    /hotels/{id}    → actualizar (rol ADMIN)
 * - DELETE /hotels/{id}    → eliminar (rol ADMIN)
 *
 * Todos los endpoints requieren JWT — lo inyecta automáticamente el axiosClient.
 * Operaciones de escritura (POST/PUT/DELETE) requieren rol ADMIN.
 *
 * Errores que el caller debe manejar:
 * - 401: token expirado/inválido (interceptor del axiosClient ya limpia sesión)
 * - 403: usuario sin rol ADMIN
 * - 404: lodge no encontrado
 * - 409: constraint de BBDD (unique violation, FK violation, etc.)
 * - 400: validación falla — el body trae { message, errors? }
 */

const BASE_URL = '/hotels'

export const lodgesApi = {
  /**
   * Lista todos los lodges.
   *
   * @returns {Promise<Array<{
   *   id: number,
   *   nombre: string,
   *   descripcion: string,
   *   direccion: string,
   *   capacidadTotal: number,
   *   precioMediaPension: number,
   *   precioPensionCompleta: number,
   *   imagenUrl: string
   * }>>}
   */
  async list() {
    const { data } = await axiosClient.get(BASE_URL)
    return data
  },

  /**
   * Recupera un lodge por id.
   *
   * @param {number} id
   * @returns {Promise<Object>} HotelResponseDto
   * @throws 404 si no existe
   */
  async getById(id) {
    const { data } = await axiosClient.get(`${BASE_URL}/${id}`)
    return data
  },

  /**
   * Crea un nuevo lodge.
   * Requiere rol ADMIN.
   *
   * @param {Object} lodge - Payload del HotelRequestDto del backend
   * @param {string} lodge.nombre
   * @param {string} lodge.descripcion
   * @param {string} lodge.direccion
   * @param {number} lodge.capacidadTotal
   * @param {number} lodge.precioMediaPension
   * @param {number} lodge.precioPensionCompleta
   * @param {string} lodge.imagenUrl
   * @returns {Promise<Object>} HotelResponseDto con el id generado
   */
  async create(lodge) {
    const { data } = await axiosClient.post(BASE_URL, lodge)
    return data
  },

  /**
   * Actualiza un lodge existente.
   * Requiere rol ADMIN.
   *
   * @param {number} id
   * @param {Object} lodge - HotelRequestDto completo
   * @returns {Promise<Object>} HotelResponseDto actualizado
   * @throws 404 si no existe
   */
  async update(id, lodge) {
    const { data } = await axiosClient.put(`${BASE_URL}/${id}`, lodge)
    return data
  },

  /**
   * Elimina un lodge.
   * Requiere rol ADMIN.
   *
   * @param {number} id
   * @returns {Promise<void>}
   * @throws 404 si no existe
   * @throws 409 si tiene compras asociadas (FK constraint)
   */
  async remove(id) {
    await axiosClient.delete(`${BASE_URL}/${id}`)
  },
}
