import { useNavigate } from 'react-router'

import Badge from '@/components/Badge'
import { useMantenimientosPendientes } from '@/hooks/useMantenimientosPendientes'

/**
 * Widget "Mantenimientos pendientes".
 *
 * Tabla con los mantenimientos pendientes del resort (atracciones que
 * requieren atención técnica). Cada fila muestra ID, circuito, técnico
 * asignado, urgencia calculada según fecha, y un botón de acción que
 * navega a la página completa de Mantenimiento.
 *
 * URGENCIA AUTOMÁTICA (calculada client-side desde fechaProgramada):
 *   - VENCIDO    → fecha ya pasó                    → badge rojo
 *   - CRÍTICO    → próximos 3 días                  → badge rojo
 *   - REVISIÓN   → próxima semana (4-7 días)        → badge amarillo
 *   - PROGRAMADO → más de 7 días                    → badge gris
 *
 * Este cálculo se hace en frontend para no acoplar el backend a la
 * lógica de presentación. En producción se movería a un campo
 * computed del DTO de respuesta.
 */
function PendingMaintenanceWidget() {
  const navigate = useNavigate()
  const { mantenimientos, isLoading, error, refetch } =
    useMantenimientosPendientes(4)

  const handleAction = () => {
    navigate('/dashboard/mantenimiento')
  }

  const handleViewAll = () => {
    navigate('/dashboard/mantenimiento')
  }

  return (
    <article className="bg-surface-1 border border-border-strong rounded-card p-6">
      {/* Header */}
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            ▌ Operativa
          </p>
          <h2 className="mt-1 font-display font-bold text-lg tracking-tight text-text">
            Mantenimientos Pendientes
          </h2>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted hover:text-primary transition-colors"
        >
          Ver todos →
        </button>
      </header>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-strong">
              <TableHeader>ID</TableHeader>
              <TableHeader>Circuito</TableHeader>
              <TableHeader>Técnico</TableHeader>
              <TableHeader>Programado</TableHeader>
              <TableHeader align="right">Acción</TableHeader>
            </tr>
          </thead>
          <tbody>
            {isLoading && <SkeletonRows rows={4} />}

            {!isLoading && error && (
              <ErrorRow message={error} onRetry={refetch} />
            )}

            {!isLoading && !error && mantenimientos.length === 0 && <EmptyRow />}

            {!isLoading &&
              !error &&
              mantenimientos.map((m) => (
                <MaintenanceRow
                  key={m.id}
                  maintenance={m}
                  onAction={handleAction}
                />
              ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES
// ═══════════════════════════════════════════════════════════════════════

function TableHeader({ children, align = 'left' }) {
  return (
    <th
      className="px-3 py-2.5 font-mono text-[10px] tracking-[0.25em] uppercase text-text-dim"
      style={{ textAlign: align }}
    >
      {children}
    </th>
  )
}

function MaintenanceRow({ maintenance, onAction }) {
  const { id, atraccionNombre, tecnicoNombreCompleto, fechaProgramada } =
    maintenance

  const urgencia = getUrgenciaDesdefecha(fechaProgramada)
  const variant = getUrgenciaVariant(urgencia)
  const label = getUrgenciaLabel(urgencia)

  return (
    <tr className="border-b border-border-strong last:border-b-0 hover:bg-surface-2 transition-colors">
      {/* ID */}
      <td className="px-3 py-3 font-mono text-xs text-text-muted">#M-{id}</td>

      {/* Circuito */}
      <td className="px-3 py-3">
        <span className="font-display font-bold text-sm text-text">
          {atraccionNombre}
        </span>
      </td>

      {/* Técnico */}
      <td className="px-3 py-3 font-sans text-sm text-text-muted">
        {tecnicoNombreCompleto}
      </td>

      {/* Fecha programada + badge de urgencia */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-muted">
            {formatFecha(fechaProgramada)}
          </span>
          <Badge variant={variant} size="xs">
            {label}
          </Badge>
        </div>
      </td>

      {/* Botón acción */}
      <td className="px-3 py-3 text-right">
        <button
          type="button"
          onClick={() => onAction(id)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-inner border border-border-strong bg-surface-2 text-text-muted hover:text-primary hover:border-primary transition-colors"
          aria-label={`Ver mantenimiento ${id} en página completa`}
          title="Ver en mantenimiento"
        >
          <span aria-hidden="true">🔧</span>
        </button>
      </td>
    </tr>
  )
}

function SkeletonRows({ rows = 4 }) {
  return Array.from({ length: rows }).map((_, index) => (
    <tr key={index} className="border-b border-border-strong last:border-b-0">
      <td className="px-3 py-3">
        <div className="h-3 w-12 animate-pulse rounded bg-surface-2" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
      </td>
      <td className="px-3 py-3">
        <div className="h-3 w-32 animate-pulse rounded bg-surface-2" />
      </td>
      <td className="px-3 py-3">
        <div className="h-3 w-28 animate-pulse rounded bg-surface-2" />
      </td>
      <td className="px-3 py-3 text-right">
        <div className="ml-auto h-8 w-8 animate-pulse rounded-inner bg-surface-2" />
      </td>
    </tr>
  ))
}

function EmptyRow() {
  return (
    <tr>
      <td colSpan={5} className="px-3 py-8 text-center">
        <p className="font-sans text-sm text-text-muted">
          No hay mantenimientos pendientes 🎉
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-wider uppercase text-text-dim">
          Todos los circuitos están al día
        </p>
      </td>
    </tr>
  )
}

function ErrorRow({ message, onRetry }) {
  return (
    <tr>
      <td colSpan={5} className="px-3 py-8 text-center">
        <p className="font-sans text-sm text-danger">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 font-mono text-[10px] tracking-wider uppercase text-text-muted hover:text-primary transition-colors"
        >
          Reintentar →
        </button>
      </td>
    </tr>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// LÓGICA DE URGENCIA
// ═══════════════════════════════════════════════════════════════════════

/**
 * Calcula el nivel de urgencia de un mantenimiento basado en cuánto
 * falta para su fecha programada respecto a hoy.
 *
 * Reglas:
 *   - VENCIDO    → fecha ya pasó (diff < 0)
 *   - CRITICO    → 0 a 3 días
 *   - REVISION   → 4 a 7 días
 *   - PROGRAMADO → más de 7 días
 */
function getUrgenciaDesdefecha(fechaProgramada) {
  if (!fechaProgramada) return 'PROGRAMADO'

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaProgramada)
  fecha.setHours(0, 0, 0, 0)

  const diffMs = fecha - hoy
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias < 0) return 'VENCIDO'
  if (diffDias <= 3) return 'CRITICO'
  if (diffDias <= 7) return 'REVISION'
  return 'PROGRAMADO'
}

function getUrgenciaVariant(urgencia) {
  switch (urgencia) {
    case 'VENCIDO':
    case 'CRITICO':
      return 'danger'
    case 'REVISION':
      return 'warning'
    case 'PROGRAMADO':
    default:
      return 'default'
  }
}

function getUrgenciaLabel(urgencia) {
  switch (urgencia) {
    case 'VENCIDO':
      return 'Vencido'
    case 'CRITICO':
      return 'Crítico'
    case 'REVISION':
      return 'Revisión'
    case 'PROGRAMADO':
      return 'Programado'
    default:
      return urgencia
  }
}

function formatFecha(fechaIso) {
  if (!fechaIso) return '—'
  return new Date(fechaIso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default PendingMaintenanceWidget
