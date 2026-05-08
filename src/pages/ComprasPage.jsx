import { useState } from 'react'
import { useCompras } from '@/hooks/useCompras'
import CompraDetailModal from '@/components/compras/CompraDetailModal'

/**
 * Página de listado de compras (reservas).
 *
 * Distingue visualmente entre:
 *  - Compras WEB (usuarioSistemaUsername === null) → reservadas desde el wizard público
 *  - Compras de TAQUILLA (usuarioSistemaUsername !== null) → registradas por un empleado
 *
 * Permite ver el detalle completo (cliente + fechas + entradas + total) en un modal.
 */
export default function ComprasPage() {
  const { compras, isLoading, error, refetch } = useCompras()
  const [selectedId, setSelectedId] = useState(null)

  return (
    <>
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              Compras
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              {isLoading
                ? 'Cargando...'
                : `${compras.length} ${compras.length === 1 ? 'reserva registrada' : 'reservas registradas'}`}
            </p>
          </div>
        </div>

        {/* Estados */}
        {isLoading && <p className="text-gray-500">Cargando compras...</p>}

        {error && !isLoading && (
          <div className="border border-red-500/40 bg-red-500/10 p-4 text-red-300 flex items-center justify-between">
            <span>Error al cargar las compras.</span>
            <button
              onClick={refetch}
              className="text-xs uppercase tracking-wider underline hover:text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && compras.length === 0 && (
          <div className="border border-white/10 p-12 text-center">
            <p className="text-gray-400">No hay compras registradas todavía.</p>
            <p className="text-xs text-gray-600 mt-2 font-mono uppercase tracking-wider">
              Las reservas del wizard público aparecerán aquí
            </p>
          </div>
        )}

        {/* Tabla */}
        {!isLoading && !error && compras.length > 0 && (
          <div className="border border-white/10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <Th>Código</Th>
                  <Th>Cliente</Th>
                  <Th>Hotel</Th>
                  <Th>Pensión</Th>
                  <Th>Entrada</Th>
                  <Th>Salida</Th>
                  <Th align="right">Total</Th>
                  <Th>Origen</Th>
                  <Th align="right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <Td>
                      <span className="font-mono text-xs text-[#E0162B] tracking-wider">
                        {c.codigo ?? '—'}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-white">{c.clienteNombreCompleto}</span>
                    </Td>
                    <Td>
                      <span className="text-gray-300">{c.hotelNombre}</span>
                    </Td>
                    <Td>
                      <PensionBadge tipo={c.tipoPension} />
                    </Td>
                    <Td>
                      <span className="text-gray-400 font-mono text-sm">
                        {formatFecha(c.fechaEntrada)}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-gray-400 font-mono text-sm">
                        {formatFecha(c.fechaSalida)}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-mono text-white font-semibold">
                        {formatEur(c.total)}
                      </span>
                    </Td>
                    <Td>
                      <OrigenBadge usuario={c.usuarioSistemaUsername} />
                    </Td>
                    <Td align="right">
                      <button
                        onClick={() => setSelectedId(c.id)}
                        className="text-xs uppercase tracking-wider text-[#E0162B] hover:text-white transition-colors font-mono"
                      >
                        Ver detalle →
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

// =====================================================
// Helpers de presentación
// =====================================================

function formatFecha(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatEur(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(n)
}

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500 ${alignClass}`}
    >
      {children}
    </th>
  )
}

function Td({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return <td className={`px-4 py-4 text-sm ${alignClass}`}>{children}</td>
}

function PensionBadge({ tipo }) {
  const labels = {
    SIN: 'Sin pensión',
    MEDIA: 'Media',
    COMPLETA: 'Completa',
  }
  const styles = {
    SIN: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    MEDIA: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    COMPLETA: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-mono uppercase border ${styles[tipo] ?? styles.SIN}`}
    >
      {labels[tipo] ?? tipo ?? '—'}
    </span>
  )
}

function OrigenBadge({ usuario }) {
  if (!usuario) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-[#E0162B]/10 text-[#E0162B] border border-[#E0162B]/30">
        WEB
      </span>
    )
  }
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10"
      title="Compra registrada por un empleado en taquilla"
    >
      {usuario}
    </span>
  )
}
