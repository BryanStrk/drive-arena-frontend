import { useNavigate, useLocation } from "react-router";
import Button from "@/components/Button";
import { useReserva } from "@/context/ReservaContext";
import {
  TOTAL_STEPS,
  getCurrentStep,
  isStepComplete,
} from "./wizardConfig";

/**
 * Navegación entre pasos del wizard.
 * - "Atrás" → paso anterior (deshabilitado en paso 1)
 * - "Siguiente" → paso siguiente, deshabilitado si el paso actual no está
 *   completo según `isStepComplete()` del wizardConfig
 * - En el último paso, "Siguiente" se transforma en "Confirmar Reserva"
 *   y dispara el callback `onSubmit` si está definido (Bloque C)
 *
 * @param {Function} [onSubmit] - Callback opcional disparado en paso 4
 */
function WizardNav({ onSubmit }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { state } = useReserva();

  const currentStep = getCurrentStep(pathname);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const canAdvance = isStepComplete(currentStep, state);

  const handlePrev = () => {
    if (isFirstStep) return;
    navigate(`/reservar/paso-${currentStep - 1}`);
  };

  const handleNext = () => {
    if (!canAdvance) return;

    if (isLastStep) {
      onSubmit?.();
      return;
    }

    navigate(`/reservar/paso-${currentStep + 1}`);
  };

  return (
    <nav
      aria-label="Navegación entre pasos"
      className="flex items-center justify-between mt-12 pt-6 border-t border-border-strong"
    >
      <Button variant="ghost" onClick={handlePrev} disabled={isFirstStep}>
        ◀ Atrás
      </Button>

      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!canAdvance}
      >
        {isLastStep ? "Confirmar Reserva ▶▶" : "Siguiente ▶"}
      </Button>
    </nav>
  );
}

export default WizardNav;
