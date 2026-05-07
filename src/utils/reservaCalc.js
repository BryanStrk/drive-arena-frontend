import { OFFER_PACKS } from "@/data/homeMocks";

/**
 * Calcula las noches entre dos fechas YYYY-MM-DD.
 */
export function calcularNoches(fechaEntrada, fechaSalida) {
  if (!fechaEntrada || !fechaSalida) return 0;
  const ms = new Date(fechaSalida) - new Date(fechaEntrada);
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Calcula el total de la reserva con desglose por concepto.
 *
 * Modelo de precio:
 * - Sesiones (atracción): tarifa.precio × personas
 * - Lodge: priceFull × noches (NO escala con personas)
 * - Pack: pack.currentPrice × personas (todo incluido)
 *
 * @returns {{
 *   total: number,
 *   desglose: Array<{ concepto: string, detalle: string, importe: number }>
 * }}
 */
export function calcularTotalReserva(state) {
  const personas = state.personas ?? 1;
  const desglose = [];

  // Caso 1: pack premium
  if (state.esPack) {
    const pack = OFFER_PACKS.find((p) => p.id === state.packId);
    if (!pack) return { total: 0, desglose: [] };

    const importe = pack.currentPrice * personas;
    desglose.push({
      concepto: pack.title,
      detalle: `${pack.currentPrice}€ × ${personas} ${
        personas === 1 ? "persona" : "personas"
      }`,
      importe,
    });

    return { total: importe, desglose };
  }

  // Caso 2: reserva a medida (sesiones + lodge)
  let total = 0;

  if (state.pase?.tarifa) {
    const importe = state.pase.tarifa.precio * personas;
    desglose.push({
      concepto: state.pase.atraccion.nombre,
      detalle: `${state.pase.tarifa.nombre} · ${state.pase.tarifa.precio}€ × ${personas} ${
        personas === 1 ? "persona" : "personas"
      }`,
      importe,
    });
    total += importe;
  }

  if (
    state.lodge?.lodge &&
    state.lodge?.fechaEntrada &&
    state.lodge?.fechaSalida
  ) {
    const noches = calcularNoches(
      state.lodge.fechaEntrada,
      state.lodge.fechaSalida,
    );
    const importe = state.lodge.lodge.priceFull * noches;
    desglose.push({
      concepto: state.lodge.lodge.nombre,
      detalle: `${state.lodge.lodge.priceFull}€ / noche × ${noches} ${
        noches === 1 ? "noche" : "noches"
      }`,
      importe,
    });
    total += importe;
  }

  return { total, desglose };
}

/**
 * Genera un código de reserva legible tipo "DA-2026-A4B7".
 * En producción esto vendría del backend (UUID o secuencia atómica).
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
