import { Outlet, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import { ASSETS_BRAND } from '@/data/cloudinaryAssets'
import Button from '@/components/Button'
import packageJson from '../../package.json'

const APP_VERSION = packageJson.version

export default function TecnicoLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 h-14 border-b border-border-strong bg-surface-1/95 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/tecnico/mantenimientos')}
            className="block transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            aria-label="Ir al inicio"
          >
            <img
              src={ASSETS_BRAND.logo}
              alt="Drive Arena"
              className="h-7 w-auto"
              style={{ mixBlendMode: 'lighten' }}
            />
          </button>
          <div className="hidden sm:block">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-400">▌ Técnico</p>
            <p className="font-display text-sm uppercase tracking-wide text-text leading-none">
              {user?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-text-dim">
            v{APP_VERSION}
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="min-h-[calc(100vh-3.5rem)]">
        <Outlet />
      </main>
    </div>
  )
}
