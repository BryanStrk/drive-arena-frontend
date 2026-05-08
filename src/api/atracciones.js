import axiosClient from './axiosClient'

/**
 * API client del módulo de Atracciones (circuitos).
 *
 * GET /api/atracciones — público (whitelist en SecurityConfig)
 * GET /api/atracciones/{id} — público
 *
 * Endpoints futuros (admin de Circuitos):
 *   POST /api/atracciones
 *   PUT /api/atracciones/{id}
 *   DELETE /api/atracciones/{id}
 */

export async function obtenerAtracciones() {
  const { data } = await axiosClient.get('/atracciones')
  return data
}

export async function obtenerAtraccionPorId(id) {
  const { data } = await axiosClient.get(`/atracciones/${id}`)
  return data
}
