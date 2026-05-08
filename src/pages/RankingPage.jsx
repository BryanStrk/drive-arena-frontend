import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Flag, Medal, RefreshCw, Trophy } from 'lucide-react'

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
 *   - Selector de circuito (chips horizontales con icono Flag)
 *   - Banner del récord histórico (gradient sutil con Trophy)
 *   - Podio top 3 con cards alineadas y jerarquía sutil (Trophy gold > Medal)
 *   - Tabla del 4º al 20º
 *
 * Replica el lenguaje visual de Lodges: design tokens del proyecto,
 * font-display, font-sans, font-mono y bordes con border-border-strong.
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

  const { ranking, record, isLoading, error, refetch } = useRanking(
    selectedId,
    { top: 20 },
  )

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl uppercase tracking-wide text-white">
          Ranking
        </h1>
        <p className="font-sans text-sm text-white/50">
          Tiempos cronometrados por circuito
        </p>
      </header>

      {/* SELECTOR DE CIRCUITO */}
      {isLoadingAtracciones ? (
        <SelectorSkeleton />
      ) : atracciones.length === 0 ? (
        <div className="rounded-card border border-dashed border-border-strong bg-surface-1 p-8 text-center font-sans text-sm text-white/50">
          No hay circuitos registrados.
        </div>
      ) : (
        <CircuitoSelector
          atracciones={atracciones}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}

      {/* ESTADOS DEL RANKING */}
      {selectedId && (
        <>
          {isLoading && <RankingSkeleton />}

          {error && !isLoading && <ErrorState onRetry={refetch} />}

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
                <EmptyRankingState />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SELECTOR DE CIRCUITO
// ═══════════════════════════════════════════════════════════════════════

function CircuitoSelector({ atracciones, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {atracciones.map((a) => {
        const active = a.id === selectedId
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all ' +
              (active
                ? 'border-primary bg-primary/15 text-primary shadow-[0_0_15px_-5px_var(--color-primary-glow)]'
                : 'border-border-strong bg-surface-1 text-white/60 hover:border-white/30 hover:text-white')
            }
          >
            <Flag size={12} strokeWidth={2.5} />
            {a.nombre}
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BANNER DEL RÉCORD HISTÓRICO
// ═══════════════════════════════════════════════════════════════════════

function RecordBanner({ record }) {
  const hasRecord = record && record.tiempoRecord != null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-card border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
    >
      <div className="flex items-center gap-4 p-6">
        <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <Trophy size={26} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Récord histórico
            </span>
            {record?.atraccionNombre && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                · {record.atraccionNombre}
              </span>
            )}
          </div>

          {hasRecord ? (
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="font-mono text-3xl font-bold text-white">
                {formatTiempo(record.tiempoRecord)}
              </span>
              <span className="font-sans text-base text-white/80">
                {record.nombrePilotoRecord}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {formatFecha(record.fechaRecord)}
              </span>
            </div>
          ) : (
            <p className="font-sans text-sm italic text-white/40">
              Sin récord registrado todavía
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// PODIO TOP 3
// ═══════════════════════════════════════════════════════════════════════

const PODIUM_CONFIG = {
  1: {
    Icon: Trophy,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-400/10',
    iconBorder: 'border-yellow-400/30',
    cardBorder: 'border-yellow-400/40',
    cardShadow: 'shadow-[0_0_30px_-10px_rgb(250_204_21_/_0.3)]',
    rankBg: 'bg-yellow-400/[0.05]',
    rankColor: 'text-yellow-400',
  },
  2: {
    Icon: Medal,
    iconColor: 'text-zinc-300',
    iconBg: 'bg-zinc-300/10',
    iconBorder: 'border-zinc-300/30',
    cardBorder: 'border-border-strong',
    cardShadow: '',
    rankBg: 'bg-zinc-300/[0.04]',
    rankColor: 'text-zinc-300',
  },
  3: {
    Icon: Medal,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-600/10',
    iconBorder: 'border-amber-600/30',
    cardBorder: 'border-border-strong',
    cardShadow: '',
    rankBg: 'bg-amber-600/[0.04]',
    rankColor: 'text-amber-600',
  },
}

function Podium({ entries }) {
  // Disposición visual: 2º izquierda, 1º centro (destacado), 3º derecha
  const layout = [
    { rank: 2, entry: entries[1] },
    { rank: 1, entry: entries[0] },
    { rank: 3, entry: entries[2] },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {layout.map(({ rank, entry }, idx) =>
        entry ? (
          <PodiumCard
            key={`${rank}-${entry.posicion}`}
            rank={rank}
            entry={entry}
            featured={rank === 1}
          />
        ) : (
          <div key={`empty-${idx}`} />
        ),
      )}
    </div>
  )
}

function PodiumCard({ rank, entry, featured }) {
  const c = PODIUM_CONFIG[rank]
  const { Icon } = c

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`overflow-hidden rounded-card border ${c.cardBorder} bg-surface-1 ${c.cardShadow} ${
        featured ? 'sm:scale-[1.03]' : ''
      }`}
    >
      {/* Cabecera con icono */}
      <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-6">
        <div
          className={`grid size-14 place-items-center rounded-full border ${c.iconBorder} ${c.iconBg} ${c.iconColor}`}
        >
          <Icon size={26} strokeWidth={featured ? 2 : 1.75} />
        </div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Posición {rank}
        </p>
      </div>

      {/* Datos del piloto */}
      <div className="space-y-2 px-6 pb-6 text-center">
        <p
          className="font-display text-base uppercase tracking-wide text-white line-clamp-1"
          title={entry.nombrePiloto}
        >
          {entry.nombrePiloto}
        </p>
        <p className="font-mono text-2xl font-bold text-white">
          {formatTiempo(entry.tiempoSegundos)}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {formatFecha(entry.fechaRegistro)}
        </p>
      </div>

      {/* Pedestal con número grande */}
      <div
        className={`flex items-center justify-center border-t ${c.cardBorder} ${c.rankBg} py-3`}
      >
        <span
          className={`font-display text-3xl font-bold ${c.rankColor}`}
        >
          {rank}
        </span>
      </div>
    </motion.article>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// TABLA 4º+
// ═══════════════════════════════════════════════════════════════════════

function RankingTable({ entries }) {
  return (
    <div className="overflow-hidden rounded-card border border-border-strong bg-surface-1">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-strong bg-surface-2/40">
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
                className="border-b border-border-strong/50 transition-colors hover:bg-surface-2/30"
              >
                <Td>
                  <span className="font-mono text-sm text-white/50">
                    #{e.posicion}
                  </span>
                </Td>
                <Td>
                  <span className="font-sans text-sm text-white">
                    {e.nombrePiloto}
                  </span>
                </Td>
                <Td align="right">
                  <span className="font-mono text-sm font-semibold text-white">
                    {formatTiempo(e.tiempoSegundos)}
                  </span>
                </Td>
                <Td>
                  <span className="font-mono text-xs text-white/50">
                    {formatFecha(e.fechaRegistro)}
                  </span>
                </Td>
                <Td>
                  {e.clienteId != null ? (
                    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Registrado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border-strong bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      Visitante
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ESTADOS
// ═══════════════════════════════════════════════════════════════════════

function SelectorSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-9 w-32 animate-pulse rounded-lg bg-surface-2"
        />
      ))}
    </div>
  )
}

function RankingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner skeleton */}
      <div className="h-24 animate-pulse rounded-card border border-border-strong bg-surface-1" />

      {/* Podio skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-card border border-border-strong bg-surface-1"
          />
        ))}
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-border-strong bg-surface-1 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          No se pudo cargar el ranking
        </h3>
        <p className="font-sans text-sm text-white/50">
          Verifica tu conexión o reintenta en unos segundos
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-4 py-2 font-sans text-sm text-white transition-colors hover:border-primary hover:bg-primary/10"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

function EmptyRankingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-strong bg-surface-1 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Trophy size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">
          Sin tiempos todavía
        </h3>
        <p className="font-sans text-sm text-white/50">
          Los tiempos cronometrados aparecerán aquí cuando los pilotos los registren
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return (
    <th
      className={`px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 ${alignClass}`}
    >
      {children}
    </th>
  )
}

function Td({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return <td className={`px-4 py-3.5 ${alignClass}`}>{children}</td>
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
