import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

import { usuariosApi } from '@/api/usuarios'
import Button from '@/components/Button'

const schema = z.object({
  rol: z.enum(['ADMIN', 'TAQUILLA']),
})

export default function EditarRolModal({ usuario, currentUserId, onClose, onUpdated }) {
  const isSelf = usuario?.id === currentUserId

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rol: usuario?.rol ?? 'TAQUILLA' },
  })

  // Sync when usuario changes
  useEffect(() => {
    reset({ rol: usuario?.rol ?? 'TAQUILLA' })
  }, [usuario, reset])

  const onSubmit = async (data) => {
    try {
      await usuariosApi.updateRol(usuario.id, data.rol)
      toast.success('Rol actualizado correctamente')
      onUpdated()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo actualizar el rol'
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
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Editar rol
              </p>
              <h2 className="mt-0.5 font-display text-2xl uppercase tracking-wide text-text">
                {usuario?.username}
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              {isSelf && (
                <div className="flex items-start gap-2.5 rounded-inner border border-warning/30 bg-warning/10 p-3">
                  <AlertTriangle size={15} className="text-warning shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-warning">
                    No puedes cambiar tu propio rol
                  </p>
                </div>
              )}

              <fieldset disabled={isSelf || isSubmitting}>
                <legend className="block font-sans text-sm font-medium text-text mb-3">
                  Selecciona el nuevo rol
                </legend>
                <div className="flex gap-6">
                  {['ADMIN', 'TAQUILLA'].map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed">
                      <input
                        type="radio"
                        value={r}
                        {...register('rol')}
                        className="accent-primary"
                      />
                      <span className="font-mono text-sm text-text">{r}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSelf || isSubmitting}
              >
                {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Guardar rol'}
              </Button>
            </footer>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
