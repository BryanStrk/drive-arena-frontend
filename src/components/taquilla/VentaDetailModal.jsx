import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { obtenerCompraPorId } from '@/api/compras'
import Button from '@/components/Button'

const fmtEur = (v) =>
  v != null
    ? `€ ${Number(v).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—'

const INFO_ROWS = [
  { label: 'Cliente',    get: (v) => v.clienteNombreCompleto ?? '—' },
  { label: 'Lodge',      get: (v) => v.hotelNombre ?? 'Sin alojamiento' },
  { label: 'Pensión',    get: (v) => v.tipoPension ?? '—' },
  { label: 'Entrada',    get: (v) => v.fechaEntrada ?? '—' },
  { label: 'Salida',     get: (v) => v.fechaSalida ?? '—' },
  { label: 'Registrado', get: (v) => v.fechaCompra ? v.fechaCompra.split('T')[0] : '—' },
  { label: 'Operador',   get: (v) => v.usuarioSistemaUsername ?? '—' },
]

export default function VentaDetailModal({ ventaId, onClose }) {
  // Modal mounts fresh for every ventaId → start in loading state safely
  const [venta, setVenta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerCompraPorId(ventaId)
      .then((data) => { setVenta(data); setError(null) })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false))
  }, [ventaId])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-card border border-border-strong bg-surface-1 shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6 shrink-0">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Detalle de venta
              </p>
              <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-text">
                {venta ? `Venta #${venta.id}` : `Venta #${ventaId}`}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong bg-surface-2 text-text-muted transition-colors hover:border-primary hover:text-text"
            >
              <X size={16} />
            </button>
          </header>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            )}

            {error && !isLoading && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <AlertCircle size={28} className="text-danger" />
                <p className="font-sans text-sm text-text-muted">No se pudo cargar el detalle</p>
              </div>
            )}

            {venta && !isLoading && (
              <>
                {/* Info general */}
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                    Datos generales
                  </p>
                  <div className="divide-y divide-border-strong border border-border-strong rounded-inner">
                    {INFO_ROWS.map(({ label, get }) => (
                      <div key={label} className="flex items-center justify-between px-4 py-2.5">
                        <span className="font-mono text-[11px] tracking-widest uppercase text-text-muted">
                          {label}
                        </span>
                        <span className="font-sans text-sm text-text text-right">
                          {get(venta)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entradas desglosadas */}
                {venta.entradas?.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                      Entradas ({venta.entradas.length})
                    </p>
                    <div className="border border-border-strong rounded-inner overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-2 border-b border-border-strong">
                            {['#', 'Tarifa', 'Precio', 'Acompañante'].map((h) => (
                              <th key={h} className="px-3 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-strong">
                          {venta.entradas.map((e, idx) => (
                            <tr key={e.id ?? idx} className="text-sm">
                              <td className="px-3 py-2.5 font-mono text-xs text-text-muted">{idx + 1}</td>
                              <td className="px-3 py-2.5 font-sans text-text">
                                {e.tarifaNombre ?? e.tarifa?.nombre ?? '—'}
                              </td>
                              <td className="px-3 py-2.5 font-mono text-xs text-text">
                                {fmtEur(e.precioUnitario ?? e.precio)}
                              </td>
                              <td className="px-3 py-2.5 font-sans text-xs text-text-muted">
                                {e.nombreAcompanante
                                  ? `${e.nombreAcompanante} ${e.apellidosAcompanante ?? ''}`.trim()
                                  : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-border-strong p-6 shrink-0 flex items-center justify-between gap-4">
            {venta?.total != null ? (
              <p className="font-display font-bold text-lg text-text">
                Total: <span className="text-primary">{fmtEur(venta.total)}</span>
              </p>
            ) : (
              <span />
            )}
            <Button variant="primary" onClick={onClose}>Cerrar</Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
