import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  ReservaProvider,
  useReserva,
  RESERVA_ACTIONS,
} from "@/context/ReservaContext";
import Logo from '@/components/Logo'
import WizardStepper from "@/components/reserva/WizardStepper";
import WizardNav from "@/components/reserva/WizardNav";
import { crearReservaPublica } from "@/api/reservaApi";
import { extractApiError } from "@/utils/extractApiError";

/**
 * Transforma el state del wizard al payload que espera el backend.
 *
 * El state guarda OBJETOS completos (atraccion, tarifa, lodge) por comodidad
 * de la UI. El backend solo necesita los IDs.
 *
 * IMPORTANTE: el backend valida @NotNull en estos campos. Si alguno falla
 * la validación de step en el wizard, el submit no debería ejecutarse — pero
 * por defensa, los optional chaining devuelven null y el backend dará un 400
 * legible vía extractApiError.
 */
function buildPayloadFromState(state) {
  return {
    cliente: state.cliente,
    personas: state.personas,
    pase: {
      atraccionId: state.pase?.atraccion?.id ?? null,
      tarifaId: state.pase?.tarifa?.id ?? null,
    },
    lodge: {
      hotelId: state.lodge?.lodge?.id ?? null,
      fechaEntrada: state.lodge?.fechaEntrada ?? null,
      fechaSalida: state.lodge?.fechaSalida ?? null,
      regimen: state.lodge?.regimen ?? null,
    },
    packId: state.packId ?? null,
  };
}

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
   * Llama al endpoint POST /api/reservas del backend que:
   * 1. Hace UPSERT del cliente por email/DNI
   * 2. Crea la Compra con código único DA-YYYY-XXXX
   * 3. Dispara email de confirmación (async, best-effort)
   * 4. Devuelve { codigoReserva, total, mensaje }
   *
   * El backend es AUTORITATIVO: el código y el total que mostramos en la
   * página de confirmación vienen de su response, no del cálculo local.
   *
   * En caso de error muestra toast y mantiene los datos del wizard para
   * que el usuario pueda corregir y reintentar (no reseteamos state).
   */
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = buildPayloadFromState(state);

    try {
      const response = await crearReservaPublica(payload);

      // El backend es autoritativo: usa SU código y total (no los del frontend)
      const navData = {
        codigoReserva: response.codigoReserva,
        total: response.total,
        nombre: state.cliente?.nombre,
        email: state.cliente?.email,
      };

      // Reset del wizard ANTES de navegar (Confirmation está fuera del Provider)
      dispatch({ type: RESERVA_ACTIONS.RESET });

      // Navegar a la página de éxito pasando los datos vía state
      navigate("/reserva-confirmada", { state: navData });
    } catch (error) {
      const mensaje = extractApiError(error);
      // id fijo evita que se apilen toasts si el usuario reintenta varias veces.
      toast.error(mensaje, { id: "reserva-error", duration: 5000 });
      setIsSubmitting(false); // permitir reintentar
    }
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      {/* Header minimal con logo + salida */}
      <header className="border-b border-border-strong px-6 py-4 flex items-center justify-between">
        <Link to="/" aria-label="Volver al inicio">
          <Logo className="h-8 w-auto text-text" />
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
