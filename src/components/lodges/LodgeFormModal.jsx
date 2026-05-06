import { forwardRef, useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Save, X } from 'lucide-react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import { lodgeFormDefaults, lodgeSchema } from '@/lib/schemas/lodgeSchema'
import { cn } from '@/lib/cn'

/**
 * Modal de creación/edición de Lodge.
 *
 * Modos:
 *   - Create: cuando `lodge` es null/undefined → llama createLodge(data)
 *   - Edit:   cuando `lodge` es un objeto    → llama updateLodge(id, data)
 *
 * Props:
 *   - isOpen: boolean — controla la visibilidad
 *   - onClose: () => void — callback al cerrar (X, ESC, click backdrop, cancelar)
 *   - lodge: object | null — si presente, modo edición con sus datos precargados
 *   - createLodge: async (payload) => Lodge — del hook useLodges
 *   - updateLodge: async (id, payload) => Lodge — del hook useLodges
 *
 * Comportamiento:
 *   - El form usa zodResolver(lodgeSchema) para validación con mensajes en ES.
 *   - Reset automático al abrir/cerrar y al cambiar de lodge.
 *   - Body scroll lock mientras está abierto.
 *   - ESC cierra el modal (excepto durante submit).
 *   - Click en backdrop cierra; click en el contenido del modal NO cierra.
 *   - Errores del backend → el hook ya muestra toast.error y NO cerramos
 *     el modal para que el usuario pueda corregir.
 *   - Preview de imagen en vivo mientras se escribe la URL.
 */
export default function LodgeFormModal({
  isOpen,
  onClose,
  lodge,
  createLodge,
  updateLodge,
}) {
  const isEditMode = Boolean(lodge)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(lodgeSchema),
    defaultValues: lodgeFormDefaults,
  })

  // Resetear form al abrir el modal o cambiar de lodge
  useEffect(() => {
    if (!isOpen) return

    if (lodge) {
      reset({
        nombre: lodge.nombre ?? '',
        descripcion: lodge.descripcion ?? '',
        direccion: lodge.direccion ?? '',
        capacidadTotal: lodge.capacidadTotal ?? '',
        precioMediaPension: lodge.precioMediaPension ?? '',
        precioPensionCompleta: lodge.precioPensionCompleta ?? '',
        imagenUrl: lodge.imagenUrl ?? '',
      })
    } else {
      reset(lodgeFormDefaults)
    }
  }, [isOpen, lodge, reset])

  // Bloqueo de scroll del body + ESC para cerrar
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
        await updateLodge(lodge.id, data)
      } else {
        await createLodge(data)
      }
      onClose()
    } catch {
      // El hook useLodges ya muestra el toast de error.
      // No cerramos el modal para que el usuario pueda corregir y reintentar.
    }
  }

  // Watch del campo imagenUrl para preview en vivo
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
                  {isEditMode ? 'Editar Lodge' : 'Nuevo Lodge'}
                </h2>
                <p className="mt-1 truncate font-sans text-xs text-white/50">
                  {isEditMode
                    ? `Modificando "${lodge.nombre}"`
                    : 'Crea un nuevo alojamiento del resort'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Cerrar modal"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-white/60 transition-colors hover:border-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                  placeholder="Apex Lodge"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />

                <TextareaField
                  label="Descripción"
                  required
                  rows={3}
                  placeholder="Lodge premium con vistas al circuito principal..."
                  error={errors.descripcion?.message}
                  {...register('descripcion')}
                />

                <Input
                  label="Dirección"
                  required
                  placeholder="Drive Arena Resort, Av. Velocidad 1, Barcelona"
                  error={errors.direccion?.message}
                  {...register('direccion')}
                />

                <Input
                  type="number"
                  label="Capacidad total"
                  required
                  placeholder="150"
                  helperText="Número de huéspedes que el lodge puede alojar"
                  error={errors.capacidadTotal?.message}
                  {...register('capacidadTotal')}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="number"
                    step="0.01"
                    label="Media pensión (€)"
                    required
                    placeholder="120.00"
                    error={errors.precioMediaPension?.message}
                    {...register('precioMediaPension')}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    label="Pensión completa (€)"
                    required
                    placeholder="165.00"
                    error={errors.precioPensionCompleta?.message}
                    {...register('precioPensionCompleta')}
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
                      {isEditMode ? 'Guardar cambios' : 'Crear lodge'}
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
// SUB-COMPONENTE PRIVADO
// ═══════════════════════════════════════════════════════════════════════

/**
 * Textarea con el mismo lenguaje visual que el componente Input compartido.
 * No se exporta porque solo se usa dentro de este modal. Si en el futuro
 * más formularios necesitan textarea, mover a `src/components/Textarea.jsx`.
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
