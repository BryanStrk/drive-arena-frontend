import axiosClient from './axiosClient'

/**
 * API de Atracciones (circuitos del parque) contra el backend Drive Arena.
 *
 * NOTA DE NAMING: el módulo frontend se llama "Circuitos" (branding visible
 * al usuario), pero internamente apunta al endpoint backend `/atracciones`
 * (técnico). El módulo "Ranking" también consume este recurso.
 *
 * Endpoints utilizados:
 *  - GET    /atracciones                 lista todas
 *  - GET    /atracciones?tamano=GRANDE   filtra por tamaño
 *  - GET    /atracciones/{id}            detalle por id
 *  - POST   /atracciones                 crear (rol ADMIN)
 *  - PUT    /atracciones/{id}            actualizar (rol ADMIN)
 *  - DELETE /atracciones/{id}            eliminar (rol ADMIN)
 *
 * Todos los endpoints requieren JWT — lo inyecta el axiosClient.
 *
 * Errores que el caller debe manejar:
 *  - 401: token expirado/inválido
 *  - 403: usuario sin rol ADMIN
 *  - 404: atracción no encontrada
 *  - 409: constraint de BBDD (FK violation si tiene tiempos asociados)
 *  - 400: validación falla
 */

const BASE_URL = '/atracciones'

export const atraccionesApi = {
  /**
   * Lista todas las atracciones, opcionalmente filtradas por tamaño.
   *
   * @param {'GRANDE'|'MEDIANA'|'PEQUENA'|null} tamano — filtro opcional
   * @returns {Promise<Array<{
   *   id: number,
   *   nombre: string,
   *   descripcion: string,
   *   tamano: 'GRANDE'|'MEDIANA'|'PEQUENA',
   *   frecuenciaRevisionDias: number,
   *   imagenUrl: string
   * }>>}
   */
  async list(tamano = null) {
    const params = tamano ? { tamano } : {}
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
}

// ─── Aliases legacy (módulo Ranking) ────────────────────────────────────
// Mantienen compatibilidad con el código previo a la refactorización.
// TODO: migrar Ranking a atraccionesApi.list() y eliminar estos aliases.
export const obtenerAtracciones = () => atraccionesApi.list()
export const obtenerAtraccionPorId = (id) => atraccionesApi.getById(id)
