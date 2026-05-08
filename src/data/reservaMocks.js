/**
 * Configuración del flujo de reserva pública.
 *
 * Solo contiene constantes de negocio y estado inicial del wizard.
 * El catálogo dinámico (atracciones, tarifas, hoteles) se obtiene del
 * backend vía `useReservaCatalogo`.
 */

// === LÍMITES DE NEGOCIO ===
export const PERSONAS_MIN = 1;
export const PERSONAS_MAX = 10;

// === ESTADO INICIAL DEL WIZARD ===
export const RESERVA_INITIAL_STATE = {
  pase: null,    // { atraccion, tarifa }
  lodge: null,   // { lodge, fechaEntrada, fechaSalida, regimen }
  cliente: null, // { nombre, apellidos, email, telefono, dni }
  personas: 1,   // 1 (titular) hasta PERSONAS_MAX
  esPack: false,
  packId: null,
};
