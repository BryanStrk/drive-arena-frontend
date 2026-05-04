import { Link } from 'react-router'
import Button from '@/components/Button'
import Badge from '@/components/Badge'

/**
 * Login (placeholder).
 * Será reemplazada por la implementación completa en feature/page-login.
 */
function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Badge de WIP */}
      <Badge variant="warning" dot pulse>
        WORK IN PROGRESS
      </Badge>

      {/* Eyebrow */}
      <p className="font-mono text-primary text-xs tracking-[0.3em] uppercase mt-8">
        ▌ Acceso al sistema
      </p>

      {/* Heading */}
      <h1 className="font-display font-extrabold text-6xl tracking-tight leading-none mt-4">
        IDENTIFICA TU OPERADOR
      </h1>

      {/* Línea decorativa */}
      <div className="h-[2px] w-32 bg-primary shadow-[0_0_10px_var(--color-primary-glow)] mt-8" />

      {/* Status mono */}
      <p className="font-mono text-text-muted text-xs tracking-[0.3em] uppercase mt-8">
        // LOGIN :: PENDING_IMPLEMENTATION
      </p>

      <p className="text-text-muted mt-3 max-w-md">
        El formulario de login con JWT y validación se implementará en la siguiente feature, después de la auth context.
      </p>

      {/* CTA volver a home */}
      <div className="mt-10">
        <Link to="/">
          <Button variant="secondary">← Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}

export default Login