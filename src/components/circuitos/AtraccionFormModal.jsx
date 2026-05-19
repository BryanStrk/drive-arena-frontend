import { forwardRef, useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Save, X } from 'lucide-react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import {
  atraccionFormDefaults,
  atraccionSchema,
  TAMANOS,
} from '@/lib/schemas/atraccionSchema'
import { cn } from '@/lib/cn'

/**
 * Modal de creación/edición de Atracción (circuito).
 *
 * Modos:
 *   - Create: cuando `atraccion` es null/undefined → llama createAtraccion(data)
 *   - Edit:   cuando `atraccion` es un objeto    → llama updateAtraccion(id, data)
 *
 * Replica el patrón de LodgeFormModal con dos diferencias clave:
 *   - Campo `tamano` como SELECT (enum GRANDE/MEDIANA/PEQUENA)
 *   - Campo `frecuenciaRevisionDias` como number
 *
 * Comportamiento idéntico a LodgeFormModal en el resto:
 *   - Body scroll lock + ESC para cerrar
 *   - Reset al abrir/cambiar de atracción
 *   - Preview de imagen en vivo
 *   - Errores del backend → toast del hook, NO cierra el modal
 */
const TAMANO_LABELS = {
  GRANDE: 'Grande',
  MEDIANA: 'Mediana',
  PEQUENA: 'Pequeña',
}

export default function AtraccionFormModal({
  isOpen,
  onClose,
  atraccion,
  createAtraccion,
  updateAtraccion,
}) {
  const isEditMode = Boolean(atraccion)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(atraccionSchema),
    defaultValues: atraccionFormDefaults,
  })

  // Resetear form al abrir o cambiar de atracción
  useEffect(() => {
    if (!isOpen) return

    if (atraccion) {
      reset({
        nombre: atraccion.nombre ?? '',
        descripcion: atraccion.descripcion ?? '',
        tamano: atraccion.tamano ?? 'MEDIANA',
        frecuenciaRevisionDias: atraccion.frecuenciaRevisionDias ?? 30,
        imagenUrl: atraccion.imagenUrl ?? '',
      })
    } else {
      reset(atraccionFormDefaults)
    }
  }, [isOpen, atraccion, reset])

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
      if (isEditMode) {
        await updateAtraccion(atraccion.id, data)
      } else {
        await createAtraccion(data)
      }
      onClose()
    } catch {
      // El hook ya muestra el toast de error.
    }
  }

  const imagenUrlValue = watch('imagenUrl')

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
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
          >
            {/* HEADER */}
            <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6">
              <div className="min-w-0">
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                  {isEditMode ? 'Editar Circuito' : 'Nuevo Circuito'}
                </h2>
                <p className="mt-1 truncate font-sans text-xs text-white/50">
                  {isEditMode
                    ? `Modificando "${atraccion.nombre}"`
                    : 'Crea un nuevo circuito del parque'}
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
                <Input
                  label="Nombre"
                  required
                  placeholder="Phantom GT"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />

                <TextareaField
                  label="Descripción"
                  required
                  rows={3}
                  placeholder="Circuito de alta velocidad con curvas técnicas..."
                  error={errors.descripcion?.message}
                  {...register('descripcion')}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Tamaño"
                    required
                    options={TAMANOS.map((value) => ({
                      value,
                      label: TAMANO_LABELS[value],
                    }))}
                    error={errors.tamano?.message}
                    {...register('tamano')}
                  />

                  <Input
                    type="number"
                    label="Revisión cada (días)"
                    required
                    placeholder="30"
                    helperText="Frecuencia de mantenimiento"
                    error={errors.frecuenciaRevisionDias?.message}
                    {...register('frecuenciaRevisionDias')}
                  />
                </div>

                <div className="space-y-3">
                  <Input
                    type="url"
                    label="URL de la imagen"
                    required
                    placeholder="https://res.cloudinary.com/dutmn3xde/..."
                    helperText="URL completa de Cloudinary u otra CDN"
                    error={errors.imagenUrl?.message}
                    {...register('imagenUrl')}
                  />

                  {imagenUrlValue && !errors.imagenUrl && (
                    <div className="overflow-hidden rounded-inner border border-border-strong bg-surface-2">
                      <div className="aspect-video">
                        <img
                          src={imagenUrlValue}
                          alt="Vista previa"
                          className="size-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.opacity = '0'
                          }}
                          onLoad={(event) => {
                            event.currentTarget.style.opacity = '1'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      {isEditMode ? 'Guardar cambios' : 'Crear circuito'}
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
// SUB-COMPONENTES PRIVADOS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Select con el mismo lenguaje visual que el componente Input compartido.
 * Privado del módulo. Si más formularios lo necesitan, mover a
 * `src/components/Select.jsx`.
 */
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

/**
 * Textarea con el mismo lenguaje visual que el Input compartido.
 * Privado del módulo (idem que en LodgeFormModal).
 */
const TextareaField = forwardRef(function TextareaField(
  {
    label,
    error,
    helperText,
    required = false,
    rows = 3,
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

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={cn(
          'w-full resize-none px-4 py-3',
          'bg-surface-2 font-sans text-sm text-text placeholder:text-text-dim',
          'rounded-inner border transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/30'
            : 'border-border-strong focus:border-primary focus:ring-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...rest}
      />

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
