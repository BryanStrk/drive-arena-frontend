import { Link } from 'react-router'
import Button from '@/components/Button'
import Badge from '@/components/Badge'

/**
 * Home pública (placeholder).
 * Será reemplazada por la implementación completa en feature/page-home-public.
 */
function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Badge de WIP */}
      <Badge variant="warning" dot pulse>
        WORK IN PROGRESS
      </Badge>

      {/* Logo principal */}
      <h1 className="font-display font-extrabold text-8xl tracking-tight leading-none mt-8">
        DRIVE <span className="text-primary">ARENA</span>
      </h1>

      {/* Tagline (la del mockup) */}
      <p className="font-display font-bold text-2xl tracking-[0.2em] uppercase text-text-muted mt-6">
        Conduce <span className="text-primary">·</span> Compite <span className="text-primary">·</span> Domina
      </p>

      {/* Línea decorativa */}
      <div className="h-[2px] w-32 bg-primary shadow-[0_0_10px_var(--color-primary-glow)] mt-8" />

      {/* Status mono */}
      <p className="font-mono text-text-muted text-xs tracking-[0.3em] uppercase mt-8">
        // HOME_PUBLIC :: PENDING_IMPLEMENTATION
      </p>

      <p className="text-text-muted mt-3 max-w-md">
        El home público con experiencias, ranking, packs y lodges se implementará en la próxima feature.
      </p>

      {/* CTA al Login mientras tanto */}
      <div className="mt-10">
        <Link to="/login">
          <Button variant="primary">Acceder al sistema →</Button>
        </Link>
      </div>
    </div>
  )
}

export default Home