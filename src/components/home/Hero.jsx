import { Link } from "react-router";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

const HERO_BG =
  "https://res.cloudinary.com/dutmn3xde/image/upload/v1777373699/hero-home_mvb26r.jpg";

const HERO_VIDEO =
  "https://res.cloudinary.com/dutmn3xde/video/upload/v1778182159/kling_20260508_%E4%BD%9C%E5%93%81_Cinematic__861_0_yisumh.mp4";

/**
 * Hero principal del Home público.
 * Video cinematográfico de fondo (con poster fallback) + tagline + CTAs.
 *
 * Nota técnica: el `transform: scale(1.10)` con `transformOrigin: 'top left'`
 * recorta el video hacia abajo y a la derecha para esconder la marca de agua
 * de KlingAI (esquina inferior derecha). Si subimos el video sin marca en el
 * futuro, eliminar el style del transform.
 */
function Hero() {
  return (
    <section
      className="relative h-screen min-h-[700px] w-full overflow-hidden"
      aria-label="Drive Arena · Hero"
    >
      {/* Video de fondo cinematográfico */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: 'scale(1.10)',
          transformOrigin: 'top left',
        }}
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_BG}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

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
