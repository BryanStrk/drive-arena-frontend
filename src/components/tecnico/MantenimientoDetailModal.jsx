import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, ArrowRight, Calendar, User, Wrench, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'

import { mantenimientosApi } from '@/api/mantenimientos'
import { useAuth } from '@/context/useAuth'
import Button from '@/components/Button'

const ESTADO_CONFIG = {
  PENDIENTE:  { label: 'Pendiente',  badgeClass: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
  EN_CURSO:   { label: 'En curso',   badgeClass: 'border-blue-400/40 bg-blue-400/10 text-blue-300' },
  COMPLETADO: { label: 'Completado', badgeClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' },
  CANCELADO:  { label: 'Cancelado',  badgeClass: 'border-white/15 bg-white/5 text-white/50' },
}

const TRANSITIONS = {
  PENDIENTE: { next: 'EN_CURSO',   label: 'Iniciar' },
  EN_CURSO:  { next: 'COMPLETADO', label: 'Completar' },
}

function fmtFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function MantenimientoDetailModal({ mantenimiento, onClose, onUpdated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const config = ESTADO_CONFIG[mantenimiento.estado] ?? ESTADO_CONFIG.PENDIENTE
  const transition = TRANSITIONS[mantenimiento.estado]
  const tecnicosAsignados = mantenimiento.tecnicosAsignados ?? []
  const isPool = tecnicosAsignados.length === 0
  const canTomar = isPool && mantenimiento.estado !== 'COMPLETADO' && mantenimiento.estado !== 'CANCELADO'

  const handleTomar = async () => {
    setLoading(true)
    try {
      await mantenimientosApi.asignarTecnicos(mantenimiento.id, [user.userId])
      toast.success('Tarea tomada correctamente')
      onUpdated()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo tomar la tarea'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleTransition = async () => {
    if (!transition) return
    setLoading(true)
    try {
      await mantenimientosApi.changeEstado(mantenimiento.id, transition.next)
      toast.success(`Mantenimiento marcado como ${ESTADO_CONFIG[transition.next]?.label}`)
      onUpdated()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo actualizar el estado'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
        >
          {/* Header */}
          <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">▌ Mantenimiento</p>
              <h2 className="mt-0.5 font-display text-2xl uppercase tracking-wide text-text line-clamp-2">
                {mantenimiento.atraccionNombre}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-text-muted transition-colors hover:border-primary hover:text-text"
            >
              <X size={16} />
            </button>
          </header>

          {/* Body */}
          <div className="space-y-4 p-6">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${config.badgeClass}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                {config.label}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <dt className="mb-1 flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  <User size={11} /> Técnicos
                </dt>
                {tecnicosAsignados.length === 0 ? (
                  <dd className="font-sans text-sm italic text-white/30">Pool compartido</dd>
                ) : (
                  <dd className="flex flex-wrap gap-1.5">
                    {tecnicosAsignados.map((t) => (
                      <span
                        key={t.id}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-2.5 py-0.5 font-mono text-[10px] text-white/70"
                      >
                        {t.username}
                      </span>
                    ))}
                  </dd>
                )}
              </div>
              <div>
                <dt className="mb-1 flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  <Calendar size={11} /> Programado
                </dt>
                <dd className="font-mono text-sm text-text">{fmtFecha(mantenimiento.fechaProgramada)}</dd>
              </div>
              {mantenimiento.descripcion && (
                <div className="col-span-2">
                  <dt className="mb-1 flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-text-muted">
                    <Wrench size={11} /> Descripción
                  </dt>
                  <dd className="font-sans text-sm leading-relaxed text-text-muted">
                    {mantenimiento.descripcion}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
            <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
              Cerrar
            </Button>
            {canTomar && (
              <Button variant="secondary" size="md" onClick={handleTomar} disabled={loading}>
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Tomando...</>
                  : <><UserCheck size={14} /> Tomar tarea</>}
              </Button>
            )}
            {transition && (
              <Button variant="primary" size="md" onClick={handleTransition} disabled={loading}>
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Actualizando...</>
                  : <><ArrowRight size={14} /> {transition.label}</>}
              </Button>
            )}
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
