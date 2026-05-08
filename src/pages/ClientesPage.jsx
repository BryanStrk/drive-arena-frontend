import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react'

import ClienteCard from '@/components/clientes/ClienteCard'
import ClienteFormModal from '@/components/clientes/ClienteFormModal'
import { useClientes } from '@/hooks/useClientes'

/**
 * Página de gestión de Clientes (admin / CRM).
 *
 * Replica el patrón Lodges/Circuitos:
 *   - Header con contador y CTA "Nuevo Cliente"
 *   - Buscador client-side por nombre, apellidos, email o DNI
 *   - Grid responsivo (1/2/3/4 cols)
 *   - Estados separados: loading (skeleton), error, empty, empty-filter, lista
 *   - CRUD completo con optimistic updates
 *
 * Búsqueda multicampo: el operador de taquilla puede pegar un DNI, email
 * o tipear un nombre y filtra al instante. Sin re-fetch al backend.
 */
export default function ClientesPage() {
  const {
    clientes,
    isLoading,
    error,
    refetch,
    createCliente,
    updateCliente,
    removeCliente,
  } = useClientes()

  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  /**
   * Filtrado client-side memoizado por nombre, apellidos, email o DNI.
   */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return clientes
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.apellidos.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.dni.toLowerCase().includes(query),
    )
  }, [clientes, search])

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleDelete = async (cliente) => {
    const fullName = `${cliente.nombre} ${cliente.apellidos}`
    const confirmed = window.confirm(
      `¿Eliminar al cliente "${fullName}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    try {
      await removeCliente(cliente.id)
    } catch {
      // El hook ya mostró el toast.
    }
  }

  const handleCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (cliente) => {
    setEditing(cliente)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-white">
            Clientes
          </h1>
          <p className="mt-1 font-sans text-sm text-white/50">
            Pilotos registrados en el sistema
            {!isLoading && !error && (
              <span className="ml-2 font-mono text-white/30">
                · {clientes.length}{' '}
                {clientes.length === 1 ? 'registrado' : 'registrados'}
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
          Nuevo Cliente
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
          placeholder="Buscar por nombre, email o DNI..."
          className="w-full rounded-lg border border-border-strong bg-surface-2 py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* CONTENIDO */}
      {isLoading && <SkeletonGrid />}

      {!isLoading && error && <ErrorState onRetry={refetch} />}

      {!isLoading && !error && clientes.length === 0 && (
        <EmptyState onCreate={handleCreate} />
      )}

      {!isLoading &&
        !error &&
        clientes.length > 0 &&
        filtered.length === 0 && (
          <EmptyFilterState query={search} onClear={() => setSearch('')} />
        )}

      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MODAL */}
      <ClienteFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        cliente={editing}
        createCliente={createCliente}
        updateCliente={updateCliente}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES
// ═══════════════════════════════════════════════════════════════════════

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 overflow-hidden rounded-card border border-border-strong bg-surface-1 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="size-12 animate-pulse rounded-full bg-surface-2" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="flex justify-between border-t border-border-strong pt-3">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
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
          No se pudieron cargar los clientes
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

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong bg-surface-1 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Users size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No hay clientes registrados
        </h3>
        <p className="font-sans text-sm text-white/50">
          Registra el primer piloto para empezar la gestión
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
      >
        <Plus size={16} strokeWidth={2.5} />
        Registrar primer cliente
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
          Ningún cliente coincide con{' '}
          <span className="font-mono text-primary">"{query}"</span>
        </p>
        <p className="font-sans text-xs text-white/50">
          Prueba con otro nombre, email o DNI
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
