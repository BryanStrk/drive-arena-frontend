import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts'

/**
 * Widget "Evolución mensual de ingresos".
 *
 * Renderiza un gráfico de líneas con los ingresos mensuales del año.
 * Los meses futuros (sin datos) se muestran como gaps en la línea,
 * y el mes actual se destaca con un punto grande resaltado.
 *
 * Usa Recharts con un Tooltip custom para mantener la estética
 * cyber/motorsport del proyecto.
 *
 * @param {Object} props
 * @param {Array<{month: string, revenue: number|null}>} props.data
 * @param {string} props.currentMonth - Label del mes actual (ej. 'MAY')
 * @param {number} props.year - Año de referencia
 */
function MonthlyRevenueWidget({ data, currentMonth, year }) {
  // Buscamos el dato del mes actual para destacarlo
  const currentMonthData = data.find((d) => d.month === currentMonth)

  // Calculamos el total acumulado del año (solo meses con datos)
  const totalRevenue = data
    .filter((d) => d.revenue !== null)
    .reduce((sum, d) => sum + d.revenue, 0)

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

      {/* Gráfico */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--color-border-strong)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
              }}
              axisLine={{ stroke: 'var(--color-border-strong)' }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'var(--color-primary)',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
            />
            <Line
              type="linear"
              dataKey="revenue"
              stroke="#E0162B"
              strokeWidth={2.5}
              dot={{
                fill: '#E0162B',
                stroke: '#E0162B',
                r: 3,
              }}
              activeDot={{
                fill: '#E0162B',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 5,
              }}
              connectNulls={false}
              isAnimationActive={false}
            />
            {/* Punto destacado para el mes actual */}
            {currentMonthData && currentMonthData.revenue !== null && (
              <ReferenceDot
                x={currentMonth}
                y={currentMonthData.revenue}
                r={6}
                fill="#E0162B"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

/**
 * Tooltip custom para mantener la estética del proyecto.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value
  if (value === null || value === undefined) return null

  return (
    <div className="bg-surface-2 border border-primary rounded-inner px-3 py-2 shadow-[0_0_15px_rgba(224,22,43,0.3)]">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-1">
        {label}
      </p>
      <p className="font-display font-bold text-base tabular-nums text-primary">
        € {value.toLocaleString('es-ES')}
      </p>
    </div>
  )
}

export default MonthlyRevenueWidget
