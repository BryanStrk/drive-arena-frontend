import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, Printer, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

import { enviarTicket } from '@/api/compras'
import Button from '@/components/Button'

const TIPO_LABELS = { ADULTO: 'Adulto', NINO: 'Niño', PENSIONISTA: 'Pensionista' }

const fmtEur = (v) =>
  v != null
    ? `€ ${Number(v).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
    : '—'

export default function TicketModal({ compra, cliente, hotel, onClose }) {
  const [sending, setSending] = useState(false)

  if (!compra) return null

  const clienteNombre = `${cliente?.nombre ?? ''} ${cliente?.apellidos ?? ''}`.trim()

  const infoRows = [
    { label: 'ID Compra', value: `#${compra.id}` },
    { label: 'Cliente',   value: clienteNombre || '—' },
    { label: 'DNI',       value: cliente?.dni ?? '—' },
    { label: 'Lodge',     value: hotel?.nombre ?? compra.hotelNombre ?? '—' },
    { label: 'Pensión',   value: compra.tipoPension ?? '—' },
    { label: 'Entrada',   value: compra.fechaEntrada ?? '—' },
    { label: 'Salida',    value: compra.fechaSalida ?? '—' },
    { label: 'Entradas',  value: compra.entradas?.length ?? '—' },
    { label: 'Total',     value: fmtEur(compra.total) },
  ]

  const handleSendEmail = async () => {
    setSending(true)
    try {
      await enviarTicket(compra.id)
      const email = cliente?.email
      toast.success(email ? `Ticket enviado a ${email}` : 'Ticket enviado correctamente')
    } catch (err) {
      const status = err.response?.status
      toast.error(
        status === 400
          ? 'El cliente no tiene email registrado'
          : 'No se pudo enviar el ticket'
      )
    } finally {
      setSending(false)
    }
  }

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
          className="w-full max-w-md rounded-card border border-border-strong bg-surface-1 shadow-2xl print-area"
        >
          {/* ── PRINT-ONLY HEADER ─────────────────────────────────────── */}
          <div className="print-only" style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.12em', marginBottom: '2px' }}>
              DRIVE ARENA
            </p>
            <p style={{ fontSize: '13px', letterSpacing: '0.25em' }}>
              TICKET DE COMPRA
            </p>
            <p style={{ fontSize: '11px', marginTop: '6px', color: '#555' }}>
              {new Date().toLocaleString('es-ES')}
            </p>
          </div>

          {/* ── SCREEN HEADER (hidden on print) ───────────────────────── */}
          <header className="no-print flex items-start justify-between gap-4 border-b border-border-strong p-6">
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

          {/* ── DATA ROWS (visible on both) ────────────────────────────── */}
          <div className="divide-y divide-border-strong px-6 py-2">
            {infoRows.map(({ label, value }) => (
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

          {/* ── ENTRIES BREAKDOWN (visible on both) ───────────────────── */}
          {compra.entradas?.length > 0 && (
            <div className="px-6 pb-4 mt-2">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-2">
                Desglose de entradas
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid currentColor' }}>
                    <th style={{ textAlign: 'left', padding: '4px 0', fontFamily: 'inherit', letterSpacing: '0.1em', fontSize: '10px' }}>
                      TARIFA
                    </th>
                    <th style={{ textAlign: 'right', padding: '4px 0', fontFamily: 'inherit', letterSpacing: '0.1em', fontSize: '10px' }}>
                      PRECIO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compra.entradas.map((e, i) => (
                    <tr key={e.id ?? i}>
                      <td style={{ padding: '4px 0' }}>
                        {[TIPO_LABELS[e.tipoTarifa], e.tarifaDescripcion].filter(Boolean).join(' · ') || '—'}
                      </td>
                      <td style={{ textAlign: 'right', padding: '4px 0', fontFamily: 'monospace' }}>
                        {fmtEur(e.precio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PRINT-ONLY TOTAL + SIGN-OFF ───────────────────────────── */}
          <div className="print-only" style={{ borderTop: '2px solid #000', marginTop: '16px', paddingTop: '14px' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'right', letterSpacing: '0.05em' }}>
              TOTAL: {fmtEur(compra.total)}
            </p>
            <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '28px', letterSpacing: '0.15em', color: '#555' }}>
              ★ GRACIAS POR SU VISITA ★
            </p>
            <p style={{ fontSize: '10px', textAlign: 'center', marginTop: '4px', color: '#888' }}>
              www.drivearena.com
            </p>
          </div>

          {/* ── SCREEN FOOTER (hidden on print) ───────────────────────── */}
          <footer className="no-print border-t border-border-strong p-6 flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              className="flex-1"
            >
              <Printer size={14} />
              Imprimir
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendEmail}
              disabled={sending}
              className="flex-1"
            >
              <Mail size={14} />
              {sending ? 'Enviando...' : 'Enviar Email'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Cerrar
            </Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
