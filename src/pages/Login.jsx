import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Badge from '@/components/Badge'
import { ASSETS_HERO } from '@/data/cloudinaryAssets'
import { loginSchema } from '@/lib/validators'

/**
 * Pantalla de Login del sistema operativo Drive Arena.
 * Acceso para operadores con rol ADMIN o TAQUILLA.
 *
 * En este commit:
 * - Formulario validado con react-hook-form + zod (loginSchema)
 * - Validación on blur + on submit
 * - Estados de loading durante el submit
 * - Errores inline bajo cada input
 *
 * El submit todavía NO conecta al backend — solo simula con setTimeout.
 * La integración con la API se hace en el commit del axios client.
 */
function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  /**
   * Handler invocado por handleSubmit cuando los datos pasan validación Zod.
   * @param {{ username: string, password: string }} data
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    // Simulamos llamada al backend (sustituiremos en commit del axios client)
    console.log('Submitting login with:', data)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Login simulado completado.')
    setIsSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex flex-col px-6 py-12 overflow-hidden">
      {/* Background con imagen Cloudinary nítida */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${ASSETS_HERO.loginBg})` }}
        aria-hidden="true"
      />

      {/* Vignetting top + bottom para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
        aria-hidden="true"
      />

      {/* Badge de estado del sistema (top-left, consistente con resto de páginas) */}
      <div className="absolute top-6 left-6 z-20">
        <Badge variant="success" dot pulse>
          Acceso Restringido
        </Badge>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Logo principal */}
        <h1 className="font-display font-extrabold text-7xl tracking-tight text-text drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          DRIVE ARENA
        </h1>

        {/* Tagline con líneas rojas */}
        <div className="mt-4 flex items-center gap-3">
          <span className="block h-[2px] w-10 bg-primary" aria-hidden="true" />
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted">
            Conduce · Compite · Domina
          </p>
          <span className="block h-[2px] w-10 bg-primary" aria-hidden="true" />
        </div>

        {/* Card del formulario */}
        <section
          aria-labelledby="login-heading"
          className="mt-12 w-full bg-surface-1/90 backdrop-blur-md border border-border-strong rounded-card p-8 shadow-2xl shadow-bg/70"
        >
          {/* Eyebrow + heading */}
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Acceso al sistema
          </p>
          <h2
            id="login-heading"
            className="mt-2 font-display font-bold text-3xl tracking-tight text-text"
          >
            Identifica tu operador
          </h2>

          {/* Línea separadora */}
          <hr className="mt-5 border-border-strong" />

          {/* Form fields */}
          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              eyebrow="Operador"
              type="text"
              placeholder="ID de Operador"
              autoComplete="username"
              autoFocus
              disabled={isSubmitting}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              eyebrow="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              error={errors.password?.message}
              {...register('password')}
            />

            {/* CTA submit con estado loading */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Accediendo...' : 'Acceder al sistema'}
            </Button>
          </form>

          {/* Footer card: badges de estado */}
          <div className="mt-6 pt-5 border-t border-border-strong flex items-center justify-between text-[10px]">
            <Badge variant="success" dot size="xs">
              Conexión Segura
            </Badge>
            <span className="font-mono tracking-widest uppercase text-text-muted">
              Soporte 24/7
            </span>
          </div>
        </section>

        {/* Link de vuelta al Home */}
        <Link
          to="/"
          className="mt-8 font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted hover:text-primary transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>

      {/* Footer minimal de página */}
      <footer className="relative z-10 mt-12 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-text-dim">
        <span>© 2026 Drive Arena Resort · All Rights Reserved</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-text transition-colors">Privacidad</a>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:text-text transition-colors">Términos</a>
        </div>
      </footer>
    </div>
  )
}

export default Login
