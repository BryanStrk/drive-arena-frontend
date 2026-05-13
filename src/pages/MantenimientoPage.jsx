import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  LayoutList,
  PlayCircle,
  Plus,
  RefreshCw,
  Wrench,
  XCircle,
} from 'lucide-react'

import MantenimientoCard from '@/components/mantenimiento/MantenimientoCard'
import MantenimientoFormModal from '@/components/mantenimiento/MantenimientoFormModal'
import AsignarTecnicoModal from '@/components/mantenimiento/AsignarTecnicoModal'
import { useMantenimientos } from '@/hooks/useMantenimientos'

/**
 * Página de gestión operativa de Mantenimientos.
 *
 * Características:
 *   - Filtro por estado mediante chips horizontales (Todos / Pendiente / En curso / ...)
 *   - Grid de cards con border-left coloreado según estado
 *   - CRUD completo: crear, editar, eliminar (con confirm)
 *   - El estado en CREATE siempre se fuerza a PENDIENTE en backend
 *
 * El filtro se hace server-side (re-fetch con `?estado=...`) para que la
 * paginación futura no rompa cuando haya muchos mantenimientos.
 */
const ESTADO_FILTERS = [
  { value: null, label: 'Todos', Icon: LayoutList },
  { value: 'PENDIENTE', label: 'Pendiente', Icon: CircleDashed },
  { value: 'EN_CURSO', label: 'En curso', Icon: PlayCircle },
  { value: 'COMPLETADO', label: 'Completado', Icon: CheckCircle2 },
  { value: 'CANCELADO', label: 'Cancelado', Icon: XCircle },
]

export default function MantenimientoPage() {
  const {
    mantenimientos,
    isLoading,
    error,
    estadoFilter,
    setEstadoFilter,
    refetch,
    createMantenimiento,
    updateMantenimiento,
    removeMantenimiento,
  } = useMantenimientos()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [asignando, setAsignando] = useState(null)

  // Conteos por estado (sobre la lista actual del backend, sin filtro extra)
  // Para el contador del header usamos siempre la longitud actual
  const totalCount = mantenimientos.length

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleDelete = async (mantenimiento) => {
    const confirmed = window.confirm(
      `¿Eliminar el mantenimiento del circuito "${mantenimiento.atraccionNombre}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    try {
      await removeMantenimiento(mantenimiento.id)
    } catch {
      // El hook ya mostró el toast.
    }
  }

  const handleCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (mantenimiento) => {
    setEditing(mantenimiento)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
  }

  const handleAsignar = (mantenimiento) => {
    setAsignando(mantenimiento)
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-white">
            Mantenimiento
          </h1>
          <p className="mt-1 font-sans text-sm text-white/50">
            Programación y seguimiento de revisiones técnicas
            {!isLoading && !error && (
              <span className="ml-2 font-mono text-white/30">
                · {totalCount}{' '}
                {totalCount === 1 ? 'registrado' : 'registrados'}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-primary-dark hover:shadow-[0_0_20px_var(--color-primary-glow)] sm:self-auto"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nuevo Mantenimiento
        </button>
      </header>

      {/* FILTRO POR ESTADO */}
      <EstadoFilter
        active={estadoFilter}
        onSelect={setEstadoFilter}
      />

      {/* CONTENIDO */}
      {isLoading && <SkeletonGrid />}

      {!isLoading && error && <ErrorState onRetry={refetch} />}

      {!isLoading && !error && mantenimientos.length === 0 && (
        <EmptyState
          hasFilter={estadoFilter != null}
          onClearFilter={() => setEstadoFilter(null)}
          onCreate={handleCreate}
        />
      )}

      {!isLoading && !error && mantenimientos.length > 0 && (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {mantenimientos.map((mantenimiento) => (
              <MantenimientoCard
                key={mantenimiento.id}
                mantenimiento={mantenimiento}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAsignar={handleAsignar}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MODALES */}
      <MantenimientoFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        mantenimiento={editing}
        createMantenimiento={createMantenimiento}
        updateMantenimiento={updateMantenimiento}
      />

      <AsignarTecnicoModal
        mantenimiento={asignando}
        onClose={() => setAsignando(null)}
        onAsignado={() => { setAsignando(null); refetch() }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FILTRO POR ESTADO
// ═══════════════════════════════════════════════════════════════════════

function EstadoFilter({ active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ESTADO_FILTERS.map(({ value, label, Icon }) => {
        const isActive = active === value
        return (
          <button
            key={value ?? 'todos'}
            type="button"
            onClick={() => onSelect(value)}
            className={
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all ' +
              (isActive
                ? 'border-primary bg-primary/15 text-primary shadow-[0_0_15px_-5px_var(--color-primary-glow)]'
                : 'border-border-strong bg-surface-1 text-white/60 hover:border-white/30 hover:text-white')
            }
          >
            <Icon size={12} strokeWidth={2.5} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ESTADOS
// ═══════════════════════════════════════════════════════════════════════

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-card border border-l-4 border-border-strong bg-surface-1 p-5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface-2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border-strong pt-3">
              <div className="space-y-1">
                <div className="h-2 w-12 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
              </div>
              <div className="space-y-1">
                <div className="ml-auto h-2 w-12 animate-pulse rounded bg-surface-2" />
                <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-border-strong bg-surface-1 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No se pudieron cargar los mantenimientos
        </h3>
        <p className="font-sans text-sm text-white/50">
          Verifica tu conexión o reintenta en unos segundos
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-4 py-2 font-sans text-sm text-white transition-colors hover:border-primary hover:bg-primary/10"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

function EmptyState({ hasFilter, onClearFilter, onCreate }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-border-strong bg-surface-1 px-6 py-12 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-surface-2 text-white/40">
          <LayoutList size={22} />
        </div>
        <div className="space-y-1">
          <p className="font-sans text-sm text-white">
            No hay mantenimientos con este estado
          </p>
          <p className="font-sans text-xs text-white/50">
            Prueba con otro filtro o limpia la selección
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilter}
          className="font-sans text-xs text-primary underline-offset-4 hover:underline"
        >
          Ver todos
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong bg-surface-1 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Wrench size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No hay mantenimientos programados
        </h3>
        <p className="font-sans text-sm text-white/50">
          Programa el primero para empezar la gestión operativa
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
      >
        <Plus size={16} strokeWidth={2.5} />
        Nuevo mantenimiento
      </button>
    </div>
  )
}
