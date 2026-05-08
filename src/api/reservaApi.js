import axiosClient from './axiosClient';

/**
 * API de reservas públicas (sin autenticación).
 *
 * Mapea 1:1 con los endpoints del backend.
 * El backend acepta el payload con régimen en cualquier mayúscula/minúscula
 * gracias al @JsonCreator del enum TipoPension.
 */

/**
 * Crea una reserva pública desde el wizard.
 *
 * @param {object} payload
 * @param {object} payload.cliente - { nombre, apellidos, email, telefono, dni }
 * @param {number} payload.personas - cantidad (1-10)
 * @param {object} payload.pase - { atraccionId, tarifaId }
 * @param {object} payload.lodge - { hotelId, fechaEntrada, fechaSalida, regimen }
 * @param {number|null} payload.packId - opcional, aplica descuento mock
 * @returns {Promise<{codigoReserva: string, total: number, mensaje: string}>}
 */
export async function crearReservaPublica(payload) {
  const { data } = await axiosClient.post('/reservas', payload);
  return data;
}

/**
 * Obtiene el listado de atracciones disponibles.
 * @returns {Promise<Array<{id: number, nombre: string, descripcion: string, tamano: string, imagenUrl: string}>>}
 */
export async function obtenerAtracciones() {
  const { data } = await axiosClient.get('/atracciones');
  return data;
}

/**
 * Obtiene el listado de tarifas globales (NINO, ADULTO, PENSIONISTA).
 * @returns {Promise<Array<{id: number, tipo: string, descripcion: string, precio: number}>>}
 */
export async function obtenerTarifas() {
  const { data } = await axiosClient.get('/tarifas');
  return data;
}

/**
 * Obtiene el listado de hoteles (lodges) disponibles para reserva pública.
 * @returns {Promise<Array<{id: number, nombre: string, descripcion: string, direccion: string, capacidadTotal: number}>>}
 */
export async function obtenerHoteles() {
  const { data } = await axiosClient.get('/hotels');
  return data;
}
