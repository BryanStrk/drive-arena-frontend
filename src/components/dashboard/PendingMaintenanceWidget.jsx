import toast from 'react-hot-toast'

import Badge from '@/components/Badge'

/**
 * Widget "Mantenimientos pendientes".
 *
 * Tabla con los mantenimientos abiertos del resort (vehículos del
 * parque que requieren atención). Cada fila muestra ID, vehículo,
 * sistema afectado, estado con badge de color, y un botón de acción.
 *
 * Estados soportados (ver getStatusVariant):
 * - CRÍTICO    → badge rojo (parar uso inmediato)
 * - REVISIÓN   → badge amarillo (revisar pronto)
 * - PROGRAMADO → badge gris (mantenimiento planificado)
 *
 * @param {Object} props
 * @param {Array<{id: string, vehicle: string, unit: string, system: string, status: 'CRITICO'|'REVISION'|'PROGRAMADO'}>} props.maintenances
 */
function PendingMaintenanceWidget({ maintenances }) {
  /**
   * Acción placeholder. En el futuro abrirá un modal con detalles
   * del mantenimiento o navegará a la página de operativa.
   */
  const handleAction = (maintenanceId) => {
    toast(`Mantenimiento ${maintenanceId} · Detalle próximamente`, {
      icon: '🔧',
    })
  }

  const handleViewAll = () => {
    toast('Página de mantenimientos · Próximamente', {
      icon: '🔧',
    })
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
              <TableHeader>Vehículo</TableHeader>
              <TableHeader>Sistema</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader align="right">Acción</TableHeader>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((m) => (
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

/**
 * Sub-componente: header de columna.
 */
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

/**
 * Sub-componente: fila de mantenimiento.
 */
function MaintenanceRow({ maintenance, onAction }) {
  const { id, vehicle, unit, system, status } = maintenance
  const statusVariant = getStatusVariant(status)
  const statusLabel = getStatusLabel(status)

  return (
    <tr className="border-b border-border-strong last:border-b-0 hover:bg-surface-2 transition-colors">
      {/* ID */}
      <td className="px-3 py-3 font-mono text-xs text-text-muted">
        #{id}
      </td>

      {/* Vehículo + unidad */}
      <td className="px-3 py-3">
        <span className="font-display font-bold text-sm text-text">
          {vehicle}
        </span>
        <span className="ml-2 font-mono text-[10px] tracking-wider uppercase text-text-dim">
          | {unit}
        </span>
      </td>

      {/* Sistema afectado */}
      <td className="px-3 py-3 font-sans text-sm text-text-muted">
        {system}
      </td>

      {/* Estado */}
      <td className="px-3 py-3">
        <Badge variant={statusVariant} size="xs">
          {statusLabel}
        </Badge>
      </td>

      {/* Botón acción */}
      <td className="px-3 py-3 text-right">
        <button
          type="button"
          onClick={() => onAction(id)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-inner border border-border-strong bg-surface-2 text-text-muted hover:text-primary hover:border-primary transition-colors"
          aria-label={`Ver detalles del mantenimiento ${id}`}
          title="Ver detalles"
        >
          <span aria-hidden="true">🔧</span>
        </button>
      </td>
    </tr>
  )
}

/**
 * Mapea cada estado a su variant del componente Badge.
 * Mantener consistente con backend en futuras integraciones.
 */
function getStatusVariant(status) {
  switch (status) {
    case 'CRITICO':
      return 'danger'
    case 'REVISION':
      return 'warning'
    case 'PROGRAMADO':
      return 'default'
    default:
      return 'default'
  }
}

/**
 * Etiqueta visible del estado (con tildes para presentación).
 */
function getStatusLabel(status) {
  switch (status) {
    case 'CRITICO':
      return 'Crítico'
    case 'REVISION':
      return 'Revisión'
    case 'PROGRAMADO':
      return 'Programado'
    default:
      return status
  }
}

export default PendingMaintenanceWidget
