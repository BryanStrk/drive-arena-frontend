import { Link } from 'react-router'
import Button from '@/components/Button'

/**
 * Página 404 — ruta no encontrada.
 * Estética motorsport: "circuito desconocido".
 */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Código 404 gigante */}
      <h1 className="font-display font-extrabold text-[200px] leading-none tracking-tight text-primary drop-shadow-[0_0_30px_var(--color-primary-glow)]">
        404
      </h1>

      {/* Línea separadora */}
      <div className="h-[2px] w-32 bg-primary shadow-[0_0_10px_var(--color-primary-glow)] mt-2" />

      {/* Mensaje principal */}
      <h2 className="font-display font-bold text-4xl text-text mt-8 tracking-tight">
        CIRCUITO NO ENCONTRADO
      </h2>

      {/* Mensaje secundario en mono */}
      <p className="font-mono text-text-muted text-xs tracking-[0.25em] uppercase mt-4 max-w-md">
        // ERROR_CODE :: ROUTE_NOT_FOUND
      </p>

      <p className="text-text-muted mt-2 max-w-md">
        La ruta que buscas no existe en nuestro circuito. Vuelve al pit lane principal.
      </p>

      {/* CTA de vuelta a Home */}
      <div className="mt-10 flex gap-3">
        <Link to="/">
          <Button variant="primary">← Volver al inicio</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Acceder al sistema</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound