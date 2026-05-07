import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Button from "@/components/Button";

const HEADER_BG =
  "https://res.cloudinary.com/dutmn3xde/image/upload/v1777374315/email-header_vsr0fl.jpg";

/**
 * Página de éxito post-reserva.
 *
 * Recibe los datos vía `location.state` (pasados por navigate desde
 * Reserva.jsx tras un submit exitoso). Si el usuario llega aquí
 * directamente (sin state), redirige al Home.
 *
 * Layout standalone con la imagen de fondo de Drive Arena + overlay
 * oscuro para garantizar la legibilidad del mensaje de éxito.
 */
function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservaInfo = location.state;

  // Si llegan sin info (ej. F5 o URL directa), redirigir al home
  useEffect(() => {
    if (!reservaInfo) {
      navigate("/", { replace: true });
    }
  }, [reservaInfo, navigate]);

  if (!reservaInfo) return null;

  const { codigoReserva, email, nombre, total } = reservaInfo;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Imagen de fondo Drive Arena */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HEADER_BG})` }}
        aria-hidden="true"
      />

      {/* Overlay oscuro para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg"
        aria-hidden="true"
      />

      {/* Contenido centrado */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-2xl w-full">
          {/* Badge de estado */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
              Reserva Confirmada
            </span>
          </div>

          {/* Título principal */}
          <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight mt-6">
            ¡Nos vemos en la pista
            {nombre ? `, ${nombre}` : ""}!
          </h1>

          {/* Mensaje de email */}
          <p className="text-lg text-text mt-8 max-w-xl mx-auto">
            Tu reserva ha sido registrada con éxito. Te hemos enviado la
            confirmación con todos los detalles a:
          </p>
          <p className="font-mono text-base text-primary mt-2 break-all">
            {email}
          </p>

          {/* Código de reserva destacado */}
          <div className="mt-10 inline-block px-8 py-6 rounded-2xl bg-surface-1/80 backdrop-blur-md border-2 border-primary shadow-2xl shadow-primary/30">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
              Código de reserva
            </p>
            <p className="font-display font-extrabold text-4xl md:text-5xl text-primary mt-2 tracking-tight">
              {codigoReserva}
            </p>
            {total != null && (
              <p className="font-mono text-xs tracking-wider text-text-muted mt-3">
                Total a pagar: {total}€
              </p>
            )}
          </div>

          {/* Aviso pago */}
          <div className="mt-8 p-4 rounded-lg bg-surface-1/60 backdrop-blur-md border border-border-strong max-w-md mx-auto">
            <p className="font-mono text-[10px] tracking-wider uppercase text-primary">
              💰 Pago al llegar
            </p>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              Conserva tu código de reserva. El pago se realiza en el momento
              del check-in en el resort.
            </p>
          </div>

          {/* CTA volver */}
          <div className="mt-12">
            <Button variant="primary" onClick={() => navigate("/")}>
              Volver al Inicio ▶
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Confirmation;
