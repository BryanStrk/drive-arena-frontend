import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, UserCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '@/components/Button'
import { mantenimientosApi } from '@/api/mantenimientos'
import { usuariosApi } from '@/api/usuarios'

export default function AsignarTecnicoModal({ mantenimiento, onClose, onAsignado }) {
  const [tecnicos, setTecnicos] = useState([])
  const [loadingTecnicos, setLoadingTecnicos] = useState(true)
  const [selectedId, setSelectedId] = useState('')
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
        setSelectedId(mantenimiento.tecnicoAsignadoId ? String(mantenimiento.tecnicoAsignadoId) : '')
      })
      .catch(() => toast.error('No se pudieron cargar los técnicos'))
      .finally(() => { if (!cancelled) setLoadingTecnicos(false) })
    return () => { cancelled = true }
  }, [mantenimiento])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const tecnicoId = selectedId ? Number(selectedId) : null
      await mantenimientosApi.asignarTecnico(mantenimiento.id, tecnicoId)
      toast.success(tecnicoId ? 'Técnico asignado correctamente' : 'Desasignado (pool compartido)')
      onAsignado()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo asignar el técnico'
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-card border border-border-strong bg-surface-1 shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">▌ Asignar técnico</p>
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
              ) : (
                <div className="space-y-2">
                  <label className="block font-sans text-sm font-medium text-text">
                    Asignar a
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full rounded-inner border border-border-strong bg-surface-2 px-4 py-3 font-sans text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Sin asignar (pool compartido)</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={String(t.id)}>{t.username}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
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
                    : <><UserCheck size={14} /> Asignar</>}
                </Button>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
