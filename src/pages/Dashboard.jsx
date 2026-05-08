import KpiCard from '@/components/KpiCard'
import AgeRangeSalesWidget from '@/components/dashboard/AgeRangeSalesWidget'
import TopLodgesWidget from '@/components/dashboard/TopLodgesWidget'
import MonthlyRevenueWidget from '@/components/dashboard/MonthlyRevenueWidget'
import PendingMaintenanceWidget from '@/components/dashboard/PendingMaintenanceWidget'

/**
 * Dashboard de zona privada — vista principal de control.
 *
 * Estructura:
 * 1. Header con título + descripción
 * 2. Fila de KPIs del día (4 widgets)
 * 3. Grid 2 cols: Ventas por edad + Top 3 Lodges
 * 4. Gráfico evolución mensual de ingresos
 * 5. Tabla mantenimientos pendientes (datos REALES del backend)
 *
 * Estado de integración con backend:
 *   ✅ Mantenimientos pendientes → conectado a GET /mantenimientos?estado=PENDIENTE
 *   ⏳ KPIs del día (mock data, pendiente integración)
 *   ⏳ Ventas por rango de edad (mock data, requiere fechaNacimiento en Cliente)
 *   ⏳ Top 3 Lodges del mes (mock data, requiere agregación de Compras)
 *   ⏳ Evolución mensual ingresos (mock data, requiere agregación de Compras)
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

// === TOP 3 LODGES DEL MES ===
const TOP_LODGES = [
  {
    position: 1,
    name: 'Apex Lodge',
    zone: 'Zona Norte · VIP Paddock',
    category: 'VIP',
    revenue: 52300,
  },
  {
    position: 2,
    name: 'Pit Stop Lodge',
    zone: 'Zona Este · Familiar',
    category: 'Familiar',
    revenue: 35100,
  },
]

// === EVOLUCIÓN MENSUAL DE INGRESOS (2026) ===
const MONTHLY_REVENUE = {
  year: 2026,
  currentMonth: 'MAY',
  data: [
    { month: 'ENE', revenue: 12400 },
    { month: 'FEB', revenue: 14800 },
    { month: 'MAR', revenue: 18200 },
    { month: 'ABR', revenue: 22100 },
    { month: 'MAY', revenue: 19850 },
    { month: 'JUN', revenue: null },
    { month: 'JUL', revenue: null },
    { month: 'AGO', revenue: null },
    { month: 'SEP', revenue: null },
    { month: 'OCT', revenue: null },
    { month: 'NOV', revenue: null },
    { month: 'DIC', revenue: null },
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
          <TopLodgesWidget lodges={TOP_LODGES} />
        </div>
      </section>

      {/* FILA 3 — Gráfico evolución mensual */}
      <section aria-label="Evolución mensual" className="mb-8">
        <MonthlyRevenueWidget
          data={MONTHLY_REVENUE.data}
          currentMonth={MONTHLY_REVENUE.currentMonth}
          year={MONTHLY_REVENUE.year}
        />
      </section>

      {/* FILA 4 — Mantenimientos pendientes (datos reales del backend) */}
      <section aria-label="Mantenimientos pendientes" className="mb-8">
        <PendingMaintenanceWidget />
      </section>
    </div>
  )
}

export default Dashboard
