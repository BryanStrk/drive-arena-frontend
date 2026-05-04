import Card from '@/components/Card'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

/**
 * Card de lodge/alojamiento para el Home público.
 * Replica las cards de la sección "LODGES DEL RESORT" del mockup.
 *
 * @param {Object} props
 * @param {string} props.name - Nombre del lodge (ej. "Apex Lodge")
 * @param {string} props.description - Descripción de 1-2 líneas
 * @param {string} props.category - Categoría/tipo (ej. "VIP PADDOCK", "FAMILIAR")
 * @param {'primary'|'default'} [props.categoryVariant='default'] - Estilo del badge
 * @param {number} props.priceMedia - Precio media pensión (€/noche)
 * @param {number} props.priceFull - Precio pensión completa (€/noche)
 * @param {string} [props.image] - URL de imagen de fondo
 * @param {string} [props.className]
 */
function LodgeCard({
  name,
  description,
  category,
  categoryVariant = 'default',
  priceMedia,
  priceFull,
  image,
  className,
}) {
  return (
    <Card
      variant="default"
      noPadding
      className={cn('group flex flex-col h-full overflow-hidden', className)}
    >
      {/* Banner superior con imagen + badge categoría */}
      <div
        className="relative h-56 bg-cover bg-center"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        aria-hidden={image ? 'true' : undefined}
      >
        {/* Placeholder gradient si no hay imagen */}
        {!image && (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface-1 to-bg" />
        )}

        {/* Overlay para legibilidad del badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-bg/40" />

        {/* Badge categoría - top left */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant={categoryVariant === 'primary' ? 'outline' : 'default'}
            size="sm"
          >
            {category}
          </Badge>
        </div>
      </div>

      {/* Contenido textual */}
      <div className="flex-1 flex flex-col p-6">
        {/* Título */}
        <h3 className="font-display font-extrabold text-3xl tracking-tight uppercase leading-tight">
          {name}
        </h3>

        {/* Descripción */}
        <p className="font-sans text-sm text-text-muted mt-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Bloque de precios — 2 columnas */}
        <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-inner bg-surface-2/50 border border-border-strong">
          {/* Media Pensión */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-text-muted">
              Media Pensión
            </p>
            <p className="mt-1">
              <span className="font-display font-bold text-xl text-text tabular-nums">
                €{priceMedia}
              </span>
              <span className="font-mono text-[10px] text-text-dim ml-1">
                /noche
              </span>
            </p>
          </div>

          {/* Pensión Completa */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-primary">
              Pensión Completa
            </p>
            <p className="mt-1">
              <span className="font-display font-bold text-xl text-primary tabular-nums">
                €{priceFull}
              </span>
              <span className="font-mono text-[10px] text-text-dim ml-1">
                /noche
              </span>
            </p>
          </div>
        </div>

        {/* Footer: dos botones */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button variant="primary" size="sm">
            Reservar ▶
          </Button>
          <Button variant="secondary" size="sm">
            Detalles
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default LodgeCard