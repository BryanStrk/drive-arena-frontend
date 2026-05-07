import { Outlet, Link } from "react-router";
import { ReservaProvider } from "@/context/ReservaContext";
import { ASSETS_BRAND } from "@/data/cloudinaryAssets";

/**
 * Página padre del flujo de reserva pública.
 * Envuelve los pasos en el ReservaProvider para compartir el state
 * entre las sub-rutas (/reservar/paso-1 ... /paso-4).
 *
 * Layout standalone (sin Navbar/Footer del sitio público) para mantener
 * foco total del usuario en la tarea de reserva. Solo un header minimal
 * con el logo + link de salida.
 *
 * El Stepper visual y la navegación entre pasos se añaden en BLOQUE A2.
 */
function Reserva() {
  return (
    <ReservaProvider>
      <main className="min-h-screen bg-bg flex flex-col">
        {/* Header minimal con logo + botón de salida */}
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

        {/* Contenido del paso actual */}
        <div className="flex-1 flex flex-col py-12 px-6">
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
            {/* TODO: Stepper visual aquí (Bloque A2) */}

            <div className="mt-8 flex-1">
              <Outlet />
            </div>

            {/* TODO: WizardNav aquí (Bloque A2) */}
          </div>
        </div>
      </main>
    </ReservaProvider>
  );
}

export default Reserva;
