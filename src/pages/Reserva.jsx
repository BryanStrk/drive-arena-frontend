import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import {
  ReservaProvider,
  useReserva,
  RESERVA_ACTIONS,
} from "@/context/ReservaContext";
import { ASSETS_BRAND } from "@/data/cloudinaryAssets";
import WizardStepper from "@/components/reserva/WizardStepper";
import WizardNav from "@/components/reserva/WizardNav";
import {
  calcularTotalReserva,
  generarCodigoReserva,
} from "@/utils/reservaCalc";

/**
 * Layout interno del wizard. Se separa del componente Reserva para poder
 * usar `useReserva()` (el hook necesita estar dentro del Provider).
 */
function ReservaContent() {
  const { state, dispatch } = useReserva();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handler de confirmación de reserva (paso 4).
   *
   * MOCK: simula un envío al backend con 1.5s de delay.
   * En producción, reemplazar por una llamada axios:
   *   await reservaApi.crear(payload)
   * El backend devolvería el código y enviaría el email vía JavaMailSender.
   */
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Generar código y calcular total ANTES del reset del state
    const codigoReserva = generarCodigoReserva();
    const { total } = calcularTotalReserva(state);
    const navData = {
      codigoReserva,
      email: state.cliente?.email,
      nombre: state.cliente?.nombre,
      total,
    };

    // Simular envío al backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Logs de debug (eliminar al integrar backend real)
    console.log("📧 [MOCK] Email enviado a:", state.cliente?.email);
    console.log("📋 [MOCK] Código de reserva:", codigoReserva);
    console.log("📦 [MOCK] Payload enviado:", state);

    // Reset del wizard ANTES de navegar (Confirmation está fuera del Provider)
    dispatch({ type: RESERVA_ACTIONS.RESET });

    // Navegar a la página de éxito pasando los datos vía state
    navigate("/reserva-confirmada", { state: navData });
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      {/* Header minimal con logo + salida */}
      <header className="border-b border-border-strong px-6 py-4 flex items-center justify-between">
        <Link to="/" aria-label="Volver al inicio">
          <img
            src={ASSETS_BRAND.logo}
            alt="Drive Arena"
            className="h-8 w-auto"
          />
        </Link>
        <Link
          to="/"
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted hover:text-text transition-colors"
        >
          Salir ✕
        </Link>
      </header>

      {/* Wizard area */}
      <div className="flex-1 flex flex-col py-12 px-6">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          <WizardStepper />

          <div className="mt-12 flex-1">
            <Outlet />
          </div>

          <WizardNav onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </main>
  );
}

/**
 * Página padre del flujo de reserva pública.
 * Solo envuelve el contenido en el ReservaProvider.
 */
function Reserva() {
  return (
    <ReservaProvider>
      <ReservaContent />
    </ReservaProvider>
  );
}

export default Reserva;
