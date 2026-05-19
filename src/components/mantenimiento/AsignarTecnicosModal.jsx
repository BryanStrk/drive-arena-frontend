import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '@/components/Button'
import { mantenimientosApi } from '@/api/mantenimientos'
import { usuariosApi } from '@/api/usuarios'

export default function AsignarTecnicosModal({ mantenimiento, onClose, onAsignado }) {
  const [tecnicos, setTecnicos] = useState([])
  const [loadingTecnicos, setLoadingTecnicos] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCompletado = mantenimiento?.estado === 'COMPLETADO'

  useEffect(() => {
    if (!mantenimiento) return
    let cancelled = false
    setLoadingTecnicos(true)
    usuariosApi.listTecnicosActivos()
      .then((data) => {
        if (cancelled) return
        setTecnicos(Array.isArray(data) ? data : [])
        const preselected = new Set((mantenimiento.tecnicosAsignados ?? []).map((t) => t.id))
        setSelectedIds(preselected)
      })
      .catch(() => toast.error('No se pudieron cargar los técnicos'))
      .finally(() => { if (!cancelled) setLoadingTecnicos(false) })
    return () => { cancelled = true }
  }, [mantenimiento])

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await mantenimientosApi.asignarTecnicos(mantenimiento.id, [...selectedIds])
      toast.success(selectedIds.size > 0 ? 'Técnicos actualizados' : 'Desasignado (pool compartido)')
      onAsignado()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudieron actualizar los técnicos'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {mantenimiento && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-bg/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
          >
            <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">▌ Asignar técnicos</p>
                <h2 className="mt-0.5 font-display text-xl uppercase tracking-wide text-white line-clamp-1">
                  {mantenimiento.atraccionNombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-primary hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-6">
              {isCompletado ? (
                <p className="py-4 text-center font-sans text-sm text-white/50">
                  Los mantenimientos completados no pueden reasignarse.
                </p>
              ) : loadingTecnicos ? (
                <div className="flex items-center gap-2 py-4 text-white/50">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="font-sans text-sm">Cargando técnicos...</span>
                </div>
              ) : tecnicos.length === 0 ? (
                <p className="py-4 text-center font-sans text-sm text-white/50">
                  No hay técnicos activos disponibles.
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="mb-3 font-sans text-xs text-text-muted">
                    Selecciona uno o varios. Sin selección = pool compartido.
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {tecnicos.map((t) => (
                      <label
                        key={t.id}
                        className="flex cursor-pointer items-center gap-3 rounded-inner px-3 py-2.5 transition-colors hover:bg-surface-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.has(t.id)}
                          onChange={() => toggle(t.id)}
                          className="size-4 accent-primary"
                        />
                        <span className="font-sans text-sm text-text">{t.username}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-border-strong p-6">
              <p className="font-mono text-[10px] text-text-muted">
                {selectedIds.size === 0
                  ? 'Sin asignar (pool)'
                  : `${selectedIds.size} seleccionado${selectedIds.size > 1 ? 's' : ''}`}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                {!isCompletado && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    disabled={isSubmitting || loadingTecnicos}
                  >
                    {isSubmitting
                      ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                      : <><Users size={14} /> Guardar</>}
                  </Button>
                )}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
