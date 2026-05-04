import { Link } from 'react-router'
import Button from '@/components/Button'
import Badge from '@/components/Badge'

/**
 * Página 404 — circuito no encontrado.
 *
 * Estética temática del resort: la ruta solicitada "no existe en el circuito".
 * Incluye Badge top-left consistente con el resto de páginas públicas.
 */
function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-bg overflow-hidden">
      {/* Badge de estado del sistema (top-left, consistente con resto de páginas) */}
      <div className="absolute top-6 left-6 z-20">
        <Badge variant="danger" dot pulse>
          Error · Circuito No Encontrado
        </Badge>
      </div>

      {/* Patrón de fondo sutil con grid de puntos */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="relative z-10 max-w-2xl text-center">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Sector Restringido · Acceso Denegado
        </p>

        {/* 404 gigante */}
        <h1 className="mt-6 font-display font-extrabold text-text leading-none">
          <span className="block text-[12rem] tracking-tight text-primary drop-shadow-[0_0_40px_rgba(224,22,43,0.3)]">
            404
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 font-display text-3xl tracking-tight text-text">
          Ruta fuera del circuito
        </p>

        {/* Descripción */}
        <p className="mt-4 font-sans text-base text-text-muted max-w-md mx-auto">
          La dirección que has solicitado no existe en el sistema operativo
          de Drive Arena. Comprueba la URL o vuelve al inicio.
        </p>

        {/* CTA volver al inicio */}
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="relative z-10 absolute bottom-12 font-mono text-[10px] tracking-widest uppercase text-text-dim">
        © 2026 Drive Arena Resort
      </footer>
    </div>
  )
}

export default NotFound
