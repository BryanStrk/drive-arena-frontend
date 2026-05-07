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
 */
export function getCurrentStep(pathname) {
  const match = pathname.match(/paso-(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Determina si el state actual del paso N permite avanzar al siguiente.
 * Caso especial: si `esPack` es true, el paso 2 (Lodge) se considera
 * completado automáticamente porque el lodge viene incluido en el pack.
 */
export function isStepComplete(step, state) {
  switch (step) {
    case 1:
      return Boolean(state.pase?.atraccion && state.pase?.tarifa);
    case 2:
      // Si es pack, el lodge ya viene incluido → paso completado
      if (state.esPack) return true;
      return Boolean(
        state.lodge?.lodge &&
          state.lodge?.fechaEntrada &&
          state.lodge?.fechaSalida,
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
 * Calcula el siguiente paso al que navegar.
 * Si el usuario ha seleccionado un pack, salta el paso 2 (Lodge) porque
 * el alojamiento ya viene incluido. Paso 1 → Paso 3 directo.
 */
export function getNextStepNumber(currentStep, state) {
  if (state.esPack && currentStep === 1) return 3;
  return Math.min(currentStep + 1, TOTAL_STEPS);
}

/**
 * Calcula el paso anterior al que navegar.
 * Inverso del salto: si esPack y estamos en paso 3, volvemos al 1.
 */
export function getPrevStepNumber(currentStep, state) {
  if (state.esPack && currentStep === 3) return 1;
  return Math.max(currentStep - 1, 1);
}
