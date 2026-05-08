/**
 * Configuración centralizada del wizard de reserva.
 *
 * El step 2 (Lodge) SIEMPRE se muestra, también en pack mode. Cuando es pack,
 * el lodge y el régimen vienen prerellenados (readonly), pero el usuario tiene
 * que elegir las fechas de su estancia.
 */

export const WIZARD_STEPS = [
  { number: 1, label: "Pase", path: "paso-1" },
  { number: 2, label: "Lodge", path: "paso-2" },
  { number: 3, label: "Datos", path: "paso-3" },
  { number: 4, label: "Confirmación", path: "paso-4" },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;

export function getCurrentStep(pathname) {
  const match = pathname.match(/paso-(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Determina si el state actual del paso N permite avanzar al siguiente.
 *
 * Step 2: incluso en pack mode exige fechas. El lodge y régimen ya vienen
 * llenados por el SET_PACK action, pero las fechas las elige el usuario.
 */
export function isStepComplete(step, state) {
  switch (step) {
    case 1:
      return Boolean(
        state.pase?.atraccion && state.pase?.tarifa && state.personas >= 1,
      );
    case 2:
      return Boolean(
        state.lodge?.lodge &&
          state.lodge?.fechaEntrada &&
          state.lodge?.fechaSalida &&
          state.lodge?.regimen,
      );
    case 3:
      return Boolean(state.cliente);
    case 4:
      return true;
    default:
      return false;
  }
}

/**
 * Calcula el siguiente paso. Ya no salta el step 2 en pack mode.
 */
export function getNextStepNumber(currentStep) {
  return Math.min(currentStep + 1, TOTAL_STEPS);
}

/**
 * Calcula el paso anterior. Ya no salta el step 2 en pack mode.
 */
export function getPrevStepNumber(currentStep) {
  return Math.max(currentStep - 1, 1);
}
