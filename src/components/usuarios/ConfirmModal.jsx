import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, AlertTriangle } from 'lucide-react'
import Button from '@/components/Button'

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  danger = false,
  onConfirm,
  onClose,
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
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
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-card border border-border-strong bg-surface-1 shadow-2xl sm:rounded-card"
        >
          {/* Header */}
          <header className="flex items-start justify-between gap-4 border-b border-border-strong p-6">
            <div className="flex items-center gap-3">
              <div className={`grid size-9 shrink-0 place-items-center rounded-full ${danger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                <AlertTriangle size={16} />
              </div>
              <h2 className="font-display text-xl uppercase tracking-wide text-text">
                {title}
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
          <div className="px-6 py-5">
            <p className="font-sans text-sm text-text-muted leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-3 border-t border-border-strong p-6">
            <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant={danger ? 'danger' : 'primary'}
              size="md"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Procesando...</> : confirmLabel}
            </Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
