import { motion } from 'framer-motion'
import { Flag, Pencil, Trash2, Wrench } from 'lucide-react'

/**
 * Configuración visual por tamaño de atracción.
 * Cada tamaño tiene un color de badge distinto para distinción rápida.
 */
const TAMANO_CONFIG = {
  GRANDE: {
    label: 'Grande',
    badgeClass: 'border-primary/40 bg-primary/10 text-primary',
  },
  MEDIANA: {
    label: 'Mediana',
    badgeClass: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  },
  PEQUENA: {
    label: 'Pequeña',
    badgeClass: 'border-white/20 bg-white/5 text-white/60',
  },
}

/**
 * Card de una Atracción (circuito) para la vista de gestión (admin).
 *
 * Recibe:
 *   - atraccion: objeto AtraccionResponseDto del backend
 *   - onEdit(atraccion): callback al pulsar Editar
 *   - onDelete(atraccion): callback al pulsar Eliminar
 *
 * Diseño (consistente con LodgeCard):
 *   - Imagen 16:9 con fallback gradient si falla la carga
 *   - Glassmorphism en badge de tamaño y botones de acción
 *   - Acciones flotantes que aparecen en hover (UI desktop)
 *   - Animación de entrada/salida con Framer Motion
 *   - Footer con frecuencia de revisión (icono Wrench + días)
 */
export default function AtraccionCard({ atraccion, onEdit, onDelete }) {
  const tamanoConfig =
    TAMANO_CONFIG[atraccion.tamano] ?? TAMANO_CONFIG.MEDIANA

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-border-strong bg-surface-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_30px_-10px_var(--color-primary-glow)]"
    >
      {/* === IMAGEN === */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-surface-2 to-bg">
        {atraccion.imagenUrl && (
          <img
            src={atraccion.imagenUrl}
            alt={atraccion.nombre}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.opacity = '0'
            }}
            className="absolute inset-0 size-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        )}

        {/* Gradient overlay para legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/30" />

        {/* Badge de tamaño — top right */}
        <div
          className={`absolute right-3 top-3 inline-flex items-center rounded-full border px-3 py-1 backdrop-blur-md ${tamanoConfig.badgeClass}`}
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {tamanoConfig.label}
          </span>
        </div>

        {/* Acciones — top left, aparecen en hover */}
        <div className="absolute left-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(atraccion)}
            aria-label={`Editar ${atraccion.nombre}`}
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-bg/70 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(atraccion)}
            aria-label={`Eliminar ${atraccion.nombre}`}
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-bg/70 text-white backdrop-blur-md transition-colors hover:border-danger hover:bg-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* === CUERPO === */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <header className="space-y-1">
          <h3
            className="font-display text-xl uppercase tracking-wide text-white line-clamp-1"
            title={atraccion.nombre}
          >
            {atraccion.nombre}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-white/50">
            <Flag size={12} className="shrink-0" />
            <span>Circuito #{atraccion.id}</span>
          </p>
        </header>

        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
          {atraccion.descripcion || (
            <span className="italic text-white/30">Sin descripción</span>
          )}
        </p>

        {/* === FOOTER: frecuencia de revisión === */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-strong pt-3">
          <div className="flex items-center gap-2">
            <Wrench size={14} className="text-white/40" />
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
              Revisión
            </span>
          </div>
          <span className="font-mono text-base font-semibold text-white">
            {atraccion.frecuenciaRevisionDias}
            <span className="ml-1 text-xs font-normal text-white/50">días</span>
          </span>
        </div>
      </div>
    </motion.article>
  )
}
