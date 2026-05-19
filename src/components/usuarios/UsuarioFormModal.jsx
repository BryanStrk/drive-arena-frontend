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

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres'),
  rol: z.enum(['ADMIN', 'TAQUILLA', 'TECNICO'], { required_error: 'Selecciona un rol' }),
})

const DEFAULTS = { username: '', password: '', rol: 'TAQUILLA' }

export default function UsuarioFormModal({ isOpen, onClose, onCreated }) {
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const onSubmit = async (data) => {
    try {
      await usuariosApi.create(data)
      toast.success(`Usuario ${data.username} creado`)
      reset(DEFAULTS)
      onCreated()
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message
      toast.error(
        status === 409
          ? (msg ?? `El username "${data.username}" ya existe`)
          : (msg ?? 'No se pudo crear el usuario')
      )
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
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                  ▌ Nuevo usuario
                </p>
                <h2 className="mt-0.5 font-display text-2xl uppercase tracking-wide text-text">
                  Registrar usuario
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
                <Input
                  label="Username"
                  required
                  placeholder="operador01"
                  helperText="3-20 chars · solo letras, números y _"
                  error={errors.username?.message}
                  {...register('username')}
                />

                {/* Password with show/hide */}
                <div className="relative">
                  <Input
                    label="Contraseña"
                    required
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    helperText="Mínimo 8 caracteres"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-9 text-text-muted hover:text-text transition-colors"
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Rol radios */}
                <fieldset>
                  <legend className="block font-sans text-sm font-medium text-text mb-3">
                    Rol <span className="text-primary ml-1">*</span>
                  </legend>
                  <div className="flex gap-4">
                    {['ADMIN', 'TAQUILLA', 'TECNICO'].map((r) => (
                      <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          value={r}
                          {...register('rol')}
                          className="accent-primary"
                        />
                        <span className={`font-mono text-sm ${r === 'TECNICO' ? 'text-orange-400' : 'text-text'}`}>{r}</span>
                      </label>
                    ))}
                  </div>
                  {errors.rol && (
                    <p className="mt-2 font-mono text-[10px] tracking-wider text-danger flex items-center gap-1.5">
                      <span>▶</span> {errors.rol.message}
                    </p>
                  )}
                </fieldset>
              </div>

              {/* Footer */}
              <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
                <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Creando...</> : 'Crear usuario'}
                </Button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
