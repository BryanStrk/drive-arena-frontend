import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { usuariosApi } from '@/api/usuarios'
import Button from '@/components/Button'
import Input from '@/components/Input'

const schema = z
  .object({
    newPassword:     z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la contraseña'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const DEFAULTS = { newPassword: '', confirmPassword: '' }

export default function ResetPasswordModal({ usuario, onClose, onUpdated }) {
  const [showNew,  setShowNew]  = useState(false)
  const [showConf, setShowConf] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const onSubmit = async (data) => {
    try {
      await usuariosApi.resetPassword(usuario.id, data.newPassword)
      toast.success('Contraseña actualizada correctamente')
      reset(DEFAULTS)
      onUpdated()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo actualizar la contraseña'
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
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Resetear contraseña
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-5">
              {/* New password */}
              <div className="relative">
                <Input
                  label="Nueva contraseña"
                  required
                  type={showNew ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text transition-colors"
                  aria-label={showNew ? 'Ocultar' : 'Mostrar'}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Confirm */}
              <div className="relative">
                <Input
                  label="Confirmar contraseña"
                  required
                  type={showConf ? 'text' : 'password'}
                  placeholder="Repite la contraseña"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((v) => !v)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text transition-colors"
                  aria-label={showConf ? 'Ocultar' : 'Mostrar'}
                >
                  {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting
                  ? <><Loader2 size={14} className="animate-spin" /> Actualizando...</>
                  : 'Actualizar contraseña'}
              </Button>
            </footer>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
