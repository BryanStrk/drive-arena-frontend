import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertCircle, Search, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { listContainer, listItem, pageFade } from '@/lib/motion'
import { SkeletonList } from '@/components/SkeletonCard'

import { clientesApi } from '@/api/clientes'
import ClienteFormModal from '@/components/clientes/ClienteFormModal'
import ClienteDetailModal from '@/components/taquilla/ClienteDetailModal'
import VentaDetailModal from '@/components/taquilla/VentaDetailModal'
import Button from '@/components/Button'

const PAGE_SIZE = 10

const COLS = [
  { label: 'DNI',      key: 'dni' },
  { label: 'Nombre',   key: 'nombre' },
  { label: 'Email',    key: 'email' },
  { label: 'Teléfono', key: 'telefono' },
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

export default function ClientesPage() {
  const [clientes, setClientes]     = useState([])
  const [pageInfo, setPageInfo]     = useState(EMPTY_PAGE_INFO)
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState(null)
  const [q, setQ]                   = useState('')
  const [page, setPage]             = useState(0)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [selectedVentaId, setSelectedVentaId] = useState(null)
  const [formOpen, setFormOpen]     = useState(false)
  const [editing, setEditing]       = useState(null)

  const abortRef = useRef(null)

  const doFetch = useCallback((searchQ, pageNum) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)
    clientesApi.listPaged({ q: searchQ || undefined, page: pageNum, size: PAGE_SIZE }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        const content = data?.content
        setClientes(Array.isArray(content) ? content : (Array.isArray(data) ? data : []))
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

  useEffect(() => {
    const delay = q ? 300 : 0
    const t = setTimeout(() => {
      setPage(0)
      doFetch(q, 0)
    }, delay)
    return () => clearTimeout(t)
  }, [q, doFetch])

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

  const createCliente = async (payload) => {
    const created = await clientesApi.create(payload)
    toast.success('Cliente registrado correctamente')
    setPage(0)
    doFetch(q, 0)
    return created
  }

  const updateCliente = async (id, payload) => {
    const updated = await clientesApi.update(id, payload)
    toast.success('Cliente actualizado correctamente')
    if (selectedCliente?.id === id) setSelectedCliente((prev) => ({ ...prev, ...updated }))
    doFetch(q, page)
    return updated
  }

  const handleOpenForm = (cliente = null) => {
    setEditing(cliente)
    setFormOpen(true)
  }

  return (
    <motion.div className="min-h-full bg-bg p-4 sm:p-6 md:p-8" {...pageFade}>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Dashboard · Clientes
          </p>
          <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
            Clientes
          </h1>
          {!isLoading && !error && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              {pageInfo.totalElements} cliente{pageInfo.totalElements !== 1 ? 's' : ''} registrados
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => doFetch(q, page)} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Actualizar
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)}>
            <Plus size={14} />
            Nuevo Cliente
          </Button>
        </div>
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
          <p className="font-sans text-sm text-text-muted">No se pudieron cargar los clientes</p>
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
                  : clientes.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLS.length} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users size={28} className="text-text-dim" />
                            <p className="font-sans text-sm text-text-muted">
                              {q ? 'Sin resultados para esta búsqueda' : 'No hay clientes registrados'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                    : clientes.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCliente(c)}
                        className="hover:bg-surface-2 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.dni ?? '—'}</td>
                        <td className="px-4 py-3 font-sans text-sm text-text">
                          {c.nombre} {c.apellidos}
                        </td>
                        <td className="px-4 py-3 font-sans text-sm text-text-muted">{c.email ?? '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.telefono ?? '—'}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: reflow a cards (la tabla se oculta en <md) */}
          <div className="md:hidden">
            {isLoading ? (
              <SkeletonList count={6} />
            ) : clientes.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <Users size={28} className="text-text-dim" />
                <p className="font-sans text-sm text-text-muted">
                  {q ? 'Sin resultados para esta búsqueda' : 'No hay clientes registrados'}
                </p>
              </div>
            ) : (
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-border-strong/60"
              >
                {clientes.map((c) => (
                  <motion.button
                    key={c.id}
                    variants={listItem}
                    type="button"
                    onClick={() => setSelectedCliente(c)}
                    className="block w-full px-4 py-4 text-left transition-all duration-200 hover:bg-surface-2/60"
                  >
                    <p className="font-sans text-sm text-text">{c.nombre} {c.apellidos}</p>
                    <p className="mt-1 font-mono text-xs text-text-muted">{c.dni ?? '—'}</p>
                    <div className="mt-2 flex flex-col gap-0.5 font-mono text-xs text-text-muted">
                      <span className="truncate">{c.email ?? '—'}</span>
                      <span>{c.telefono ?? '—'}</span>
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

      {/* Modals */}
      {selectedCliente && (
        <ClienteDetailModal
          cliente={selectedCliente}
          onClose={() => { setSelectedCliente(null); setSelectedVentaId(null) }}
          onEdit={handleOpenForm}
          onSelectVenta={setSelectedVentaId}
        />
      )}

      {selectedVentaId && (
        <VentaDetailModal ventaId={selectedVentaId} onClose={() => setSelectedVentaId(null)} />
      )}

      <ClienteFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        cliente={editing}
        createCliente={createCliente}
        updateCliente={updateCliente}
      />
    </motion.div>
  )
}
