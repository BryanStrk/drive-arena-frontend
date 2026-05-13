import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { RefreshCw, AlertCircle } from 'lucide-react'

import { useDashboard } from '@/hooks/useDashboard'
import KpiCard from '@/components/KpiCard'
import AgeRangeSalesWidget from '@/components/dashboard/AgeRangeSalesWidget'
import TopLodgesWidget from '@/components/dashboard/TopLodgesWidget'
import MonthlyRevenueWidget from '@/components/dashboard/MonthlyRevenueWidget'
import PendingMaintenanceWidget from '@/components/dashboard/PendingMaintenanceWidget'
import MantenimientosWidget from '@/components/dashboard/MantenimientosWidget'
import Button from '@/components/Button'

// ── Constantes de fecha ────────────────────────────────────────────────────
const MONTH_LABELS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
const CURRENT_MONTH = MONTH_LABELS[new Date().getMonth()]
const CURRENT_YEAR = new Date().getFullYear()

// ── Normalización — mapea el DTO del back a las props de cada widget ────────

function buildKpis(data) {
  const fmt = (n) =>
    n != null
      ? Number(n).toLocaleString('es-ES', { minimumFractionDigits: 0 })
      : '—'

  return [
    {
      label: 'Ventas hoy',
      value: data.ventasHoy != null ? `€ ${fmt(data.ventasHoy)}` : '—',
      deltaType: 'neutral',
      icon: '€',
    },
    {
      label: 'Reservas activas',
      value: fmt(data.reservasActivas),
      deltaType: 'neutral',
      icon: '◆',
    },
    {
      label: 'Tiempo en pista',
      value: fmt(data.tiempoEnPistaHoras ?? data.tiempoEnPista),
      suffix: 'h',
      deltaType: 'neutral',
      icon: '⏱',
    },
    {
      label: 'Nuevos clientes',
      value: fmt(data.nuevosClientesSemana ?? data.nuevosClientes),
      deltaType: 'neutral',
      icon: '+',
    },
  ]
}

// ventasPorEdad comes as { junior: {porcentaje, total}, pro: {...}, veterano: {...} }
function buildAgeRanges(ventasPorEdad) {
  if (!ventasPorEdad) return []
  const MAP = [
    { key: 'junior',   label: 'JUNIOR (16-24)' },
    { key: 'pro',      label: 'PRO (25-45)'    },
    { key: 'veterano', label: 'VETERANO (46+)' },
  ]
  return MAP
    .filter(({ key }) => ventasPorEdad[key] != null)
    .map(({ key, label }) => ({
      label,
      percentage: ventasPorEdad[key].porcentaje ?? 0,
      value:      ventasPorEdad[key].total ?? 0,
    }))
}

function buildTopLodges(topHoteles = []) {
  return topHoteles.map((h, idx) => ({
    position: h.position ?? idx + 1,
    name: h.nombre ?? '—',
    zone: h.zona ?? '—',
    category: h.esVip ? 'VIP' : 'Estándar',
    revenue: Number(h.ingresos ?? 0),
  }))
}

// evolucionMensual entries have mes as a 1-12 number; map to label before keying
function buildMonthlyRevenue(source = []) {
  const byMonth = Object.fromEntries(
    source.map((m) => {
      const label =
        typeof m.mes === 'number'
          ? MONTH_LABELS[m.mes - 1]
          : (m.mes ?? m.month)
      return [label, m.ingresos ?? m.revenue]
    })
  )
  return MONTH_LABELS.map((month) => ({
    month,
    revenue: byMonth[month] != null ? Number(byMonth[month]) : null,
  }))
}

// ── Skeletons ──────────────────────────────────────────────────────────────

function KpiSkeleton() {
  return <div className="bg-surface-2 animate-pulse rounded-card h-28" />
}

function WidgetSkeleton({ className = 'h-64' }) {
  return <div className={`bg-surface-2 animate-pulse rounded-card ${className}`} />
}

// ── Componente principal ───────────────────────────────────────────────────

function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboard()

  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los datos del dashboard')
    }
  }, [error])

  // Normalización solo cuando hay datos
  const kpis = data ? buildKpis(data) : []
  const ageRanges = data ? buildAgeRanges(data.ventasPorEdad) : []
  const ageTotal = data?.totalVentasEdad ?? ageRanges.reduce((s, r) => s + (r.value ?? 0), 0)
  const topLodges = data ? buildTopLodges(data.top3Lodges ?? data.topHoteles ?? data.topLodges ?? []) : []
  const monthlyData = data ? buildMonthlyRevenue(data.evolucionMensual ?? data.ingresosMensuales ?? data.monthlyRevenue ?? []) : []

  return (
    <div className="min-h-full bg-bg p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
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

        {(error || isLoading) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Cargando...' : 'Reintentar'}
          </Button>
        )}
      </div>

      {/* Error global */}
      {error && !isLoading && (
        <div className="mb-8 flex items-center gap-3 p-4 bg-danger/10 border border-danger/30 rounded-card">
          <AlertCircle size={18} className="text-danger shrink-0" />
          <p className="font-sans text-sm text-text-muted">
            Error al cargar los datos. Los widgets pueden mostrar información incompleta.
          </p>
        </div>
      )}

      {/* FILA 1 — KPIs del día */}
      <section aria-label="Indicadores del día" className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)
          }
        </div>
      </section>

      {/* FILA 2 — Analítica: Edad + Top Lodges */}
      <section aria-label="Analítica" className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <WidgetSkeleton className="h-64" />
              <WidgetSkeleton className="h-64" />
            </>
          ) : (
            <>
              <AgeRangeSalesWidget
                ranges={ageRanges.length > 0 ? ageRanges : [{ label: 'Sin datos', value: 0, percentage: 0 }]}
                total={ageTotal}
              />
              <TopLodgesWidget lodges={topLodges} />
            </>
          )}
        </div>
      </section>

      {/* FILA 3 — Gráfico evolución mensual (SVG nativo — no cambiar a librería) */}
      <section aria-label="Evolución mensual" className="mb-8">
        {isLoading ? (
          <WidgetSkeleton className="h-80" />
        ) : (
          <MonthlyRevenueWidget
            data={monthlyData.length > 0 ? monthlyData : MONTH_LABELS.map((m) => ({ month: m, revenue: null }))}
            currentMonth={CURRENT_MONTH}
            year={CURRENT_YEAR}
          />
        )}
      </section>

      {/* FILA 4 — KPIs de mantenimientos + tabla de pendientes */}
      <section aria-label="Mantenimientos" className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MantenimientosWidget />
          <PendingMaintenanceWidget />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
