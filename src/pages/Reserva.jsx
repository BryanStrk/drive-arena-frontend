import { Outlet, Link } from "react-router";
import { ReservaProvider } from "@/context/ReservaContext";
import { ASSETS_BRAND } from "@/data/cloudinaryAssets";
import WizardStepper from "@/components/reserva/WizardStepper";
import WizardNav from "@/components/reserva/WizardNav";

/**
 * Página padre del flujo de reserva pública.
 * Layout standalone (sin Navbar/Footer del sitio público) para foco total
 * en la tarea de reserva. Estructura:
 *
 * - Header minimal: logo + botón salir
 * - Stepper visual de progreso
 * - Outlet con el paso actual
 * - WizardNav con botones Atrás/Siguiente
 *
 * El state se comparte entre pasos vía ReservaContext.
 */
function Reserva() {
  return (
    <ReservaProvider>
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

            <WizardNav />
          </div>
        </div>
      </main>
    </ReservaProvider>
  );
}

export default Reserva;
