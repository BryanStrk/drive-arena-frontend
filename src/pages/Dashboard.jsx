import KpiCard from '@/components/KpiCard'
import AgeRangeSalesWidget from '@/components/dashboard/AgeRangeSalesWidget'

/**
 * Dashboard de zona privada — vista principal de control.
 *
 * Estructura:
 * 1. Header con título + descripción
 * 2. Fila de KPIs del día (4 widgets)
 * 3. Grid 2 cols: Ventas por edad + Top 3 Lodges
 * 4. Gráfico evolución mensual
 * 5. Tabla mantenimientos pendientes
 *
 * Los datos mock se reemplazarán por llamadas reales al backend
 * en una sesión posterior (sprint de integración).
 */

// === KPIs DEL DÍA ===
const TODAY_KPIS = [
  {
    label: 'Ventas hoy',
    value: '€ 4.250',
    delta: '+12.5% vs ayer',
    deltaType: 'positive',
    icon: '€',
  },
  {
    label: 'Reservas activas',
    value: '24',
    delta: 'Estable',
    deltaType: 'neutral',
    icon: '◆',
  },
  {
    label: 'Tiempo en pista',
    value: '142',
    suffix: 'h',
    delta: '-3.2% vs sem. ant.',
    deltaType: 'negative',
    icon: '⏱',
  },
  {
    label: 'Nuevos clientes',
    value: '18',
    delta: '+5 esta semana',
    deltaType: 'positive',
    icon: '+',
  },
]

// === VENTAS POR RANGO DE EDAD ===
const AGE_RANGE_SALES = {
  total: 1284,
  ranges: [
    { label: 'Junior (16-24)', value: 282, percentage: 22 },
    { label: 'Pro (25-45)', value: 835, percentage: 65 },
    { label: 'Veterano (46+)', value: 167, percentage: 13 },
  ],
}

function Dashboard() {
  return (
    <div className="min-h-full bg-bg p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Resumen General · Sesión Activa
        </p>
        <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
          Panel de Control
        </h1>
        <p className="mt-2 font-sans text-sm text-text-muted max-w-2xl">
          Estado operativo en tiempo real del resort. Métricas del día,
          actividad reciente y acciones pendientes.
        </p>
      </div>

      {/* FILA 1 — KPIs del día */}
      <section aria-label="Indicadores del día" className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TODAY_KPIS.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      {/* FILA 2 — Analítica: Edad + Top Lodges */}
      <section aria-label="Analítica" className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AgeRangeSalesWidget
            ranges={AGE_RANGE_SALES.ranges}
            total={AGE_RANGE_SALES.total}
          />
          <WidgetPlaceholder label="Top 3 Lodges" minHeight={240} />
        </div>
      </section>

      {/* FILA 3 — Gráfico evolución mensual */}
      <section aria-label="Evolución mensual" className="mb-8">
        <WidgetPlaceholder label="Evolución mensual de ingresos" minHeight={280} />
      </section>

      {/* FILA 4 — Mantenimientos pendientes */}
      <section aria-label="Mantenimientos pendientes" className="mb-8">
        <WidgetPlaceholder label="Mantenimientos pendientes" minHeight={240} />
      </section>
    </div>
  )
}

/**
 * Placeholder temporal para widgets no implementados todavía.
 * Se sustituyen por componentes funcionales en commits posteriores.
 */
function WidgetPlaceholder({ label, minHeight = 200 }) {
  return (
    <div
      className="bg-surface-1 border border-border-strong rounded-card p-6 flex items-center justify-center"
      style={{ minHeight: `${minHeight}px` }}
    >
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-dim">
        ▌ {label}
      </p>
    </div>
  )
}

export default Dashboard
