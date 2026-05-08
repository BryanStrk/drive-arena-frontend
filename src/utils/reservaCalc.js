import { OFFER_PACKS } from "@/data/homeMocks";

/**
 * Descuentos por pack — espejo de ReservaPublicaService.aplicarDescuentoPack
 * del backend. Si esto cambia en backend, hay que actualizarlo aquí también.
 *
 * En v2 esto saldría del propio pack como atributo (backend devolvería
 * `discount` como parte de la response del catálogo de packs), eliminando
 * esta duplicación.
 */
const PACK_DISCOUNTS = {
  1: 0.30, // Pack GP Championship
  2: 0.25, // Pack Piloto Privado
};

/**
 * Calcula las noches entre dos fechas YYYY-MM-DD.
 */
export function calcularNoches(fechaEntrada, fechaSalida) {
  if (!fechaEntrada || !fechaSalida) return 0;
  const ms = new Date(fechaSalida) - new Date(fechaEntrada);
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Resuelve el precio por noche del hotel según el régimen.
 * Mismo switch que ReservaPublicaService.calcularTotal en backend.
 */
export function precioPorRegimen(hotel, regimen) {
  if (!hotel) return 0;
  switch (regimen) {
    case "sin":
      return 0;
    case "media":
      return Number(hotel.precioMediaPension ?? 0);
    case "completa":
      return Number(hotel.precioPensionCompleta ?? 0);
    default:
      return 0;
  }
}

/**
 * Calcula el total de la reserva con desglose por concepto.
 *
 * REPLICA EXACTA de ReservaPublicaService.calcularTotal del backend:
 *   totalSesiones = tarifa.precio × personas
 *   totalHotel    = precioRegimen × noches
 *   subtotal      = totalSesiones + totalHotel
 *   descuento     = pack 1: 30%, pack 2: 25%, ninguno: 0%
 *   total         = subtotal × (1 - descuento)
 *
 * El total mostrado coincidirá con el que el backend devuelva al confirmar
 * la reserva (excepto por casos extremos de redondeo, donde el backend es
 * autoritativo y su valor es el que finalmente se cobra).
 *
 * @returns {{
 *   total: number,
 *   subtotal: number,
 *   descuentoPct: number,
 *   descuentoImporte: number,
 *   desglose: Array<{ concepto: string, detalle: string, importe: number }>
 * }}
 */
export function calcularTotalReserva(state) {
  const personas = state.personas ?? 1;
  const desglose = [];
  let subtotal = 0;

  // 1. Sesiones (tarifa × personas)
  if (state.pase?.tarifa) {
    const tarifa = state.pase.tarifa;
    const importeSesiones = Number(tarifa.precio) * personas;
    desglose.push({
      concepto: state.pase.atraccion?.nombre ?? "Pase",
      detalle: `${tarifa.precio}€ × ${personas} ${
        personas === 1 ? "persona" : "personas"
      }`,
      importe: importeSesiones,
    });
    subtotal += importeSesiones;
  }

  // 2. Hotel × noches según régimen seleccionado
  if (
    state.lodge?.lodge &&
    state.lodge?.fechaEntrada &&
    state.lodge?.fechaSalida &&
    state.lodge?.regimen
  ) {
    const noches = calcularNoches(
      state.lodge.fechaEntrada,
      state.lodge.fechaSalida
    );
    const precioNoche = precioPorRegimen(state.lodge.lodge, state.lodge.regimen);
    const importeHotel = precioNoche * noches;

    if (importeHotel > 0) {
      desglose.push({
        concepto: state.lodge.lodge.nombre,
        detalle: `${precioNoche}€/noche × ${noches} ${
          noches === 1 ? "noche" : "noches"
        }`,
        importe: importeHotel,
      });
      subtotal += importeHotel;
    }
  }

  // 3. Descuento de pack (si aplica)
  const descuentoPct = state.packId ? PACK_DISCOUNTS[state.packId] ?? 0 : 0;
  const descuentoImporte = subtotal * descuentoPct;
  const total = subtotal - descuentoImporte;

  return {
    total: Math.round(total * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    descuentoPct,
    descuentoImporte: Math.round(descuentoImporte * 100) / 100,
    desglose,
  };
}

/**
 * Genera un código de reserva legible tipo "DA-2026-A4B7".
 *
 * @deprecated El backend genera el código autoritativo (con verificación de
 * unicidad y reintentos). Mantener solo si algún flow legacy lo usa.
 */
export function generarCodigoReserva() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DA-${year}-${random}`;
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato español legible.
 */
export function formatearFecha(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Buscar pack por id en mocks. Helper expuesto por compatibilidad.
 * @param {number} packId
 */
export function buscarPack(packId) {
  return OFFER_PACKS.find((p) => p.id === packId) ?? null;
}
