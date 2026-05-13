import axiosClient from './axiosClient'

/**
 * API client del módulo de Compras.
 *
 * Endpoints del backend:
 *   GET    /api/compras                        Lista todas (filtros opcionales)
 *   GET    /api/compras?clienteId=N            Filtra por cliente
 *   GET    /api/compras?hotelId=N              Filtra por hotel
 *   GET    /api/compras/{id}                   Detalle (incluye entradas anidadas)
 *   DELETE /api/compras/{id}                   Borra (cascade borra entradas)
 *
 * Nota: la creación POST se hace desde el wizard público (ReservaPublicaController),
 * no desde aquí. Aquí solo lectura + borrado.
 */

export async function crearCompra(payload) {
  const { data } = await axiosClient.post('/compras', payload)
  return data
}

export async function obtenerCompras({ clienteId, hotelId, q } = {}) {
  const params = {}
  if (clienteId) params.clienteId = clienteId
  if (hotelId)   params.hotelId   = hotelId
  if (q)         params.q         = q

  const { data } = await axiosClient.get('/compras', { params })
  return data
}

export async function obtenerCompraPorId(id) {
  const { data } = await axiosClient.get(`/compras/${id}`)
  return data
}

export async function eliminarCompra(id) {
  await axiosClient.delete(`/compras/${id}`)
}
