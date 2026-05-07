/**
 * Configuración centralizada del wizard de reserva.
 * Compartida entre WizardStepper, WizardNav y los pasos individuales
 * para mantener una única fuente de verdad sobre la estructura.
 */

export const WIZARD_STEPS = [
  { number: 1, label: "Pase", path: "paso-1" },
  { number: 2, label: "Lodge", path: "paso-2" },
  { number: 3, label: "Datos", path: "paso-3" },
  { number: 4, label: "Pago", path: "paso-4" },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;

/**
 * Extrae el número del paso actual desde el pathname.
 * @param {string} pathname - location.pathname de react-router
 * @returns {number} - número de paso (1-4), default 1 si no matchea
 */
export function getCurrentStep(pathname) {
  const match = pathname.match(/paso-(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Determina si el state actual del paso N está "completo" y permite avanzar.
 * Esta función es la fuente de verdad para habilitar el botón Siguiente.
 *
 * @param {number} step - número de paso (1-4)
 * @param {Object} state - state del ReservaContext
 * @returns {boolean}
 */
export function isStepComplete(step, state) {
  switch (step) {
    case 1:
      return Boolean(state.pase?.atraccion && state.pase?.tarifa);
    case 2:
      return Boolean(
        state.lodge?.lodge &&
          state.lodge?.fechaEntrada &&
          state.lodge?.fechaSalida,
      );
    case 3:
      return Boolean(state.cliente);
    case 4:
      // Paso final: siempre "completo" (el submit lo dispara el botón)
      return true;
    default:
      return false;
  }
}
