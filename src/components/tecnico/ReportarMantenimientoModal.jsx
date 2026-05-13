import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { mantenimientosApi } from '@/api/mantenimientos'
import { atraccionesApi } from '@/api/atracciones'
import { empleadosApi } from '@/api/empleados'
import Button from '@/components/Button'

const schema = z.object({
  atraccionId:     z.string().min(1, 'Selecciona un circuito'),
  tecnicoId:       z.string().min(1, 'Selecciona un técnico'),
  fechaProgramada: z.string().min(1, 'Indica la fecha programada'),
})

const DEFAULTS = { atraccionId: '', tecnicoId: '', fechaProgramada: '' }

const fieldClass = 'w-full px-4 py-3 bg-surface-2 font-sans text-sm text-text rounded-inner border border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

export default function ReportarMantenimientoModal({ onClose, onCreated }) {
  const [atracciones, setAtracciones] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [loadingCatalogos, setLoadingCatalogos] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      atraccionesApi.list(),
      empleadosApi.list({ oficio: 'TECNICO', soloActivos: true }),
    ])
      .then(([atrs, tecs]) => {
        if (cancelled) return
        setAtracciones(Array.isArray(atrs) ? atrs : [])
        setTecnicos(Array.isArray(tecs) ? tecs : [])
      })
      .catch(() => toast.error('Error al cargar circuitos y técnicos'))
      .finally(() => { if (!cancelled) setLoadingCatalogos(false) })
    return () => { cancelled = true }
  }, [])

  const onSubmit = async ({ atraccionId, tecnicoId, fechaProgramada }) => {
    try {
      await mantenimientosApi.create({
        atraccionId:     Number(atraccionId),
        tecnicoId:       Number(tecnicoId),
        fechaProgramada,
      })
      toast.success('Mantenimiento reportado')
      onCreated()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo reportar el mantenimiento'
      toast.error(msg)
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-card border border-border-strong bg-surface-1 shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">▌ Reportar</p>
              <h2 className="mt-0.5 font-display text-2xl uppercase tracking-wide text-text">
                Nuevo Mantenimiento
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-5">
              {loadingCatalogos ? (
                <div className="flex items-center gap-2 text-text-muted py-4">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="font-sans text-sm">Cargando circuitos y técnicos...</span>
                </div>
              ) : (
                <>
                  {/* Circuito */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-text mb-2">
                      Circuito <span className="text-primary ml-1">*</span>
                    </label>
                    <select {...register('atraccionId')} className={fieldClass}>
                      <option value="">Selecciona un circuito</option>
                      {atracciones.map((a) => (
                        <option key={a.id} value={String(a.id)}>{a.nombre}</option>
                      ))}
                    </select>
                    {errors.atraccionId && (
                      <p className="mt-1 font-mono text-[10px] text-danger">▶ {errors.atraccionId.message}</p>
                    )}
                  </div>

                  {/* Técnico */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-text mb-2">
                      Técnico asignado <span className="text-primary ml-1">*</span>
                    </label>
                    <select {...register('tecnicoId')} className={fieldClass}>
                      <option value="">
                        {tecnicos.length === 0 ? 'No hay técnicos disponibles' : 'Selecciona un técnico'}
                      </option>
                      {tecnicos.map((t) => {
                        const fullName = `${t.nombre ?? ''} ${t.apellidos ?? ''}`.trim()
                        const label = t.dni ? `${fullName} · ${t.dni}` : fullName
                        return <option key={t.id} value={String(t.id)}>{label}</option>
                      })}
                    </select>
                    {errors.tecnicoId && (
                      <p className="mt-1 font-mono text-[10px] text-danger">▶ {errors.tecnicoId.message}</p>
                    )}
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-text mb-2">
                      Fecha programada <span className="text-primary ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('fechaProgramada')}
                      className={fieldClass}
                    />
                    {errors.fechaProgramada && (
                      <p className="mt-1 font-mono text-[10px] text-danger">▶ {errors.fechaProgramada.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || loadingCatalogos}
              >
                {isSubmitting
                  ? <><Loader2 size={14} className="animate-spin" /> Reportando...</>
                  : 'Reportar'}
              </Button>
            </footer>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
