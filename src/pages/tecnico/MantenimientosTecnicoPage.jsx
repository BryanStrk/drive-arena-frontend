import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { mantenimientosApi } from '@/api/mantenimientos'
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

function KanbanCard({ m, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(m)}
      className="w-full text-left rounded-inner border border-border-strong bg-surface-2 p-4 hover:border-primary hover:bg-surface-1 transition-colors"
    >
      <p className="font-display text-base uppercase tracking-wide text-text line-clamp-1">
        {m.atraccionNombre}
      </p>
      {m.tecnicoNombreCompleto && (
        <p className="mt-1 font-sans text-xs text-text-muted line-clamp-1">
          {m.tecnicoNombreCompleto}
        </p>
      )}
      {m.fechaProgramada && (
        <p className="mt-2 font-mono text-[10px] text-text-dim">
          {fmtFecha(m.fechaProgramada)}
        </p>
      )}
    </button>
  )
}

export default function MantenimientosTecnicoPage() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  const byEstado = (estado) => todos.filter((m) => m.estado === estado)

  const handleUpdated = () => {
    setSelected(null)
    doFetch()
  }

  return (
    <div className="min-h-full bg-bg p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
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
                    <KanbanCard key={m.id} m={m} onClick={setSelected} />
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
