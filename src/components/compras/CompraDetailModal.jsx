import { useEffect, useState } from 'react'
import { obtenerCompraPorId } from '@/api/compras'

/**
 * Modal de detalle de una compra.
 *
 * Carga el detalle completo (incluyendo entradas anidadas) al montarse.
 * Muestra:
 *   - Cabecera con código + datos cliente/hotel
 *   - Pensión, fechas (entrada/salida/compra) y origen
 *   - Lista de entradas con tipo de tarifa, acompañante y precio snapshot
 *   - Total destacado
 *
 * Cierre por click fuera, botón × o tecla Escape.
 */
export default function CompraDetailModal({ compraId, onClose }) {
  const [compra, setCompra] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carga del detalle
  useEffect(() => {
    let cancelled = false

    async function fetchDetalle() {
      try {
        setIsLoading(true)
        const data = await obtenerCompraPorId(compraId)
        if (!cancelled) setCompra(data)
      } catch (err) {
        if (!cancelled) {
          console.error('Error al cargar detalle de compra:', err)
          setError(err)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchDetalle()
    return () => {
      cancelled = true
    }
  }, [compraId])

  // Cierre con Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#0A0A0A] border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header sticky */}
        <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">
              Detalle de venta
            </p>
            <h2 className="text-2xl font-bold text-white mt-1 font-mono tracking-wider">
              {compra?.codigo ?? `#${compraId}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading && (
            <p className="text-gray-500">Cargando detalle...</p>
          )}

          {error && (
            <div className="border border-red-500/40 bg-red-500/10 p-4 text-red-300">
              No se pudo cargar el detalle de la venta.
            </div>
          )}

          {compra && (
            <>
              {/* Info general */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
                <Field label="Cliente" value={compra.clienteNombreCompleto} />
                <Field label="Hotel" value={compra.hotelNombre} />
                <Field label="Fecha entrada" value={formatFecha(compra.fechaEntrada)} mono />
                <Field label="Fecha salida" value={formatFecha(compra.fechaSalida)} mono />
                <Field label="Pensión" value={compra.tipoPension} mono />
                <Field
                  label="Origen"
                  value={compra.usuarioSistemaUsername ?? 'Web (cliente)'}
                  mono
                />
                <Field
                  label="Fecha de venta"
                  value={formatFechaHora(compra.fechaCompra)}
                  mono
                  span={2}
                />
              </div>

              {/* Entradas */}
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-mono">
                  Entradas ({compra.entradas?.length ?? 0})
                </h3>
                {compra.entradas && compra.entradas.length > 0 ? (
                  <div className="border border-white/10 divide-y divide-white/5">
                    {compra.entradas.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div>
                          <p className="text-white font-mono text-xs uppercase tracking-wider">
                            {e.tarifaTipo ?? 'TARIFA'}
                          </p>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {[e.nombreAcompanante, e.apellidosAcompanante]
                              .filter(Boolean)
                              .join(' ') || (
                              <span className="italic text-gray-600">
                                Sin acompañante
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="font-mono text-white">
                          {formatEur(e.precio)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin entradas asociadas.</p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-mono">
                  Total
                </span>
                <span className="text-2xl font-mono font-bold text-[#E0162B]">
                  {formatEur(compra.total)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Helpers
// =====================================================

function Field({ label, value, mono = false, span = 1 }) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1 font-mono">
        {label}
      </p>
      <p className={`text-white ${mono ? 'font-mono text-sm' : ''}`}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function formatFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatFechaHora(s) {
  if (!s) return '—'
  return new Date(s).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatEur(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(n)
}
