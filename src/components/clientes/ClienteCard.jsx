import { motion } from 'framer-motion'
import {
  Calendar,
  IdCard,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react'

/**
 * Card de un Cliente para la vista de gestión (admin / CRM).
 *
 * Diseño:
 *   - Header con avatar de iniciales + nombre + badge activo/inactivo
 *   - Cuerpo con datos de contacto (email, teléfono, DNI) cada uno con su icono
 *   - Footer con fecha de registro
 *   - Acciones flotantes (editar/eliminar) en hover
 *   - Animación de entrada/salida con Framer Motion
 *
 * Como Cliente NO tiene imagen, usamos un avatar con iniciales generadas
 * del nombre + apellidos. Color del avatar: primary (rojo Drive Arena).
 */
export default function ClienteCard({ cliente, onEdit, onDelete }) {
  const initials = getInitials(cliente.nombre, cliente.apellidos)
  const fullName = `${cliente.nombre} ${cliente.apellidos}`.trim()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-card border border-border-strong bg-surface-1 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_30px_-10px_var(--color-primary-glow)]"
    >
      {/* === HEADER === */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar de iniciales */}
          <div className="grid size-12 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-base uppercase tracking-wider text-primary">
            {initials}
          </div>

          <div className="min-w-0">
            <h3
              className="font-display text-lg uppercase tracking-wide text-white line-clamp-1"
              title={fullName}
            >
              {fullName}
            </h3>
            <ActivoBadge activo={cliente.activo} />
          </div>
        </div>

        {/* Acciones — aparecen en hover */}
        <div className="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(cliente)}
            aria-label={`Editar ${fullName}`}
            className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(cliente)}
            aria-label={`Eliminar ${fullName}`}
            className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-danger hover:bg-danger hover:text-white"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </header>

      {/* === DATOS DE CONTACTO === */}
      <div className="space-y-2.5">
        <ContactRow Icon={Mail} value={cliente.email} title={cliente.email} />
        <ContactRow
          Icon={Phone}
          value={cliente.telefono || <span className="italic text-white/30">No registrado</span>}
        />
        <ContactRow
          Icon={IdCard}
          value={
            <span className="font-mono text-white/80">{cliente.dni}</span>
          }
        />
      </div>

      {/* === FOOTER === */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-strong pt-3">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-white/40" />
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
            Registrado
          </span>
        </div>
        <span className="font-mono text-xs text-white/60">
          {formatFecha(cliente.fechaRegistro)}
        </span>
      </div>
    </motion.article>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES
// ═══════════════════════════════════════════════════════════════════════

function ContactRow({ Icon, value, title }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0" title={title}>
      <Icon size={13} className="shrink-0 text-white/40" />
      <span className="font-sans text-sm text-white/70 line-clamp-1 min-w-0">
        {value}
      </span>
    </div>
  )
}

function ActivoBadge({ activo }) {
  if (activo) {
    return (
      <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        Activo
      </span>
    )
  }
  return (
    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white/40">
      <span className="size-1.5 rounded-full bg-white/30" />
      Inactivo
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Genera iniciales a partir de nombre y apellidos.
 * Ej: "Bryan", "Albines Pacheco" → "BA"
 *     "María Sol", "García"      → "MG"
 *     "Lucas"                    → "L"
 */
function getInitials(nombre = '', apellidos = '') {
  const first = nombre.trim().charAt(0).toUpperCase()
  const second = apellidos.trim().charAt(0).toUpperCase()
  return (first + second).slice(0, 2) || '—'
}

function formatFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
