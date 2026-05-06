import { Link } from "react-router";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

const HERO_BG =
  "https://res.cloudinary.com/dutmn3xde/image/upload/v1777373699/hero-home_mvb26r.jpg";

/**
 * Hero principal del Home público.
 * Imagen cinematográfica de fondo + tagline + CTAs.
 */
function Hero() {
  return (
    <section
      className="relative h-screen min-h-[700px] w-full overflow-hidden"
      aria-label="Drive Arena · Hero"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden="true"
      />

      {/* Overlay para legibilidad del texto */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/30 to-bg"
        aria-hidden="true"
      />

      {/* Top-left badge: status del parque */}
      <div className="absolute top-6 left-6 z-10">
        <Badge variant="success" dot pulse>
          Parque Operativo · Sesión 2026
        </Badge>
      </div>

      {/* Contenido central */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Tagline gigante */}
        <h1 className="font-display font-extrabold text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none">
          CONDUCE
          <span className="text-primary">.</span>{" "}
          <span className="text-primary">COMPITE</span>
          <span className="text-primary">.</span> DOMINA
          <span className="text-primary">.</span>
        </h1>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button variant="primary" size="lg">
              Reservar Pase
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            Ver Circuitos
          </Button>
        </div>
      </div>

      {/* Indicador de scroll abajo (opcional, decorativo) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted">
          Scroll
        </span>
        <span className="block w-[1px] h-10 bg-gradient-to-b from-text-muted to-transparent" />
      </div>
    </section>
  );
}

export default Hero;
