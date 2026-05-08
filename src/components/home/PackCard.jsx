import { useNavigate } from 'react-router'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

/**
 * Card de pack/oferta para el Home público.
 * Replica las cards de la sección "PACKS EN OFERTA" del mockup.
 *
 * El botón "Reservar" navega a /reservar (wizard público). En una v2,
 * pasar el packId via location state para preseleccionar el pack al
 * entrar al wizard:
 *   navigate('/reservar', { state: { packId } })
 *
 * @param {Object} props
 * @param {string} props.title - Nombre del pack (ej. "Pack GP Championship")
 * @param {string} props.description - Descripción de qué incluye
 * @param {number} props.originalPrice - Precio antes del descuento (€)
 * @param {number} props.currentPrice - Precio actual con descuento (€)
 * @param {number} props.discountPercentage - Porcentaje de descuento (ej. 30)
 * @param {string} props.availability - Texto de disponibilidad (ej. "1 JUN - 31 AGO")
 * @param {string} [props.image] - URL de imagen de fondo
 * @param {string} [props.className]
 */
function PackCard({
  title,
  description,
  originalPrice,
  currentPrice,
  discountPercentage,
  availability,
  image,
  className,
}) {
  const navigate = useNavigate()

  const handleReservar = () => navigate('/reservar')

  return (
    <Card
      variant="default"
      noPadding
      className={cn('group flex flex-col h-full overflow-hidden', className)}
    >
      {/* Banner superior con imagen + badge descuento */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        aria-hidden={image ? 'true' : undefined}
      >
        {/* Si no hay imagen, fondo gradient como placeholder estilo mockup */}
        {!image && (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface-1 to-surface-2" />
        )}

        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />

        {/* Badge de descuento - top right */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="primary" size="md">
            -{discountPercentage}%
          </Badge>
        </div>
      </div>

      {/* Contenido textual */}
      <div className="flex-1 flex flex-col p-6">
        {/* Título */}
        <h3 className="font-display font-extrabold text-2xl tracking-tight uppercase leading-tight">
          {title}
        </h3>

        {/* Descripción */}
        <p className="font-sans text-sm text-text-muted mt-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Precios */}
        <div className="flex items-baseline gap-3 mt-5">
          <span className="font-mono text-base text-text-dim line-through tabular-nums">
            € {originalPrice}
          </span>
          <span className="font-display font-extrabold text-3xl text-primary tabular-nums">
            € {currentPrice}
          </span>
        </div>

        {/* Footer: availability + CTA */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border-strong">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
            {availability}
          </span>
          <Button variant="primary" size="sm" onClick={handleReservar}>
            Reservar ▶
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default PackCard
