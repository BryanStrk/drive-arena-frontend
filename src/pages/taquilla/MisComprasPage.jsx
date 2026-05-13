import { useState, useMemo } from 'react'
import { RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react'

import { useCompras } from '@/hooks/useCompras'
import { useAuth } from '@/context/useAuth'
import VentaDetailModal from '@/components/taquilla/VentaDetailModal'
import Button from '@/components/Button'

const COLS = [
  { label: 'ID',       key: 'id' },
  { label: 'Cliente',  key: 'clienteNombreCompleto' },
  { label: 'Lodge',    key: 'hotelNombre' },
  { label: 'Pensión',  key: 'tipoPension' },
  { label: 'Entrada',  key: 'fechaEntrada' },
  { label: 'Salida',   key: 'fechaSalida' },
  { label: 'Total',    key: 'total' },
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

export default function MisVentasPage() {
  const { user } = useAuth()
  const { compras, isLoading, error, refetch } = useCompras()
  const [selectedId, setSelectedId] = useState(null)

  const misVentas = useMemo(
    () => compras.filter((c) => c.usuarioSistemaUsername === user?.username),
    [compras, user?.username]
  )

  return (
    <div className="min-h-full bg-bg p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Taquilla · Historial
          </p>
          <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
            Mis Ventas
          </h1>
          {!isLoading && !error && (
            <p className="mt-1 font-mono text-xs text-text-muted">
              {misVentas.length} registro{misVentas.length !== 1 ? 's' : ''} en este turno
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={refetch} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </Button>
      </div>

      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle size={32} className="text-danger" />
          <p className="font-sans text-sm text-text-muted">No se pudieron cargar las ventas</p>
          <Button variant="secondary" size="sm" onClick={refetch}>Reintentar</Button>
        </div>
      )}

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
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : misVentas.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLS.length} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingBag size={28} className="text-text-dim" />
                            <p className="font-sans text-sm text-text-muted">
                              Aún no hay ventas en este turno
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                    : misVentas.map((v) => (
                      <tr
                        key={v.id}
                        onClick={() => setSelectedId(v.id)}
                        className="hover:bg-surface-2 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">#{v.id}</td>
                        <td className="px-4 py-3 font-sans text-sm text-text">{v.clienteNombreCompleto ?? '—'}</td>
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
        </div>
      )}

      {selectedId && (
        <VentaDetailModal ventaId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
