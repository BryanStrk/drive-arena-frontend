import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Building2,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'

import LodgeCard from '@/components/lodges/LodgeCard'
import LodgeFormModal from '@/components/lodges/LodgeFormModal'
import { useLodges } from '@/hooks/useLodges'

/**
 * Página de gestión de Lodges (admin).
 *
 * Estados manejados:
 *   1. Loading inicial → skeleton grid
 *   2. Error de carga  → panel con botón "Reintentar"
 *   3. Sin lodges      → empty state con CTA "Crear primer lodge"
 *   4. Búsqueda vacía  → empty filter state con "Limpiar"
 *   5. Lista normal    → grid de LodgeCard con animaciones de entrada/salida
 *
 * Funcionalidad:
 *   - Búsqueda client-side por nombre o dirección (filtra en `useMemo`)
 *   - CRUD completo: crear, editar (modal) y eliminar (confirm + optimistic)
 *
 * Layout responsive: 1 col móvil → 2 cols sm → 3 cols xl → 4 cols 2xl.
 */
export default function LodgesPage() {
  const {
    lodges,
    isLoading,
    error,
    refetch,
    createLodge,
    updateLodge,
    removeLodge,
  } = useLodges()

  const [search, setSearch] = useState('')

  // Estado del modal de creación/edición
  // editingLodge === null → modo creación
  // editingLodge === { ... } → modo edición
  const [formOpen, setFormOpen] = useState(false)
  const [editingLodge, setEditingLodge] = useState(null)

  /**
   * Filtrado client-side. Memoizado para no recalcular en renders ajenos.
   * Para colecciones grandes (>1000) habría que mover el filtro al backend
   * con un query param, pero para gestión hotelera client-side es óptimo.
   */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return lodges
    return lodges.filter(
      (lodge) =>
        lodge.nombre.toLowerCase().includes(query) ||
        lodge.direccion.toLowerCase().includes(query),
    )
  }, [lodges, search])

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleDelete = async (lodge) => {
    const confirmed = window.confirm(
      `¿Eliminar el lodge "${lodge.nombre}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    try {
      await removeLodge(lodge.id)
    } catch {
      // El hook ya mostró el toast de error y revirtió el optimistic update.
    }
  }

  const handleCreate = () => {
    setEditingLodge(null)
    setFormOpen(true)
  }

  const handleEdit = (lodge) => {
    setEditingLodge(lodge)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    // editingLodge se actualiza en el próximo handleCreate/handleEdit.
    // No lo limpiamos aquí para que la animación de salida del modal
    // mantenga el header correcto ("Editar X" en lugar de "Nuevo Lodge").
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-white">
            Lodges
          </h1>
          <p className="mt-1 font-sans text-sm text-white/50">
            Gestión de alojamientos del resort
            {!isLoading && !error && (
              <span className="ml-2 font-mono text-white/30">
                · {lodges.length} {lodges.length === 1 ? 'activo' : 'activos'}
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
          Nuevo Lodge
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
          placeholder="Buscar por nombre o dirección..."
          className="w-full rounded-lg border border-border-strong bg-surface-2 py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* CONTENIDO */}
      {isLoading && <SkeletonGrid />}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={refetch} />
      )}

      {!isLoading && !error && lodges.length === 0 && (
        <EmptyState onCreate={handleCreate} />
      )}

      {!isLoading && !error && lodges.length > 0 && filtered.length === 0 && (
        <EmptyFilterState query={search} onClear={() => setSearch('')} />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((lodge) => (
              <LodgeCard
                key={lodge.id}
                lodge={lodge}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <LodgeFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        lodge={editingLodge}
        createLodge={createLodge}
        updateLodge={updateLodge}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES (privados de la página)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Grid de placeholders animados mientras se carga la lista.
 * 6 cards = aproximadamente lo que cabe en pantalla en xl, evita layout shift.
 */
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
            <div className="grid grid-cols-2 gap-3 border-t border-border-strong pt-3">
              <div className="space-y-1.5">
                <div className="h-2 w-12 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-12 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
              </div>
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
          No se pudieron cargar los lodges
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
        <Building2 size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No hay lodges aún
        </h3>
        <p className="font-sans text-sm text-white/50">
          Crea el primer alojamiento para empezar la gestión
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
      >
        <Plus size={16} strokeWidth={2.5} />
        Crear primer lodge
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
          Ningún lodge coincide con{' '}
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
