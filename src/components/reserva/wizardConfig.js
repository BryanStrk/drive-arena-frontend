/**
 * Configuración centralizada del wizard de reserva.
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
 * Caso especial: si `esPack`, el paso 2 (Lodge) se considera completado
 * automáticamente porque el lodge viene incluido en el pack.
 */
export function isStepComplete(step, state) {
  switch (step) {
    case 1:
      return Boolean(
        state.pase?.atraccion && state.pase?.tarifa && state.personas >= 1,
      );
    case 2:
      if (state.esPack) return true;
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
 * Calcula el siguiente paso, saltando paso 2 si la reserva es un pack.
 */
export function getNextStepNumber(currentStep, state) {
  if (state.esPack && currentStep === 1) return 3;
  return Math.min(currentStep + 1, TOTAL_STEPS);
}

/**
 * Calcula el paso anterior, saltando paso 2 si la reserva es un pack.
 */
export function getPrevStepNumber(currentStep, state) {
  if (state.esPack && currentStep === 3) return 1;
  return Math.max(currentStep - 1, 1);
}
