import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { mantenimientosApi } from '@/api/mantenimientos'
import { useAuth } from '@/context/useAuth'
import MantenimientoDetailModal from '@/components/tecnico/MantenimientoDetailModal'
import ReportarMantenimientoModal from '@/components/tecnico/ReportarMantenimientoModal'
import { cn } from '@/lib/cn'

const COLUMNS = [
  {
    estado: 'PENDIENTE',
    label: 'Pendiente',
    headerClass: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
    dotClass: 'bg-amber-400',
  },
  {
    estado: 'EN_CURSO',
    label: 'En Curso',
    headerClass: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
    dotClass: 'bg-blue-400',
  },
  {
    estado: 'COMPLETADO',
    label: 'Completado',
    headerClass: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
    dotClass: 'bg-emerald-400',
  },
]

function fmtFecha(s) {
  if (!s) return null
  return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function KanbanCard({ m, me, onClick }) {
  const assigned = m.tecnicosAsignados ?? []
  const isPool = assigned.length === 0
  const isAssignedToMe = assigned.some((t) => t.username === me)
  const isOther = assigned.length > 0 && !isAssignedToMe

  return (
    <button
      type="button"
      onClick={isOther ? undefined : () => onClick(m)}
      disabled={isOther}
      className={cn(
        'w-full text-left rounded-inner border border-border-strong bg-surface-2 p-4 transition-colors',
        isOther
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:border-primary hover:bg-surface-1',
      )}
    >
      <p className="font-display text-base uppercase tracking-wide text-text line-clamp-1">
        {m.atraccionNombre}
      </p>
      <div className="mt-2">
        {isAssignedToMe && (
          <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/15 px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase text-orange-400">
            Asignado a ti
          </span>
        )}
        {isPool && (
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase text-white/40">
            Pool
          </span>
        )}
        {isOther && (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase text-white/30">
            Asignado a otros
          </span>
        )}
      </div>
      {m.fechaProgramada && (
        <p className="mt-2 font-mono text-[10px] text-text-dim">
          {fmtFecha(m.fechaProgramada)}
        </p>
      )}
    </button>
  )
}

const TABS = [
  { id: 'TODOS',      label: 'Todos' },
  { id: 'MIS_TAREAS', label: 'Mis tareas' },
  { id: 'POOL',       label: 'Pool' },
  { id: 'OTROS',      label: 'Otros' },
]

export default function MantenimientosTecnicoPage() {
  const { user } = useAuth()
  const me = user?.username
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('TODOS')
  const [selected, setSelected] = useState(null)
  const [reportarOpen, setReportarOpen] = useState(false)
  const timerRef = useRef(null)

  const doFetch = useCallback(() => {
    mantenimientosApi.list()
      .then((data) => {
        setTodos(Array.isArray(data) ? data : (data?.content ?? []))
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    doFetch()
    timerRef.current = setInterval(doFetch, 30_000)
    return () => clearInterval(timerRef.current)
  }, [doFetch])

  const filtered = todos.filter((m) => {
    const assigned = m.tecnicosAsignados ?? []
    if (activeTab === 'MIS_TAREAS') return assigned.some((t) => t.username === me)
    if (activeTab === 'POOL')       return assigned.length === 0
    if (activeTab === 'OTROS')      return assigned.length > 0 && !assigned.some((t) => t.username === me)
    return true
  })

  const byEstado = (estado) => filtered.filter((m) => m.estado === estado)

  const handleUpdated = () => {
    setSelected(null)
    doFetch()
  }

  return (
    <div className="min-h-full bg-bg p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange-400">▌ Técnico</p>
          <h1 className="mt-1 font-display font-extrabold text-3xl tracking-tight text-text">
            Mantenimientos
          </h1>
        </div>
        <button
          type="button"
          onClick={doFetch}
          disabled={isLoading}
          className="grid size-8 place-items-center rounded border border-border-strong bg-surface-2 text-text-muted hover:border-primary hover:text-text transition-colors disabled:opacity-50"
          aria-label="Actualizar"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => {
          const isActive = activeTab === id
          const count = id === 'TODOS'      ? todos.length
                      : id === 'MIS_TAREAS' ? todos.filter((m) => (m.tecnicosAsignados ?? []).some((t) => t.username === me)).length
                      : id === 'POOL'       ? todos.filter((m) => (m.tecnicosAsignados ?? []).length === 0).length
                      : todos.filter((m) => { const a = m.tecnicosAsignados ?? []; return a.length > 0 && !a.some((t) => t.username === me) }).length
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-all',
                isActive
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border-strong bg-surface-1 text-text-muted hover:border-white/30 hover:text-text',
              )}
            >
              {label}
              {!isLoading && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 font-mono text-[9px]',
                  isActive ? 'bg-primary/20 text-primary' : 'bg-surface-2 text-text-dim',
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ estado, label, headerClass, dotClass }) => (
          <div key={estado} className="flex flex-col gap-3">
            <div className={cn('flex items-center gap-2 rounded-inner border px-3 py-2', headerClass)}>
              <span className={cn('size-2 rounded-full shrink-0', dotClass)} />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase font-semibold">
                {label}
              </span>
              <span className="ml-auto font-mono text-[10px] text-text-muted">
                {byEstado(estado).length}
              </span>
            </div>
            <div className="flex flex-col gap-2 min-h-24">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-inner bg-surface-2 animate-pulse" />
                  ))
                : byEstado(estado).map((m) => (
                    <KanbanCard key={m.id} m={m} me={me} onClick={setSelected} />
                  ))}
              {!isLoading && byEstado(estado).length === 0 && (
                <p className="py-8 text-center font-sans text-xs text-text-dim">
                  Sin tareas
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setReportarOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-mono text-[11px] tracking-widest uppercase text-white shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Reportar mantenimiento"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Reportar</span>
      </button>

      {selected && (
        <MantenimientoDetailModal
          mantenimiento={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}

      {reportarOpen && (
        <ReportarMantenimientoModal
          onClose={() => setReportarOpen(false)}
          onCreated={() => { setReportarOpen(false); doFetch() }}
        />
      )}
    </div>
  )
}
