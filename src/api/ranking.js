import axiosClient from './axiosClient'

/**
 * API client del módulo de Ranking (gamificación).
 *
 * Backend: TiempoCircuitoController
 *   GET /api/tiempos-circuito/ranking/{atraccionId}?top=N
 *   GET /api/tiempos-circuito/record/{atraccionId}
 *
 * El ranking es POR ATRACCIÓN — no hay un ranking global del parque
 * porque cada circuito tiene tiempos no comparables (Phantom GT vs Drift King).
 */

export async function obtenerRanking(atraccionId, top = null) {
  const params = top ? { top } : {}
  const { data } = await axiosClient.get(
    `/tiempos-circuito/ranking/${atraccionId}`,
    { params }
  )
  return data
}

export async function obtenerRecord(atraccionId) {
  const { data } = await axiosClient.get(
    `/tiempos-circuito/record/${atraccionId}`
  )
  return data
}
