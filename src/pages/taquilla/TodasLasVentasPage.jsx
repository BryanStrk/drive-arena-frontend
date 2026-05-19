import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertCircle, Search, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

import { listContainer, listItem, pageFade } from '@/lib/motion'
import { SkeletonList } from '@/components/SkeletonCard'

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

const EMPTY_PAGE_INFO = { totalPages: 1, totalElements: 0, number: 0, first: true, last: true }

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
  const [pageInfo, setPageInfo] = useState(EMPTY_PAGE_INFO)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)

  // doFetch is called either from setTimeout (q changes) or event handlers (page buttons)
  // — setIsLoading(true) is always inside this function, never directly in an effect body
  const doFetch = useCallback((searchQ, pageNum) => {
    setIsLoading(true)
    setError(null)
    obtenerCompras({ q: searchQ || undefined, page: pageNum, size: PAGE_SIZE })
      .then((data) => {
        const content = data?.content
        setVentas(Array.isArray(content) ? content : (Array.isArray(data) ? data : []))
        setPageInfo({
          totalPages:    data.totalPages    ?? 1,
          totalElements: data.totalElements ?? 0,
          number:        data.number        ?? pageNum,
          first:         data.first         ?? (pageNum === 0),
          last:          data.last          ?? true,
        })
        setError(null)
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false))
  }, [])

  // Debounced search — resets to page 0. doFetch is called inside setTimeout
  // so setIsLoading(true) is async, not synchronous in the effect body.
  useEffect(() => {
    const delay = q ? 300 : 0
    const t = setTimeout(() => {
      setPage(0)
      doFetch(q, 0)
    }, delay)
    return () => clearTimeout(t)
  }, [q, doFetch])

  // Pagination handlers call doFetch directly (no effect needed)
  const handlePrev = () => {
    const prev = Math.max(0, page - 1)
    setPage(prev)
    doFetch(q, prev)
  }
  const handleNext = () => {
    const next = Math.min(pageInfo.totalPages - 1, page + 1)
    setPage(next)
    doFetch(q, next)
  }

  return (
    <motion.div className="min-h-full bg-bg p-4 sm:p-6 md:p-8" {...pageFade}>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Taquilla · Ventas
          </p>
          <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
            Todas las Ventas
          </h1>
          {!isLoading && !error && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              {pageInfo.totalElements} registro{pageInfo.totalElements !== 1 ? 's' : ''} totales
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => doFetch(q, page)} disabled={isLoading}>
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
          className="w-full pl-9 pr-4 py-2.5 bg-surface-1 text-text placeholder:text-text-dim border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-150"
        />
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle size={32} className="text-danger" />
          <p className="font-sans text-sm text-text-muted">No se pudieron cargar las ventas</p>
          <Button variant="secondary" size="sm" onClick={() => doFetch(q, page)}>Reintentar</Button>
        </div>
      )}

      {/* Tabla */}
      {!error && (
        <div className="bg-surface-1 border border-border-strong rounded-card overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
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
              <tbody className="divide-y divide-border-strong/60">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  : ventas.length === 0
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
                    : ventas.map((v) => (
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

          {/* Mobile: reflow a cards (la tabla se oculta en <md) */}
          <div className="md:hidden">
            {isLoading ? (
              <SkeletonList count={6} />
            ) : ventas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <ShoppingBag size={28} className="text-text-dim" />
                <p className="font-sans text-sm text-text-muted">
                  {q ? 'Sin resultados para esta búsqueda' : 'No hay ventas registradas'}
                </p>
              </div>
            ) : (
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-border-strong/60"
              >
                {ventas.map((v) => (
                  <motion.button
                    key={v.id}
                    variants={listItem}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className="block w-full px-4 py-4 text-left transition-all duration-200 hover:bg-surface-2/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-sans text-sm text-text">{v.clienteNombreCompleto ?? '—'}</p>
                      <span className="font-mono text-sm font-semibold text-text shrink-0">
                        {v.total != null
                          ? `€ ${Number(v.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
                          : '—'}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-text-muted">
                      #{v.id} · {v.hotelNombre ?? '—'} · op. {v.usuarioSistemaUsername ?? '—'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-muted">
                      <span className="uppercase tracking-widest">{v.tipoPension ?? '—'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.fechaEntrada ?? '—'} → {v.fechaSalida ?? '—'}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
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

      {selectedId && (
        <VentaDetailModal ventaId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </motion.div>
  )
}
