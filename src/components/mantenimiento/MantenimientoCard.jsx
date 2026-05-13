import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  Pencil,
  PlayCircle,
  Trash2,
  UserPlus,
  Wrench,
  XCircle,
} from 'lucide-react'

/**
 * Configuración visual por estado de mantenimiento.
 * Cada estado tiene icono, color de border y color de badge propios.
 */
const ESTADO_CONFIG = {
  PENDIENTE: {
    label: 'Pendiente',
    Icon: CircleDashed,
    badgeClass: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
    accentClass: 'border-l-amber-400/60',
  },
  EN_CURSO: {
    label: 'En curso',
    Icon: PlayCircle,
    badgeClass: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    accentClass: 'border-l-blue-400/60',
  },
  COMPLETADO: {
    label: 'Completado',
    Icon: CheckCircle2,
    badgeClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    accentClass: 'border-l-emerald-400/60',
  },
  CANCELADO: {
    label: 'Cancelado',
    Icon: XCircle,
    badgeClass: 'border-white/15 bg-white/5 text-white/50',
    accentClass: 'border-l-white/20',
  },
}

const TAMANO_LABEL = {
  GRANDE: 'Grande',
  MEDIANA: 'Mediana',
  PEQUENA: 'Pequeña',
}

/**
 * Card de un Mantenimiento para la vista operativa.
 *
 * Diseño:
 *   - Border-left coloreado según estado (acento visual rápido)
 *   - Badge de estado con icono Lucide en la esquina superior
 *   - Datos del circuito y técnico asignado
 *   - Fecha programada destacada con icono Calendar
 *   - Acciones (editar/eliminar) en hover
 *   - Animación de entrada/salida con Framer Motion
 */
export default function MantenimientoCard({ mantenimiento, onEdit, onDelete, onAsignar }) {
  const config = ESTADO_CONFIG[mantenimiento.estado] ?? ESTADO_CONFIG.PENDIENTE
  const { Icon } = config

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative flex flex-col overflow-hidden rounded-card border border-l-4 border-border-strong ${config.accentClass} bg-surface-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60`}
    >
      <div className="flex flex-col gap-4 p-5">
        {/* Header: badge de estado + acciones */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${config.badgeClass}`}
          >
            <Icon size={12} strokeWidth={2.5} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
              {config.label}
            </span>
          </div>

          <div className="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
            {onAsignar && (
              <button
                type="button"
                onClick={() => onAsignar(mantenimiento)}
                aria-label="Asignar técnico"
                className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-blue-400 hover:bg-blue-400/20 hover:text-blue-300"
              >
                <UserPlus size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit?.(mantenimiento)}
              aria-label="Editar mantenimiento"
              className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Pencil size={12} />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(mantenimiento)}
              aria-label="Eliminar mantenimiento"
              className="grid size-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-danger hover:bg-danger hover:text-white"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Circuito */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            <Wrench size={12} />
            <span>Circuito</span>
          </div>
          <h3
            className="font-display text-xl uppercase tracking-wide text-white line-clamp-1"
            title={mantenimiento.atraccionNombre}
          >
            {mantenimiento.atraccionNombre}
          </h3>
          {mantenimiento.atraccionTamano && (
            <p className="font-sans text-xs text-white/40">
              Tamaño {TAMANO_LABEL[mantenimiento.atraccionTamano]}
            </p>
          )}
        </div>

        {/* Footer: técnicos + fecha */}
        <div className="grid grid-cols-2 gap-3 border-t border-border-strong pt-3">
          <div className="space-y-1.5">
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
              Técnico
            </p>
            {(mantenimiento.tecnicosAsignados ?? []).length === 0 ? (
              <p className="font-sans text-sm italic text-white/30">Sin asignar</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {mantenimiento.tecnicosAsignados.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-2 py-0.5 font-mono text-[9px] text-white/70"
                  >
                    {t.username}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-0.5 text-right">
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/40">
              Programado
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <Calendar size={12} className="text-white/40" />
              <p className="font-mono text-sm text-white">
                {formatFecha(mantenimiento.fechaProgramada)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function formatFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
