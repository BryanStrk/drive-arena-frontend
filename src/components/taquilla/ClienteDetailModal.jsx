import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, AlertCircle, Pencil } from 'lucide-react'

import { obtenerCompras } from '@/api/compras'
import Button from '@/components/Button'

const fmtFecha = (s) => {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(d) ? s : d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const fmtEur = (v) =>
  v != null
    ? `€ ${Number(v).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—'

const HISTORIAL_COLS = ['#', 'Lodge', 'Entrada', 'Salida', 'Total']

const PERSONAL_FIELDS = [
  { label: 'Nombre',     get: (c) => c.nombre     ?? '—' },
  { label: 'Apellidos',  get: (c) => c.apellidos   ?? '—' },
  { label: 'DNI',        get: (c) => c.dni         ?? '—' },
  { label: 'Email',      get: (c) => c.email       ?? '—' },
  { label: 'Teléfono',   get: (c) => c.telefono    ?? '—' },
  { label: 'Registrado', get: (c) => fmtFecha(c.fechaRegistro) },
]

export default function ClienteDetailModal({ cliente, onClose, onEdit, onSelectVenta }) {
  const [compras, setCompras]           = useState([])
  const [loadingCompras, setLoadingCompras] = useState(true)
  const [errorCompras, setErrorCompras] = useState(null)

  // Modal mounts fresh per client → loadingCompras starts true; no sync setState in effect body
  useEffect(() => {
    if (!cliente?.id) return
    obtenerCompras({ clienteId: cliente.id, size: 20 })
      .then((data) => {
        const content = data?.content
        setCompras(Array.isArray(content) ? content : (Array.isArray(data) ? data : []))
        setErrorCompras(null)
      })
      .catch((err) => setErrorCompras(err))
      .finally(() => setLoadingCompras(false))
  }, [cliente?.id])

  const initials = (
    ((cliente.nombre  || '')[0] || '') +
    ((cliente.apellidos || '')[0] || '')
  ).toUpperCase()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-t-card border border-border-strong bg-surface-1 shadow-2xl max-h-[90vh] flex flex-col sm:rounded-card"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-border-strong p-6 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="grid size-12 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-base tracking-wider text-primary">
                {initials || '?'}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                  ▌ Detalle de cliente
                </p>
                <h2 className="mt-0.5 font-display text-2xl uppercase tracking-wide text-text truncate">
                  {cliente.nombre} {cliente.apellidos}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm" onClick={() => onEdit(cliente)}>
                <Pencil size={13} />
                Editar datos
              </Button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-text-muted transition-colors hover:border-primary hover:text-text"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Datos personales */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                Datos personales
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PERSONAL_FIELDS.map(({ label, get }) => (
                  <div key={label} className="bg-surface-2 rounded-inner p-3">
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1">
                      {label}
                    </p>
                    <p className="font-sans text-sm text-text break-all">{get(cliente)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de compras */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                Historial de compras
              </p>

              {loadingCompras && (
                <div className="flex justify-center py-8">
                  <Loader2 size={22} className="animate-spin text-primary" />
                </div>
              )}

              {errorCompras && !loadingCompras && (
                <div className="flex items-center gap-2 py-6 font-sans text-sm text-text-muted">
                  <AlertCircle size={16} className="text-danger shrink-0" />
                  No se pudo cargar el historial de compras
                </div>
              )}

              {!loadingCompras && !errorCompras && compras.length === 0 && (
                <p className="py-6 text-center font-sans text-sm text-text-muted">
                  Sin compras registradas
                </p>
              )}

              {!loadingCompras && !errorCompras && compras.length > 0 && (
                <div className="border border-border-strong rounded-inner overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-2 border-b border-border-strong">
                        {HISTORIAL_COLS.map((h) => (
                          <th key={h} className="px-3 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-strong">
                      {compras.map((v) => (
                        <tr
                          key={v.id}
                          onClick={() => onSelectVenta(v.id)}
                          className="hover:bg-surface-2 transition-colors cursor-pointer text-sm"
                        >
                          <td className="px-3 py-2.5 font-mono text-xs text-text-muted">#{v.id}</td>
                          <td className="px-3 py-2.5 font-sans text-sm text-text-muted">
                            {v.hotelNombre ?? 'Sin alojamiento'}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-text-muted">
                            {v.fechaEntrada ?? '—'}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-text-muted">
                            {v.fechaSalida ?? '—'}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs font-semibold text-text">
                            {fmtEur(v.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border-strong p-6 shrink-0 flex justify-end">
            <Button variant="primary" onClick={onClose}>Cerrar</Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
