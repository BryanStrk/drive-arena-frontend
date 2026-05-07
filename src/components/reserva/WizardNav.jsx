import { useNavigate, useLocation } from "react-router";
import Button from "@/components/Button";
import { useReserva } from "@/context/ReservaContext";
import {
  TOTAL_STEPS,
  getCurrentStep,
  getNextStepNumber,
  getPrevStepNumber,
  isStepComplete,
} from "./wizardConfig";

/**
 * Navegación entre pasos del wizard.
 *
 * @param {Function} [onSubmit] - Callback disparado en paso 4 al confirmar
 * @param {boolean} [isSubmitting] - Si true, muestra estado loading en el botón
 */
function WizardNav({ onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { state } = useReserva();

  const currentStep = getCurrentStep(pathname);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const canAdvance = isStepComplete(currentStep, state);

  const handlePrev = () => {
    if (isFirstStep || isSubmitting) return;
    const prevStep = getPrevStepNumber(currentStep, state);
    navigate(`/reservar/paso-${prevStep}`);
  };

  const handleNext = () => {
    if (!canAdvance || isSubmitting) return;

    if (isLastStep) {
      onSubmit?.();
      return;
    }

    const nextStep = getNextStepNumber(currentStep, state);
    navigate(`/reservar/paso-${nextStep}`);
  };

  // Texto del botón principal según contexto
  const nextButtonLabel = (() => {
    if (isSubmitting) return "Procesando...";
    if (isLastStep) return "Confirmar Reserva ▶▶";
    return "Siguiente ▶";
  })();

  return (
    <nav
      aria-label="Navegación entre pasos"
      className="flex items-center justify-between mt-12 pt-6 border-t border-border-strong"
    >
      <Button
        variant="ghost"
        onClick={handlePrev}
        disabled={isFirstStep || isSubmitting}
      >
        ◀ Atrás
      </Button>

      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!canAdvance || isSubmitting}
      >
        {nextButtonLabel}
      </Button>
    </nav>
  );
}

export default WizardNav;
