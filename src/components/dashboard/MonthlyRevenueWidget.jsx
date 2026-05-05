import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Widget "Evolución mensual de ingresos".
 *
 * Renderiza un gráfico de líneas SVG manual con los ingresos mensuales del año.
 * Los meses futuros (revenue === null) se muestran como gaps en la línea.
 * El mes actual se destaca con un punto grande con borde blanco.
 *
 * Implementación SVG manual (sin librerías) para máximo control visual
 * y cero dependencias gráficas. Responsive vía ResizeObserver.
 *
 * @param {Object} props
 * @param {Array<{month: string, revenue: number|null}>} props.data
 * @param {string} props.currentMonth - Label del mes actual (ej. 'MAY')
 * @param {number} props.year - Año de referencia
 */
function MonthlyRevenueWidget({ data, currentMonth, year }) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Medimos el ancho real del contenedor con ResizeObserver para que el SVG
  // escale en pixels reales (no via preserveAspectRatio) y los círculos
  // queden siempre redondos sin distorsión.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    setContainerWidth(node.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Total acumulado del header (solo meses con datos)
  const totalRevenue = useMemo(
    () =>
      data
        .filter((d) => d.revenue !== null)
        .reduce((sum, d) => sum + d.revenue, 0),
    [data],
  )

  // === Geometría del chart ===
  const HEIGHT = 256
  const PADDING = { top: 16, right: 16, bottom: 32, left: 48 }
  const width = Math.max(containerWidth, 320)
  const innerWidth = width - PADDING.left - PADDING.right
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom

  // Escala Y: redondeamos al múltiplo de 5K superior para que los ticks queden limpios
  const validRevenues = data
    .filter((d) => d.revenue !== null)
    .map((d) => d.revenue)
  const maxRevenue =
    validRevenues.length > 0 ? Math.max(...validRevenues) : 5000
  const yMax = Math.ceil(maxRevenue / 5000) * 5000 || 5000
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(yMax * p))

  // Proyección de coordenadas data → SVG
  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : 0
  const getX = (i) => PADDING.left + i * xStep
  const getY = (revenue) =>
    PADDING.top + innerHeight - (revenue / yMax) * innerHeight

  // Segmentos de la línea: rompemos en cada null para no conectar gaps
  const segments = []
  let currentSegment = []
  data.forEach((d, i) => {
    if (d.revenue === null) {
      if (currentSegment.length > 1) segments.push(currentSegment)
      currentSegment = []
    } else {
      currentSegment.push({ x: getX(i), y: getY(d.revenue) })
    }
  })
  if (currentSegment.length > 1) segments.push(currentSegment)

  const hoveredPoint =
    hoveredIndex !== null && data[hoveredIndex]?.revenue != null
      ? data[hoveredIndex]
      : null

  // Estilos reutilizados (los CSS vars necesitan style inline en SVG)
  const mutedTextStyle = {
    fill: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
  }
  const gridLineStyle = { stroke: 'var(--color-border-strong)' }

  return (
    <article className="bg-surface-1 border border-border-strong rounded-card p-6">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            ▌ Tendencia
          </p>
          <h2 className="mt-1 font-display font-bold text-lg tracking-tight text-text">
            Evolución mensual · Ingresos {year}
          </h2>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            Acumulado
          </p>
          <p className="font-display font-bold text-lg tabular-nums text-text">
            € {(totalRevenue / 1000).toFixed(1)}K
          </p>
        </div>
      </header>

      {/* Gráfico SVG */}
      <div ref={containerRef} className="relative h-64 w-full">
        {containerWidth > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="block"
          >
            {/* Grid horizontal + labels eje Y */}
            {yTicks.map((tick, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={PADDING.left}
                  x2={width - PADDING.right}
                  y1={getY(tick)}
                  y2={getY(tick)}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  style={gridLineStyle}
                />
                <text
                  x={PADDING.left - 8}
                  y={getY(tick) + 3}
                  textAnchor="end"
                  fontSize="10"
                  style={mutedTextStyle}
                >
                  {(tick / 1000).toFixed(0)}K
                </text>
              </g>
            ))}

            {/* Labels eje X */}
            {data.map((d, i) => (
              <text
                key={`x-${d.month}`}
                x={getX(i)}
                y={HEIGHT - 12}
                textAnchor="middle"
                fontSize="10"
                letterSpacing="1"
                style={mutedTextStyle}
              >
                {d.month}
              </text>
            ))}

            {/* Línea principal (segmentos respetando los gaps) */}
            {segments.map((segment, i) => {
              const path = segment
                .map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                .join(' ')
              return (
                <path
                  key={`segment-${i}`}
                  d={path}
                  fill="none"
                  stroke="#E0162B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}

            {/* Cursor vertical en hover */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                x2={getX(hoveredIndex)}
                y1={PADDING.top}
                y2={PADDING.top + innerHeight}
                stroke="#E0162B"
                strokeWidth="1"
                strokeDasharray="3 3"
                pointerEvents="none"
              />
            )}

            {/* Puntos de cada mes con datos */}
            {data.map((d, i) => {
              if (d.revenue === null) return null
              const isCurrent = d.month === currentMonth
              return (
                <circle
                  key={`point-${d.month}`}
                  cx={getX(i)}
                  cy={getY(d.revenue)}
                  r={isCurrent ? 6 : 3}
                  fill="#E0162B"
                  stroke={isCurrent ? '#FFFFFF' : '#E0162B'}
                  strokeWidth={isCurrent ? 2 : 1}
                  pointerEvents="none"
                />
              )
            })}

            {/* Hit areas transparentes para el hover */}
            {data.map((d, i) => (
              <rect
                key={`hit-${d.month}`}
                x={getX(i) - xStep / 2}
                y={PADDING.top}
                width={xStep || innerWidth}
                height={innerHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  cursor: d.revenue !== null ? 'pointer' : 'default',
                }}
              />
            ))}
          </svg>
        )}

        {/* Tooltip flotante */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-surface-2 border border-primary rounded-inner px-3 py-2 shadow-[0_0_15px_rgba(224,22,43,0.3)] -translate-x-1/2"
            style={{
              left: `${getX(hoveredIndex)}px`,
              top: `${getY(hoveredPoint.revenue) - 60}px`,
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-1 whitespace-nowrap">
              {hoveredPoint.month}
            </p>
            <p className="font-display font-bold text-base tabular-nums text-primary whitespace-nowrap">
              € {hoveredPoint.revenue.toLocaleString('es-ES')}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

export default MonthlyRevenueWidget
