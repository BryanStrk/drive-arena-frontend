import Card from '@/components/Card'
import Badge from '@/components/Badge'
import { cn } from '@/lib/cn'

/**
 * Tarjeta de atracción/experiencia para el Home público.
 * Replica el patrón visual de la sección "EXPERIENCIAS" del mockup.
 *
 * @param {Object} props
 * @param {string} props.name - Nombre de la atracción (ej. "Phantom GT")
 * @param {string} props.description - Descripción técnica corta
 * @param {'GRANDE'|'MEDIANA'|'PEQUENA'} props.size - Tamaño de la atracción
 * @param {string} props.record - Récord histórico formateado (ej. "87.234s")
 * @param {string} [props.image] - URL de imagen de fondo (opcional)
 * @param {string} [props.className]
 */
function ExperienceCard({ name, description, size, record, image, className }) {
  // Mapeo de enum del backend → label visible
  const sizeLabels = {
    GRANDE: 'Grande',
    MEDIANA: 'Mediana',
    PEQUENA: 'Pequeña',
  }

  // Variante del badge según tamaño
  // GRANDE → primary (rojo destacado)
  // MEDIANA / PEQUENA → default (gris neutral)
  const sizeBadgeVariant = size === 'GRANDE' ? 'primary' : 'default'

  return (
    <Card
      variant="default"
      interactive
      noPadding
      className={cn('group flex flex-col h-full', className)}
    >
      {/* Imagen de fondo (si existe) */}
      {image && (
        <div
          className="relative h-32 bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        >
          {/* Overlay para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/30 to-transparent" />
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col p-5">
        {/* Badge de tamaño */}
        <div className="mb-3">
          <Badge variant={sizeBadgeVariant} size="xs">
            {sizeLabels[size]}
          </Badge>
        </div>

        {/* Nombre de la atracción */}
        <h3 className="font-display font-extrabold text-2xl tracking-tight uppercase leading-tight">
          {name}
        </h3>

        {/* Descripción técnica */}
        <p className="font-sans text-sm text-text-muted mt-2 flex-1">
          {description}
        </p>

        {/* Footer con récord */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-strong">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            Récord
          </span>
          <span className="font-mono font-bold text-primary tabular-nums">
            {record}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default ExperienceCard