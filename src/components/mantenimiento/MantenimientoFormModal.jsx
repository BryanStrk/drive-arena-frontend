import { forwardRef, useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Save, X } from 'lucide-react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import { atraccionesApi } from '@/api/atracciones'
import {
  mantenimientoFormDefaults,
  mantenimientoSchema,
} from '@/lib/schemas/mantenimientoSchema'
import { cn } from '@/lib/cn'

export default function MantenimientoFormModal({
  isOpen,
  onClose,
  mantenimiento,
  createMantenimiento,
  updateMantenimiento,
}) {
  const isEditMode = Boolean(mantenimiento)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mantenimientoSchema),
    defaultValues: mantenimientoFormDefaults,
  })

  const [atracciones, setAtracciones] = useState([])
  const [isLoadingCatalogos, setIsLoadingCatalogos] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false

    setIsLoadingCatalogos(true)
    atraccionesApi.list()
      .then((data) => {
        if (cancelled) return
        setAtracciones(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoadingCatalogos(false) })

    return () => { cancelled = true }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (mantenimiento) {
      reset({
        atraccionId:     String(mantenimiento.atraccionId ?? ''),
        fechaProgramada: mantenimiento.fechaProgramada ?? '',
        descripcion:     mantenimiento.descripcion ?? '',
      })
    } else {
      reset(mantenimientoFormDefaults)
    }
  }, [isOpen, mantenimiento, reset])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape' && !isSubmitting) onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, isSubmitting, onClose])

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateMantenimiento(mantenimiento.id, data)
      } else {
        await createMantenimiento(data)
      }
      onClose()
    } catch {
      // El hook ya muestra el toast de error.
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6">
              <div className="min-w-0">
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                  {isEditMode ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
                </h2>
                <p className="mt-1 truncate font-sans text-xs text-white/50">
                  {isEditMode
                    ? `Modificando mantenimiento #${mantenimiento.id}`
                    : 'Programa un nuevo mantenimiento'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Cerrar modal"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-5 overflow-y-auto p-6">
                {isLoadingCatalogos ? (
                  <div className="flex items-center gap-2 text-white/50">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="font-sans text-sm">Cargando circuitos...</span>
                  </div>
                ) : (
                  <>
                    <SelectField
                      label="Circuito"
                      required
                      options={[
                        { value: '', label: 'Selecciona un circuito', disabled: true },
                        ...atracciones.map((a) => ({ value: String(a.id), label: a.nombre })),
                      ]}
                      error={errors.atraccionId?.message}
                      {...register('atraccionId')}
                    />

                    <Input
                      type="date"
                      label="Fecha programada"
                      required
                      error={errors.fechaProgramada?.message}
                      {...register('fechaProgramada')}
                    />

                    <TextareaField
                      label="Descripción"
                      helperText="Opcional · máx. 500 caracteres"
                      placeholder="Describe la tarea o problema..."
                      error={errors.descripcion?.message}
                      {...register('descripcion')}
                    />
                  </>
                )}
              </div>

              {/* Footer */}
              <footer className="flex items-center justify-end gap-3 border-t border-border-strong bg-surface-1 p-6">
                <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || isLoadingCatalogos}
                >
                  {isSubmitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                  ) : (
                    <><Save size={14} /> {isEditMode ? 'Guardar cambios' : 'Programar'}</>
                  )}
                </Button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Sub-componentes privados ─────────────────────────────────────────────

const SelectField = forwardRef(function SelectField(
  { label, error, helperText, required = false, options, className, id: idProp, ...rest },
  ref,
) {
  const generatedId = useId()
  const id = idProp || generatedId
  const hasError = Boolean(error)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block font-sans text-sm font-medium text-text">
          {label}
          {required && <span className="ml-1 text-primary" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        aria-invalid={hasError}
        className={cn(
          'w-full px-4 py-3 bg-surface-2 font-sans text-sm text-text rounded-inner border transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/30'
            : 'border-border-strong focus:border-primary focus:ring-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled} className="bg-surface-2 text-text">
            {o.label}
          </option>
        ))}
      </select>
      {!hasError && helperText && (
        <p className="mt-2 font-mono text-[10px] tracking-wider text-text-muted">{helperText}</p>
      )}
      {hasError && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-danger">
          <span aria-hidden="true">▶</span> {error}
        </p>
      )}
    </div>
  )
})

const TextareaField = forwardRef(function TextareaField(
  { label, error, helperText, placeholder, className, id: idProp, ...rest },
  ref,
) {
  const generatedId = useId()
  const id = idProp || generatedId
  const hasError = Boolean(error)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block font-sans text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={3}
        placeholder={placeholder}
        aria-invalid={hasError}
        className={cn(
          'w-full px-4 py-3 bg-surface-2 font-sans text-sm text-text placeholder:text-text-dim rounded-inner border resize-none transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/30'
            : 'border-border-strong focus:border-primary focus:ring-primary/30',
        )}
        {...rest}
      />
      {!hasError && helperText && (
        <p className="mt-2 font-mono text-[10px] tracking-wider text-text-muted">{helperText}</p>
      )}
      {hasError && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-danger">
          <span aria-hidden="true">▶</span> {error}
        </p>
      )}
    </div>
  )
})
