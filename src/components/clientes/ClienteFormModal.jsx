import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Save, X } from 'lucide-react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import {
  clienteFormDefaults,
  clienteSchema,
} from '@/lib/schemas/clienteSchema'

/**
 * Modal de creación/edición de Cliente.
 *
 * Modos:
 *   - Create: cuando `cliente` es null/undefined → llama createCliente(data)
 *   - Edit:   cuando `cliente` es un objeto    → llama updateCliente(id, data)
 *
 * Replica el patrón de LodgeFormModal con simplificaciones:
 *   - Sin campo imagen (cliente no tiene imagenUrl)
 *   - Sin selectores de catálogos externos (todos los campos son escalares)
 *   - Email y DNI con validación de formato (regex en schema)
 *
 * Errores del backend (409 por email/dni duplicado, etc.) → toast del hook,
 * NO cierra el modal para que el usuario pueda corregir.
 */
export default function ClienteFormModal({
  isOpen,
  onClose,
  cliente,
  createCliente,
  updateCliente,
}) {
  const isEditMode = Boolean(cliente)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: clienteFormDefaults,
  })

  // Reset del form al abrir o cambiar de cliente
  useEffect(() => {
    if (!isOpen) return

    if (cliente) {
      reset({
        nombre: cliente.nombre ?? '',
        apellidos: cliente.apellidos ?? '',
        email: cliente.email ?? '',
        telefono: cliente.telefono ?? '',
        dni: cliente.dni ?? '',
      })
    } else {
      reset(clienteFormDefaults)
    }
  }, [isOpen, cliente, reset])

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
      // Limpiar telefono vacío para no enviar string ''
      const payload = { ...data, telefono: data.telefono || null }

      if (isEditMode) {
        await updateCliente(cliente.id, payload)
      } else {
        await createCliente(payload)
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
                  {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <p className="mt-1 truncate font-sans text-xs text-white/50">
                  {isEditMode
                    ? `Modificando "${cliente.nombre} ${cliente.apellidos}"`
                    : 'Registra un nuevo piloto en el sistema'}
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Nombre"
                    required
                    placeholder="Bryan"
                    error={errors.nombre?.message}
                    {...register('nombre')}
                  />

                  <Input
                    label="Apellidos"
                    required
                    placeholder="Albines Pacheco"
                    error={errors.apellidos?.message}
                    {...register('apellidos')}
                  />
                </div>

                <Input
                  type="email"
                  label="Email"
                  required
                  placeholder="bryan@drivearena.com"
                  helperText="Debe ser único en el sistema"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  type="tel"
                  label="Teléfono"
                  placeholder="+34 600 000 000"
                  helperText="Opcional"
                  error={errors.telefono?.message}
                  {...register('telefono')}
                />

                <Input
                  label="DNI"
                  required
                  placeholder="12345678A"
                  helperText="8 dígitos seguidos de una letra (formato español)"
                  error={errors.dni?.message}
                  {...register('dni')}
                />
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
                      {isEditMode ? 'Guardar cambios' : 'Crear cliente'}
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
