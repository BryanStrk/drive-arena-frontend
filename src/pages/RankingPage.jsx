import { useState, useEffect } from 'react'
import { Trophy, Medal, Flag } from 'lucide-react'

import { obtenerAtracciones } from '@/api/atracciones'
import { useRanking } from '@/hooks/useRanking'

/**
 * Página de ranking de pilotos.
 *
 * Flujo:
 *   1. Al montar, carga la lista de atracciones para el selector.
 *   2. Selecciona la primera por defecto.
 *   3. Por cada atracción seleccionada, fetch paralelo de ranking + récord
 *      vía useRanking hook.
 *
 * Estructura visual (de arriba a abajo):
 *   - Header con título y subtítulo
 *   - Selector de circuito (chips horizontales)
 *   - Banner del récord histórico (rojo destacado, con icono Trophy)
 *   - Podio top 3 con pedestales escalonados (1º más alto, en el centro)
 *   - Tabla del 4º al 20º
 */
export default function RankingPage() {
  const [atracciones, setAtracciones] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isLoadingAtracciones, setIsLoadingAtracciones] = useState(true)

  useEffect(() => {
    let cancelled = false
    obtenerAtracciones()
      .then((data) => {
        if (cancelled) return
        setAtracciones(data)
        if (data.length > 0) setSelectedId(data[0].id)
      })
      .catch((err) => console.error('Error al cargar atracciones:', err))
      .finally(() => {
        if (!cancelled) setIsLoadingAtracciones(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const { ranking, record, isLoading, error, refetch } = useRanking(selectedId, { top: 20 })

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
            Ranking
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            Tiempos cronometrados por circuito
          </p>
        </div>
      </div>

      {isLoadingAtracciones && (
        <p className="text-gray-500">Cargando circuitos...</p>
      )}

      {!isLoadingAtracciones && atracciones.length === 0 && (
        <div className="border border-white/10 p-12 text-center">
          <p className="text-gray-400">No hay circuitos registrados.</p>
        </div>
      )}

      {!isLoadingAtracciones && atracciones.length > 0 && (
        <>
          <CircuitoSelector
            atracciones={atracciones}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {isLoading && (
            <p className="text-gray-500 mt-8">Cargando ranking...</p>
          )}

          {error && !isLoading && (
            <div className="mt-8 border border-red-500/40 bg-red-500/10 p-4 text-red-300 flex items-center justify-between">
              <span>Error al cargar el ranking.</span>
              <button
                onClick={refetch}
                className="text-xs uppercase tracking-wider underline hover:text-white"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <RecordBanner record={record} />

              {ranking.length > 0 ? (
                <>
                  <Podium entries={ranking.slice(0, 3)} />
                  {ranking.length > 3 && (
                    <RankingTable entries={ranking.slice(3)} />
                  )}
                </>
              ) : (
                <div className="border border-white/10 p-12 text-center">
                  <p className="text-gray-400">
                    Sin tiempos registrados todavía para este circuito.
                  </p>
                  <p className="text-xs text-gray-600 mt-2 font-mono uppercase tracking-wider">
                    Los tiempos cronometrados aparecerán aquí
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

// =====================================================
// Selector de circuito
// =====================================================

function CircuitoSelector({ atracciones, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {atracciones.map((a) => {
        const active = a.id === selectedId
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={
              'inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-mono border transition-colors ' +
              (active
                ? 'bg-[#E0162B]/15 text-[#E0162B] border-[#E0162B]/50'
                : 'bg-white/[0.02] text-gray-400 border-white/10 hover:text-white hover:border-white/30')
            }
          >
            <Flag className="w-3.5 h-3.5" strokeWidth={2} />
            {a.nombre}
          </button>
        )
      })}
    </div>
  )
}

// =====================================================
// Banner del récord histórico
// =====================================================

function RecordBanner({ record }) {
  const hasRecord = record && record.tiempoRecord != null

  return (
    <div className="mb-10 border border-[#E0162B]/40 bg-gradient-to-r from-[#E0162B]/10 via-[#E0162B]/5 to-transparent p-6">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-[#E0162B]" strokeWidth={2} />
        <span className="text-xs uppercase tracking-widest font-mono text-[#E0162B]">
          Récord histórico
        </span>
        {record?.atraccionNombre && (
          <span className="text-xs text-gray-500 font-mono">
            · {record.atraccionNombre}
          </span>
        )}
      </div>
      {hasRecord ? (
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="text-4xl font-mono font-bold text-white">
            {formatTiempo(record.tiempoRecord)}
          </span>
          <span className="text-xl text-gray-300">{record.nombrePilotoRecord}</span>
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
            {formatFecha(record.fechaRecord)}
          </span>
        </div>
      ) : (
        <p className="text-gray-500 italic">Sin récord registrado todavía.</p>
      )}
    </div>
  )
}

// =====================================================
// Podio top 3 con pedestales escalonados
// =====================================================

const PODIUM_STYLES = {
  1: {
    Icon: Trophy,
    iconColor: 'text-yellow-400',
    borderColor: 'border-yellow-400/50',
    pedestalBg: 'bg-yellow-400/[0.08]',
    pedestalHeight: 'h-20',
    cardHeight: 'h-56',
  },
  2: {
    Icon: Medal,
    iconColor: 'text-gray-300',
    borderColor: 'border-gray-300/40',
    pedestalBg: 'bg-gray-300/[0.06]',
    pedestalHeight: 'h-14',
    cardHeight: 'h-52',
  },
  3: {
    Icon: Medal,
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-600/50',
    pedestalBg: 'bg-amber-600/[0.06]',
    pedestalHeight: 'h-10',
    cardHeight: 'h-48',
  },
}

function Podium({ entries }) {
  // Disposición visual: 2º a la izquierda, 1º en el centro, 3º a la derecha
  const layout = [
    { rank: 2, entry: entries[1] },
    { rank: 1, entry: entries[0] },
    { rank: 3, entry: entries[2] },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 items-end mb-10">
      {layout.map(({ rank, entry }, idx) =>
        entry ? (
          <PodiumColumn key={`${rank}-${entry.posicion}`} rank={rank} entry={entry} />
        ) : (
          <div key={`empty-${idx}`} />
        )
      )}
    </div>
  )
}

function PodiumColumn({ rank, entry }) {
  const s = PODIUM_STYLES[rank]
  const { Icon } = s

  return (
    <div className="flex flex-col">
      {/* Card principal */}
      <div
        className={`border ${s.borderColor} bg-white/[0.02] ${s.cardHeight} flex flex-col items-center justify-center px-4 text-center`}
      >
        <Icon className={`w-10 h-10 mb-3 ${s.iconColor}`} strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">
          Posición {rank}
        </p>
        <p className="text-white font-bold mb-3 truncate w-full text-sm">
          {entry.nombrePiloto}
        </p>
        <p className="text-2xl font-mono font-bold text-[#E0162B]">
          {formatTiempo(entry.tiempoSegundos)}
        </p>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">
          {formatFecha(entry.fechaRegistro)}
        </p>
      </div>

      {/* Pedestal */}
      <div
        className={`${s.pedestalBg} ${s.pedestalHeight} border-x border-b ${s.borderColor} flex items-center justify-center`}
      >
        <span className={`text-3xl font-mono font-bold ${s.iconColor}`}>
          {rank}
        </span>
      </div>
    </div>
  )
}

// =====================================================
// Tabla 4º+
// =====================================================

function RankingTable({ entries }) {
  return (
    <div className="border border-white/10 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <Th>Posición</Th>
            <Th>Piloto</Th>
            <Th align="right">Tiempo</Th>
            <Th>Fecha</Th>
            <Th>Tipo</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr
              key={e.posicion}
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <Td>
                <span className="font-mono text-gray-400 text-sm">#{e.posicion}</span>
              </Td>
              <Td>
                <span className="text-white">{e.nombrePiloto}</span>
              </Td>
              <Td align="right">
                <span className="font-mono text-white font-semibold">
                  {formatTiempo(e.tiempoSegundos)}
                </span>
              </Td>
              <Td>
                <span className="font-mono text-gray-400 text-sm">
                  {formatFecha(e.fechaRegistro)}
                </span>
              </Td>
              <Td>
                {e.clienteId != null ? (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#E0162B]/10 text-[#E0162B] border border-[#E0162B]/30">
                    Registrado
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-white/5 text-gray-500 border border-white/10">
                    Visitante
                  </span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// =====================================================
// Helpers
// =====================================================

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

/**
 * Formatea segundos como MM:SS.mmm
 *   83.456  → "1:23.456"
 *   123.5   → "2:03.500"
 *    9.001  → "0:09.001"
 */
function formatTiempo(segundos) {
  if (segundos == null) return '—'
  const total = Number(segundos)
  const min = Math.floor(total / 60)
  const sec = total - min * 60
  const secStr = sec < 10 ? `0${sec.toFixed(3)}` : sec.toFixed(3)
  return `${min}:${secStr}`
}

function formatFecha(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
