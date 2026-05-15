import { useState, useEffect, useCallback, useRef } from 'react'
import {
  RefreshCw, AlertCircle, Search, Users, Plus,
  ChevronLeft, ChevronRight, Pencil, KeyRound, Power,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/useAuth'
import { usuariosApi } from '@/api/usuarios'
import UsuarioFormModal from '@/components/usuarios/UsuarioFormModal'
import EditarRolModal from '@/components/usuarios/EditarRolModal'
import ResetPasswordModal from '@/components/usuarios/ResetPasswordModal'
import ConfirmModal from '@/components/usuarios/ConfirmModal'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

const PAGE_SIZE = 15

const EMPTY_PAGE_INFO = { totalPages: 1, totalElements: 0, number: 0, first: true, last: true }

const ROL_CHIPS  = [
  { label: 'Todos',    value: '' },
  { label: 'Admin',    value: 'ADMIN' },
  { label: 'Taquilla', value: 'TAQUILLA' },
]
const ACTIVO_CHIPS = [
  { label: 'Todos',    value: '' },
  { label: 'Activos',  value: 'true' },
  { label: 'Inactivos', value: 'false' },
]

const COLS = ['Username', 'Rol', 'Estado', 'Creado', 'Acciones']

function SkeletonRow() {
  return (
    <tr>
      {COLS.map((c) => (
        <td key={c} className="px-4 py-3">
          <div className="h-4 rounded bg-surface-2 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

function RolBadge({ rol }) {
  const isAdmin = rol === 'ADMIN'
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] tracking-widest uppercase font-semibold',
      isAdmin
        ? 'bg-primary/15 text-primary border border-primary/30'
        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
    )}>
      {rol}
    </span>
  )
}

function EstadoBadge({ activo }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] tracking-widest uppercase font-semibold',
      activo
        ? 'bg-success/15 text-success border border-success/30'
        : 'bg-surface-2 text-text-dim border border-border-strong'
    )}>
      <span className={cn('size-1.5 rounded-full', activo ? 'bg-success' : 'bg-text-dim')} />
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function ChipGroup({ chips, value, onChange }) {
  return (
    <div className="flex gap-1">
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          onClick={() => onChange(chip.value)}
          className={cn(
            'px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase transition-colors',
            value === chip.value
              ? 'bg-primary text-white'
              : 'bg-surface-2 text-text-muted hover:text-text hover:bg-surface-1 border border-border-strong'
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}

function fmtFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function UsuariosPage() {
  const { user: me } = useAuth()

  const [usuarios, setUsuarios]   = useState([])
  const [pageInfo, setPageInfo]   = useState(EMPTY_PAGE_INFO)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [q, setQ]                 = useState('')
  const [rolFilter, setRolFilter] = useState('')
  const [activoFilter, setActivoFilter] = useState('')
  const [page, setPage]           = useState(0)

  // Modals
  const [createOpen, setCreateOpen] = useState(false)
  const [rolTarget, setRolTarget]   = useState(null)   // usuario para editar rol
  const [pwdTarget, setPwdTarget]   = useState(null)   // usuario para reset pwd
  const [toggleTarget, setToggleTarget] = useState(null) // usuario para toggle

  const abortRef = useRef(null)

  const doFetch = useCallback((searchQ, rol, activo, pageNum) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    const params = { page: pageNum, size: PAGE_SIZE }
    if (searchQ) params.q      = searchQ
    if (rol)     params.rol    = rol
    if (activo !== '') params.activo = activo === 'true'

    usuariosApi.list(params, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        const content = data?.content
        setUsuarios(Array.isArray(content) ? content : (Array.isArray(data) ? data : []))
        setPageInfo({
          totalPages:    data.totalPages    ?? 1,
          totalElements: data.totalElements ?? 0,
          number:        data.number        ?? pageNum,
          first:         data.first         ?? (pageNum === 0),
          last:          data.last          ?? true,
        })
      })
      .catch((err) => {
        if (err.code === 'ERR_CANCELED' || err.name === 'AbortError' || err.name === 'CanceledError') return
        setError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
  }, [])

  // Debounce on q/rol/activo — reset to page 0
  useEffect(() => {
    const delay = q ? 300 : 0
    const t = setTimeout(() => {
      setPage(0)
      doFetch(q, rolFilter, activoFilter, 0)
    }, delay)
    return () => clearTimeout(t)
  }, [q, rolFilter, activoFilter, doFetch])

  const refetch = () => doFetch(q, rolFilter, activoFilter, page)

  const handlePrev = () => {
    const prev = Math.max(0, page - 1)
    setPage(prev)
    doFetch(q, rolFilter, activoFilter, prev)
  }
  const handleNext = () => {
    const next = Math.min(pageInfo.totalPages - 1, page + 1)
    setPage(next)
    doFetch(q, rolFilter, activoFilter, next)
  }

  // Toggle active — guarded against self
  const handleToggleClick = (usuario) => {
    if (usuario.id === me?.userId) {
      toast.error('No puedes desactivarte a ti mismo')
      return
    }
    setToggleTarget(usuario)
  }

  const confirmToggle = async () => {
    if (!toggleTarget) return
    try {
      await usuariosApi.toggleActive(toggleTarget.id)
      const verb = toggleTarget.activo ? 'desactivado' : 'reactivado'
      toast.success(`Usuario ${toggleTarget.username} ${verb}`)
      setToggleTarget(null)
      refetch()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo cambiar el estado'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-full bg-bg p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Administración
          </p>
          <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
            Usuarios
          </h1>
          {!isLoading && !error && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              {pageInfo.totalElements} usuario{pageInfo.totalElements !== 1 ? 's' : ''} registrados
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Actualizar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por username..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface-1 text-text placeholder:text-text-dim border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        {/* Rol chips */}
        <ChipGroup chips={ROL_CHIPS} value={rolFilter} onChange={setRolFilter} />
        {/* Activo chips */}
        <ChipGroup chips={ACTIVO_CHIPS} value={activoFilter} onChange={setActivoFilter} />
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle size={32} className="text-danger" />
          <p className="font-sans text-sm text-text-muted">No se pudieron cargar los usuarios</p>
          <Button variant="secondary" size="sm" onClick={refetch}>Reintentar</Button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="bg-surface-1 border border-border-strong rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-strong bg-surface-2">
                  {COLS.map((c) => (
                    <th key={c} className="px-4 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-strong">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  : usuarios.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLS.length} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users size={28} className="text-text-dim" />
                            <p className="font-sans text-sm text-text-muted">
                              {q || rolFilter || activoFilter
                                ? 'Sin resultados para estos filtros'
                                : 'No hay usuarios registrados'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                    : usuarios.map((u) => (
                      <tr
                        key={u.id}
                        className={cn(
                          'transition-colors hover:bg-surface-2',
                          !u.activo && 'opacity-50'
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-sm text-text">
                          {u.username}
                          {u.id === me?.userId && (
                            <span className="ml-2 font-mono text-[9px] text-text-dim border border-border-strong rounded-full px-1.5 py-0.5 uppercase tracking-widest">
                              tú
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3"><RolBadge rol={u.rol} /></td>
                        <td className="px-4 py-3"><EstadoBadge activo={u.activo} /></td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">
                          {fmtFecha(u.fechaAlta)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <ActionBtn
                              icon={Pencil}
                              label="Editar rol"
                              onClick={() => setRolTarget(u)}
                            />
                            <ActionBtn
                              icon={KeyRound}
                              label="Resetear contraseña"
                              onClick={() => setPwdTarget(u)}
                            />
                            <ActionBtn
                              icon={Power}
                              label={u.activo ? 'Desactivar' : 'Activar'}
                              danger={u.activo}
                              onClick={() => handleToggleClick(u)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-strong bg-surface-2">
              <p className="font-mono text-[11px] text-text-muted">
                Página {pageInfo.number + 1} de {pageInfo.totalPages}
                {' · '}
                {pageInfo.totalElements} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={pageInfo.first}
                  className="p-1.5 rounded border border-border-strong text-text-muted hover:text-text hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={pageInfo.last}
                  className="p-1.5 rounded border border-border-strong text-text-muted hover:text-text hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <UsuarioFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => { setCreateOpen(false); doFetch(q, rolFilter, activoFilter, 0); setPage(0) }}
      />

      {rolTarget && (
        <EditarRolModal
          usuario={rolTarget}
          currentUserId={me?.userId}
          onClose={() => setRolTarget(null)}
          onUpdated={() => { setRolTarget(null); refetch() }}
        />
      )}

      {pwdTarget && (
        <ResetPasswordModal
          usuario={pwdTarget}
          onClose={() => setPwdTarget(null)}
          onUpdated={() => setPwdTarget(null)}
        />
      )}

      {toggleTarget && (
        <ConfirmModal
          title={toggleTarget.activo ? 'Desactivar usuario' : 'Reactivar usuario'}
          message={
            toggleTarget.activo
              ? `¿Desactivar a "${toggleTarget.username}"? No podrá iniciar sesión hasta que se reactive.`
              : `¿Reactivar a "${toggleTarget.username}"? Volverá a poder iniciar sesión.`
          }
          confirmLabel={toggleTarget.activo ? 'Desactivar' : 'Reactivar'}
          danger={toggleTarget.activo}
          onConfirm={confirmToggle}
          onClose={() => setToggleTarget(null)}
        />
      )}
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid size-7 place-items-center rounded border border-border-strong bg-surface-2 transition-colors',
        danger
          ? 'text-text-muted hover:border-danger hover:bg-danger/10 hover:text-danger'
          : 'text-text-muted hover:border-primary hover:bg-primary/10 hover:text-primary'
      )}
    >
      <Icon size={12} />
    </button>
  )
}
