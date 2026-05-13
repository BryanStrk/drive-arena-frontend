import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import Button from '@/components/Button'

/**
 * Modal de confirmación post-compra.
 * Recibe la compra creada (respuesta del backend) + datos de apoyo
 * (cliente, hotel, tarifa) para mostrar un resumen completo.
 */
export default function TicketModal({ compra, cliente, hotel, onClose }) {
  if (!compra) return null

  const rows = [
    { label: 'ID Compra', value: `#${compra.id}` },
    { label: 'Cliente',   value: `${cliente?.nombre ?? ''} ${cliente?.apellidos ?? ''}`.trim() },
    { label: 'DNI',       value: cliente?.dni ?? '—' },
    { label: 'Lodge',     value: hotel?.nombre ?? compra.hotelNombre ?? '—' },
    { label: 'Pensión',   value: compra.tipoPension ?? '—' },
    { label: 'Entrada',   value: compra.fechaEntrada ?? '—' },
    { label: 'Salida',    value: compra.fechaSalida ?? '—' },
    { label: 'Entradas',  value: compra.entradas?.length ?? '—' },
    { label: 'Total',     value: compra.total != null ? `€ ${Number(compra.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : '—' },
  ]

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
          className="w-full max-w-md rounded-card border border-border-strong bg-surface-1 shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={22} className="text-success shrink-0" />
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-success">
                  Compra registrada
                </p>
                <h2 className="font-display text-2xl uppercase tracking-wide text-text">
                  Ticket de venta
                </h2>
              </div>
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

          {/* Rows */}
          <div className="divide-y divide-border-strong px-6 py-2">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="font-mono text-[11px] tracking-widest uppercase text-text-muted">
                  {label}
                </span>
                <span className="font-mono text-sm text-text font-semibold">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <footer className="border-t border-border-strong p-6">
            <Button variant="primary" fullWidth onClick={onClose}>
              Cerrar y nueva venta
            </Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
