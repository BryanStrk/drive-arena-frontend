import { forwardRef, useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Save, X } from 'lucide-react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import { atraccionesApi } from '@/api/atracciones'
import { empleadosApi } from '@/api/empleados'
import {
  ESTADOS,
  mantenimientoFormDefaults,
  mantenimientoSchema,
} from '@/lib/schemas/mantenimientoSchema'
import { cn } from '@/lib/cn'

/**
 * Modal de creación/edición de Mantenimiento.
 *
 * Modos:
 *   - Create: cuando `mantenimiento` es null/undefined → crea (estado se fuerza a PENDIENTE)
 *   - Edit:   cuando `mantenimiento` es un objeto    → actualiza (estado editable)
 *
 * Carga al abrir:
 *   - Lista de atracciones (selector de circuito)
 *   - Lista de técnicos (empleados con oficio=TECNICO y soloActivos=true)
 *
 * Campos:
 *   - atraccionId (select)
 *   - tecnicoId (select de técnicos)
 *   - fechaProgramada (input date nativo)
 *   - estado (select, solo visible en EDIT)
 *
 * Errores del backend → toast del hook, NO cierra el modal para corregir.
 */
const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En curso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
}

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

  // Catálogos para los selects
  const [atracciones, setAtracciones] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [isLoadingCatalogos, setIsLoadingCatalogos] = useState(false)

  // Cargar catálogos al abrir el modal
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false

    setIsLoadingCatalogos(true)
    Promise.all([
      atraccionesApi.list(),
      empleadosApi.list({ oficio: 'TECNICO', soloActivos: true }),
    ])
      .then(([atraccionesData, tecnicosData]) => {
        if (cancelled) return
        setAtracciones(atraccionesData)
        setTecnicos(tecnicosData)
      })
      .catch((err) => {
        console.error('Error al cargar catálogos:', err)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCatalogos(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  // Reset del form al abrir o cambiar de mantenimiento
  useEffect(() => {
    if (!isOpen) return

    if (mantenimiento) {
      reset({
        atraccionId: String(mantenimiento.atraccionId ?? ''),
        tecnicoId: String(mantenimiento.tecnicoId ?? ''),
        fechaProgramada: mantenimiento.fechaProgramada ?? '',
        estado: mantenimiento.estado ?? 'PENDIENTE',
      })
    } else {
      reset(mantenimientoFormDefaults)
    }
  }, [isOpen, mantenimiento, reset])

  // Bloqueo de scroll + ESC para cerrar
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting, onClose])

  const onSubmit = async (data) => {
    try {
      // En CREATE el backend ignora el estado y fuerza PENDIENTE,
      // así que lo dejamos pasar tal cual viene del form.
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-border-strong bg-surface-1 shadow-2xl"
          >
            {/* HEADER */}
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

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-5 overflow-y-auto p-6">
                {isLoadingCatalogos ? (
                  <div className="flex items-center gap-2 text-white/50">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="font-sans text-sm">
                      Cargando circuitos y técnicos...
                    </span>
                  </div>
                ) : (
                  <>
                    <SelectField
                      label="Circuito"
                      required
                      options={[
                        {
                          value: '',
                          label: 'Selecciona un circuito',
                          disabled: true,
                        },
                        ...atracciones.map((a) => ({
                          value: String(a.id),
                          label: a.nombre,
                        })),
                      ]}
                      error={errors.atraccionId?.message}
                      {...register('atraccionId')}
                    />

                    <SelectField
                      label="Técnico asignado"
                      required
                      helperText="Solo se muestran empleados con oficio TÉCNICO activos"
                      options={[
                        {
                          value: '',
                          label:
                            tecnicos.length === 0
                              ? 'No hay técnicos disponibles'
                              : 'Selecciona un técnico',
                          disabled: true,
                        },
                        ...tecnicos.map((t) => ({
                          value: String(t.id),
                          label: formatTecnicoLabel(t),
                        })),
                      ]}
                      error={errors.tecnicoId?.message}
                      {...register('tecnicoId')}
                    />

                    <Input
                      type="date"
                      label="Fecha programada"
                      required
                      error={errors.fechaProgramada?.message}
                      {...register('fechaProgramada')}
                    />

                    {isEditMode && (
                      <SelectField
                        label="Estado"
                        required
                        helperText="En creación el estado siempre se inicia como PENDIENTE"
                        options={ESTADOS.map((value) => ({
                          value,
                          label: ESTADO_LABELS[value],
                        }))}
                        error={errors.estado?.message}
                        {...register('estado')}
                      />
                    )}
                  </>
                )}
              </div>

              {/* FOOTER */}
              <footer className="flex items-center justify-end gap-3 border-t border-border-strong bg-surface-1 p-6">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || isLoadingCatalogos}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      {isEditMode ? 'Guardar cambios' : 'Programar'}
                    </>
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

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function formatTecnicoLabel(tecnico) {
  // Adapta el campo según el shape exacto del EmpleadoResponseDto.
  // Los nombres más probables:
  //   - tecnico.nombre + tecnico.apellidos
  //   - tecnico.dni
  const nombre = tecnico.nombre ?? ''
  const apellidos = tecnico.apellidos ?? ''
  const fullName = `${nombre} ${apellidos}`.trim()
  return tecnico.dni ? `${fullName} · ${tecnico.dni}` : fullName
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTE PRIVADO
// ═══════════════════════════════════════════════════════════════════════

const SelectField = forwardRef(function SelectField(
  {
    label,
    error,
    helperText,
    required = false,
    options,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp || generatedId
  const hasError = Boolean(error)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block font-sans text-sm font-medium text-text"
        >
          {label}
          {required && (
            <span className="ml-1 text-primary" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <select
        ref={ref}
        id={id}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={cn(
          'w-full px-4 py-3',
          'bg-surface-2 font-sans text-sm text-text',
          'rounded-inner border transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/30'
            : 'border-border-strong focus:border-primary focus:ring-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...rest}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-surface-2 text-text"
          >
            {option.label}
          </option>
        ))}
      </select>

      {!hasError && helperText && (
        <p
          id={`${id}-helper`}
          className="mt-2 font-mono text-[10px] tracking-wider text-text-muted"
        >
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-danger"
        >
          <span aria-hidden="true">▶</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})
