import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Flag, Plus, RefreshCw, Search } from 'lucide-react'

import AtraccionCard from '@/components/circuitos/AtraccionCard'
import AtraccionFormModal from '@/components/circuitos/AtraccionFormModal'
import { useAtracciones } from '@/hooks/useAtracciones'

/**
 * Página de gestión de Circuitos (admin).
 *
 * Replica el patrón de LodgesPage adaptado al dominio de atracciones:
 *   - Header con contador y CTA "Nuevo Circuito"
 *   - Buscador client-side por nombre o descripción
 *   - Grid responsivo (1/2/3/4 cols según breakpoint)
 *   - Estados separados: loading (skeleton), error, empty, empty-filter, lista
 *   - CRUD completo: crear, editar (modal) y eliminar (confirm + optimistic)
 *   - Animaciones de entrada/salida con Framer Motion
 */
export default function CircuitosPage() {
  const {
    atracciones,
    isLoading,
    error,
    refetch,
    createAtraccion,
    updateAtraccion,
    removeAtraccion,
  } = useAtracciones()

  const [search, setSearch] = useState('')

  // Estado del modal de creación/edición
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  /**
   * Filtrado client-side memoizado. Para colecciones grandes habría que
   * mover el filtro al backend, pero para una decena de circuitos es óptimo.
   */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return atracciones
    return atracciones.filter(
      (a) =>
        a.nombre.toLowerCase().includes(query) ||
        (a.descripcion && a.descripcion.toLowerCase().includes(query)),
    )
  }, [atracciones, search])

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleDelete = async (atraccion) => {
    const confirmed = window.confirm(
      `¿Eliminar el circuito "${atraccion.nombre}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    try {
      await removeAtraccion(atraccion.id)
    } catch {
      // El hook ya mostró el toast de error y revirtió el optimistic update.
    }
  }

  const handleCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (atraccion) => {
    setEditing(atraccion)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    // editing se actualiza en el próximo handleCreate/handleEdit.
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-white">
            Circuitos
          </h1>
          <p className="mt-1 font-sans text-sm text-white/50">
            Gestión de atracciones del parque
            {!isLoading && !error && (
              <span className="ml-2 font-mono text-white/30">
                · {atracciones.length}{' '}
                {atracciones.length === 1 ? 'activo' : 'activos'}
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
          Nuevo Circuito
        </button>
      </header>

      {/* BUSCADOR */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="w-full rounded-lg border border-border-strong bg-surface-2 py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* CONTENIDO */}
      {isLoading && <SkeletonGrid />}

      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && atracciones.length === 0 && (
        <EmptyState onCreate={handleCreate} />
      )}

      {!isLoading &&
        !error &&
        atracciones.length > 0 &&
        filtered.length === 0 && (
          <EmptyFilterState query={search} onClear={() => setSearch('')} />
        )}

      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((atraccion) => (
              <AtraccionCard
                key={atraccion.id}
                atraccion={atraccion}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <AtraccionFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        atraccion={editing}
        createAtraccion={createAtraccion}
        updateAtraccion={updateAtraccion}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES (privados de la página)
// ═══════════════════════════════════════════════════════════════════════

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-card border border-border-strong bg-surface-1"
        >
          <div className="aspect-video animate-pulse bg-surface-2" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="flex justify-between border-t border-border-strong pt-3">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-12 animate-pulse rounded bg-surface-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-border-strong bg-surface-1 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No se pudieron cargar los circuitos
        </h3>
        <p className="font-sans text-sm text-white/50">{message}</p>
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

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong bg-surface-1 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Flag size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No hay circuitos aún
        </h3>
        <p className="font-sans text-sm text-white/50">
          Crea el primer circuito para empezar la gestión
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
      >
        <Plus size={16} strokeWidth={2.5} />
        Crear primer circuito
      </button>
    </div>
  )
}

function EmptyFilterState({ query, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-border-strong bg-surface-1 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-surface-2 text-white/40">
        <Search size={22} />
      </div>
      <div className="space-y-1">
        <p className="font-sans text-sm text-white">
          Ningún circuito coincide con{' '}
          <span className="font-mono text-primary">"{query}"</span>
        </p>
        <p className="font-sans text-xs text-white/50">
          Prueba con otra búsqueda
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="font-sans text-xs text-primary underline-offset-4 hover:underline"
      >
        Limpiar búsqueda
      </button>
    </div>
  )
}
