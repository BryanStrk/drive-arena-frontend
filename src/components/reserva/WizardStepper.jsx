import { useLocation } from "react-router";
import { useReserva } from "@/context/ReservaContext";
import { WIZARD_STEPS, getCurrentStep } from "./wizardConfig";

/**
 * Stepper visual del wizard de reserva.
 * Cada círculo refleja uno de tres estados:
 * - completed: paso anterior al actual (✓ rojo)
 * - current: paso visible (rojo + ring brillante)
 * - pending: paso futuro (gris + borde sutil)
 *
 * Caso especial: si el usuario seleccionó un pack premium, el paso 2
 * (Lodge) se marca automáticamente como completed porque el alojamiento
 * ya viene incluido en el pack.
 */
function WizardStepper() {
  const { pathname } = useLocation();
  const { state } = useReserva();
  const currentStep = getCurrentStep(pathname);

  return (
    <nav
      aria-label="Progreso de la reserva"
      className="w-full max-w-2xl mx-auto"
    >
      <ol className="flex items-start justify-between">
        {WIZARD_STEPS.map((step, idx) => {
          // Paso 2 se considera "auto-completado" cuando es un pack
          const autoCompleted = state.esPack && step.number === 2;
          const isCompleted = step.number < currentStep || autoCompleted;
          const isCurrent = step.number === currentStep;
          const isLast = idx === WIZARD_STEPS.length - 1;

          // La línea hacia el siguiente paso está coloreada si el paso
          // actual está completed, O si es pack y estamos en paso 1
          // (visualmente "salta" hacia el paso 3)
          const lineCompleted =
            isCompleted || (state.esPack && step.number === 1);

          return (
            <li
              key={step.number}
              className={`flex items-start ${isLast ? "" : "flex-1"}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-mono font-bold text-sm transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/30"
                          : "bg-surface-1 text-text-muted border border-border-strong"
                    }
                  `}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={
                    autoCompleted
                      ? `${step.label} - Incluido en el pack`
                      : undefined
                  }
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <span
                  className={`
                    mt-2 font-mono text-[10px] tracking-[0.2em] uppercase
                    transition-colors duration-300
                    ${isCurrent ? "text-text" : "text-text-muted"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`
                    flex-1 h-[2px] mt-5 mx-2 transition-colors duration-300
                    ${lineCompleted ? "bg-primary" : "bg-border-strong"}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default WizardStepper;
