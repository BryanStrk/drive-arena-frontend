import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, AlertCircle, Search, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

import { obtenerCompras } from '@/api/compras'
import VentaDetailModal from '@/components/taquilla/VentaDetailModal'
import Button from '@/components/Button'

const PAGE_SIZE = 20

const COLS = [
  { label: 'ID',        key: 'id' },
  { label: 'Cliente',   key: 'clienteNombreCompleto' },
  { label: 'Operador',  key: 'usuarioSistemaUsername' },
  { label: 'Lodge',     key: 'hotelNombre' },
  { label: 'Pensión',   key: 'tipoPension' },
  { label: 'Entrada',   key: 'fechaEntrada' },
  { label: 'Salida',    key: 'fechaSalida' },
  { label: 'Total',     key: 'total' },
]

function SkeletonRow() {
  return (
    <tr>
      {COLS.map((c) => (
        <td key={c.key} className="px-4 py-3">
          <div className="h-4 rounded bg-surface-2 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function TodasLasVentasPage() {
  const [ventas, setVentas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)

  const doFetch = useCallback((searchQ) => {
    setIsLoading(true)
    setError(null)
    obtenerCompras({ q: searchQ || undefined })
      .then((data) => { setVentas(data); setError(null) })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false))
  }, [])

  // Initial load + debounced refetch on q change
  useEffect(() => {
    const delay = q ? 300 : 0
    const t = setTimeout(() => {
      setPage(0)
      doFetch(q)
    }, delay)
    return () => clearTimeout(t)
  }, [q, doFetch])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(ventas.length / PAGE_SIZE))
  const paginated = ventas.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="min-h-full bg-bg p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Taquilla · Ventas
          </p>
          <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
            Todas las Ventas
          </h1>
          {!isLoading && !error && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              {ventas.length} registro{ventas.length !== 1 ? 's' : ''} totales
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => doFetch(q)} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </Button>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, DNI o email..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface-1 text-text placeholder:text-text-dim border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle size={32} className="text-danger" />
          <p className="font-sans text-sm text-text-muted">No se pudieron cargar las ventas</p>
          <Button variant="secondary" size="sm" onClick={() => doFetch(q)}>Reintentar</Button>
        </div>
      )}

      {/* Tabla */}
      {!error && (
        <div className="bg-surface-1 border border-border-strong rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-strong bg-surface-2">
                  {COLS.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-strong">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLS.length} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingBag size={28} className="text-text-dim" />
                            <p className="font-sans text-sm text-text-muted">
                              {q ? 'Sin resultados para esta búsqueda' : 'No hay ventas registradas'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                    : paginated.map((v) => (
                      <tr
                        key={v.id}
                        onClick={() => setSelectedId(v.id)}
                        className="hover:bg-surface-2 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">#{v.id}</td>
                        <td className="px-4 py-3 font-sans text-sm text-text">{v.clienteNombreCompleto ?? '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{v.usuarioSistemaUsername ?? '—'}</td>
                        <td className="px-4 py-3 font-sans text-sm text-text-muted">{v.hotelNombre ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[11px] tracking-widest uppercase text-text-muted">
                            {v.tipoPension ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{v.fechaEntrada ?? '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{v.fechaSalida ?? '—'}</td>
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-text">
                          {v.total != null
                            ? `€ ${Number(v.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && ventas.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-strong bg-surface-2">
              <p className="font-mono text-[11px] text-text-muted">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, ventas.length)} de {ventas.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded border border-border-strong text-text-muted hover:text-text hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="font-mono text-[11px] text-text-muted">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
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

      {selectedId && (
        <VentaDetailModal ventaId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
