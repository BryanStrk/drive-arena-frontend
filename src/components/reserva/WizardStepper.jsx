import { useLocation } from "react-router";
import { WIZARD_STEPS, getCurrentStep } from "./wizardConfig";

/**
 * Stepper visual del wizard de reserva.
 * Muestra 4 círculos numerados conectados por líneas. Cada círculo
 * refleja uno de tres estados:
 * - completed: paso anterior al actual → check + color primary
 * - current: paso visible → número + ring brillante
 * - pending: paso futuro → número en gris + borde sutil
 *
 * El paso actual se infiere de la URL para que el componente sea autónomo.
 */
function WizardStepper() {
  const { pathname } = useLocation();
  const currentStep = getCurrentStep(pathname);

  return (
    <nav
      aria-label="Progreso de la reserva"
      className="w-full max-w-2xl mx-auto"
    >
      <ol className="flex items-start justify-between">
        {WIZARD_STEPS.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isLast = idx === WIZARD_STEPS.length - 1;

          return (
            <li
              key={step.number}
              className={`flex items-start ${isLast ? "" : "flex-1"}`}
            >
              {/* Step indicator (círculo + label) */}
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

              {/* Línea conectora hacia el siguiente step */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-[2px] mt-5 mx-2 transition-colors duration-300
                    ${isCompleted ? "bg-primary" : "bg-border-strong"}
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
