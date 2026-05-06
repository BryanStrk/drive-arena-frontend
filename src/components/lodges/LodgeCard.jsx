import { motion } from 'framer-motion'
import { MapPin, Pencil, Trash2, Users } from 'lucide-react'

/**
 * Formatea un precio numérico a EUR con el locale español.
 * Definida fuera del componente para no recrearla en cada render.
 */
const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formatPrice = (value) => {
  if (value == null) return '—'
  const number = typeof value === 'string' ? Number(value) : value
  return Number.isNaN(number) ? '—' : priceFormatter.format(number)
}

/**
 * Card de un Lodge para la vista de gestión (admin).
 *
 * Recibe:
 *   - lodge: objeto HotelResponseDto del backend
 *   - onEdit(lodge): callback al pulsar Editar
 *   - onDelete(lodge): callback al pulsar Eliminar (la página gestiona el confirm)
 *
 * Diseño:
 *   - Imagen 16:9 con fallback gradient si falla la carga
 *   - Glassmorphism en badge de capacidad y botones de acción
 *   - Acciones flotantes que aparecen en hover (UI desktop)
 *   - Animación de entrada/salida con Framer Motion (layout transitions)
 *   - Precio de pensión completa destacado en color primary (más caro = focal point)
 */
export default function LodgeCard({ lodge, onEdit, onDelete }) {
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
        <img
          src={lodge.imagenUrl}
          alt={lodge.nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.opacity = '0'
          }}
          className="absolute inset-0 size-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay para legibilidad de los badges sobre imagen clara */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/30" />

        {/* Badge de capacidad — top right */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-bg/70 px-3 py-1 backdrop-blur-md">
          <Users size={13} className="text-primary" strokeWidth={2.5} />
          <span className="font-mono text-xs font-semibold text-white">
            {lodge.capacidadTotal}
          </span>
        </div>

        {/* Acciones — top left, aparecen en hover (desktop) */}
        <div className="absolute left-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(lodge)}
            aria-label={`Editar ${lodge.nombre}`}
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-bg/70 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(lodge)}
            aria-label={`Eliminar ${lodge.nombre}`}
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
            title={lodge.nombre}
          >
            {lodge.nombre}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={12} className="shrink-0" />
            <span className="line-clamp-1">{lodge.direccion}</span>
          </p>
        </header>

        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
          {lodge.descripcion}
        </p>

        {/* === PRECIOS === */}
        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border-strong pt-3">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
              Media P.
            </p>
            <p className="font-mono text-base font-semibold text-white">
              {formatPrice(lodge.precioMediaPension)}
            </p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
              Completa
            </p>
            <p className="font-mono text-base font-semibold text-primary">
              {formatPrice(lodge.precioPensionCompleta)}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
