import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Globe,
  Receipt,
  RefreshCw,
  Search,
  Ticket,
  User,
} from 'lucide-react'

import CompraDetailModal from '@/components/compras/CompraDetailModal'
import { useCompras } from '@/hooks/useCompras'

/**
 * Página de listado de compras (reservas).
 *
 * Distingue visualmente entre:
 *   - Compras WEB (usuarioSistemaUsername === null) → reservadas desde el wizard público
 *   - Compras de TAQUILLA (usuarioSistemaUsername !== null) → registradas por un empleado
 *
 * Permite ver el detalle completo (cliente + fechas + entradas + total) en un modal.
 *
 * Replica el lenguaje visual del módulo Lodges:
 *   - Header con font-display y contador en font-mono
 *   - Buscador estilizado por código/cliente/hotel
 *   - Tabla con rounded-card y bordes con design tokens
 *   - Estados Loading (skeleton), Error, Empty, EmptyFilter al estilo del proyecto
 */
export default function ComprasPage() {
  const { compras, isLoading, error, refetch } = useCompras()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  /**
   * Filtrado client-side memoizado por código, cliente u hotel.
   * Para colecciones grandes habría que mover el filtro al backend con un
   * query param, pero para gestión típica (decenas/centenas) es óptimo aquí.
   */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return compras
    return compras.filter(
      (c) =>
        (c.codigo && c.codigo.toLowerCase().includes(query)) ||
        c.clienteNombreCompleto.toLowerCase().includes(query) ||
        c.hotelNombre.toLowerCase().includes(query),
    )
  }, [compras, search])

  return (
    <>
      <div className="space-y-6 p-6 md:p-8">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-4xl uppercase tracking-wide text-white">
            Compras
          </h1>
          <p className="font-sans text-sm text-white/50">
            Reservas registradas en el sistema
            {!isLoading && !error && (
              <span className="ml-2 font-mono text-white/30">
                · {compras.length}{' '}
                {compras.length === 1 ? 'reserva' : 'reservas'}
              </span>
            )}
          </p>
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
            placeholder="Buscar por código, cliente u hotel..."
            className="w-full rounded-lg border border-border-strong bg-surface-2 py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* CONTENIDO */}
        {isLoading && <SkeletonTable />}

        {!isLoading && error && <ErrorState onRetry={refetch} />}

        {!isLoading && !error && compras.length === 0 && <EmptyState />}

        {!isLoading &&
          !error &&
          compras.length > 0 &&
          filtered.length === 0 && (
            <EmptyFilterState query={search} onClear={() => setSearch('')} />
          )}

        {!isLoading && !error && filtered.length > 0 && (
          <motion.div
            layout
            className="overflow-hidden rounded-card border border-border-strong bg-surface-1"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-strong bg-surface-2/40">
                    <Th>Código</Th>
                    <Th>Cliente</Th>
                    <Th>Hotel</Th>
                    <Th>Pensión</Th>
                    <Th>Estancia</Th>
                    <Th align="right">Total</Th>
                    <Th>Origen</Th>
                    <Th align="right">Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((c) => (
                      <CompraRow
                        key={c.id}
                        compra={c}
                        onView={() => setSelectedId(c.id)}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedId && (
        <CompraDetailModal
          compraId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FILA DE TABLA
// ═══════════════════════════════════════════════════════════════════════

function CompraRow({ compra, onView }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-border-strong/50 transition-colors hover:bg-surface-2/30"
    >
      <Td>
        {compra.codigo ? (
          <span className="font-mono text-xs font-semibold tracking-wider text-primary">
            {compra.codigo}
          </span>
        ) : (
          <span className="font-mono text-xs text-white/30">—</span>
        )}
      </Td>
      <Td>
        <span className="font-sans text-sm text-white">
          {compra.clienteNombreCompleto}
        </span>
      </Td>
      <Td>
        <span className="font-sans text-sm text-white/70">
          {compra.hotelNombre}
        </span>
      </Td>
      <Td>
        <PensionBadge tipo={compra.tipoPension} />
      </Td>
      <Td>
        <div className="flex items-center gap-2 font-mono text-xs text-white/60">
          <span>{formatFechaCorta(compra.fechaEntrada)}</span>
          <ArrowRight size={11} className="text-white/30" />
          <span>{formatFechaCorta(compra.fechaSalida)}</span>
        </div>
      </Td>
      <Td align="right">
        <span className="font-mono text-sm font-semibold text-white">
          {formatEur(compra.total)}
        </span>
      </Td>
      <Td>
        <OrigenBadge usuario={compra.usuarioSistemaUsername} />
      </Td>
      <Td align="right">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-sans text-xs font-medium uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
        >
          Ver detalle
          <ArrowRight size={12} />
        </button>
      </Td>
    </motion.tr>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════════════════════════════════

const PENSION_CONFIG = {
  SIN: {
    label: 'Sin pensión',
    className: 'border-white/15 bg-white/5 text-white/60',
  },
  MEDIA: {
    label: 'Media',
    className: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  },
  COMPLETA: {
    label: 'Completa',
    className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  },
}

function PensionBadge({ tipo }) {
  const config = PENSION_CONFIG[tipo] ?? PENSION_CONFIG.SIN
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  )
}

function OrigenBadge({ usuario }) {
  if (!usuario) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
        <Globe size={10} />
        Web
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/70"
      title="Compra registrada por un empleado en taquilla"
    >
      <User size={10} />
      {usuario}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ESTADOS
// ═══════════════════════════════════════════════════════════════════════

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-card border border-border-strong bg-surface-1">
      <div className="border-b border-border-strong bg-surface-2/40 p-4">
        <div className="grid grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-surface-2"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div
          key={row}
          className="grid grid-cols-8 gap-4 border-b border-border-strong/50 p-4 last:border-0"
        >
          {Array.from({ length: 8 }).map((_, col) => (
            <div
              key={col}
              className="h-4 animate-pulse rounded bg-surface-2"
            />
          ))}
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
          No se pudieron cargar las compras
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong bg-surface-1 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Receipt size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          Sin compras todavía
        </h3>
        <p className="font-sans text-sm text-white/50">
          Las reservas del wizard público aparecerán aquí automáticamente
        </p>
      </div>
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
          Ninguna compra coincide con{' '}
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

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return (
    <th
      className={`px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 ${alignClass}`}
    >
      {children}
    </th>
  )
}

function Td({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return <td className={`px-4 py-3.5 ${alignClass}`}>{children}</td>
}

function formatFechaCorta(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function formatEur(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(n)
}
