import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'

/**
 * Sección "CÓMO LLEGAR" del Home público.
 * Replica el patrón visual con placeholder de mapa + info de ubicación.
 *
 * @param {Object} props
 * @param {Object} props.location - Datos de la ubicación del resort
 */
function LocationSection({ location }) {
  return (
    <section
      id="ubicacion"
      aria-label="Cómo llegar al resort"
      className="py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Sección 05 · Ubicación"
          title="Cómo Llegar"
          action={<Button variant="ghost">Abrir en Maps ▶</Button>}
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Mapa placeholder - 60% en desktop */}
          <Card noPadding className="lg:col-span-3 relative h-80 lg:h-auto min-h-[320px]">
            {/* Background pattern (placeholder de mapa) */}
            <div
              className="absolute inset-0 bg-bg"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, #1A1A1A 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Dot rojo central indicando ubicación */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Pulso animado externo */}
                <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-50" />
                {/* Dot principal */}
                <div className="relative w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary-glow)]" />
              </div>
            </div>

            {/* Label flotante con coordenadas - bottom left */}
            <div className="absolute bottom-4 left-4 bg-surface-1 border border-border-strong rounded-inner px-4 py-3 max-w-[260px]">
              <p className="font-display font-bold text-sm tracking-tight uppercase text-text">
                {location.name}
              </p>
              <p className="font-mono text-[10px] tracking-widest text-text-muted mt-1">
                {location.coords}
              </p>
            </div>
          </Card>

          {/* Info ubicación - 40% en desktop */}
          <Card variant="default" className="lg:col-span-2 flex flex-col">
            {/* UBICACIÓN */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Ubicación
              </p>
              <address className="not-italic font-sans text-sm text-text mt-3 leading-relaxed">
                {location.address.split('\n').map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            {/* TRANSPORTE */}
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Transporte
              </p>
              <ul className="mt-3 space-y-2" role="list">
                {location.transport.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="text-primary shrink-0 mt-0.5">▶</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <Button variant="primary" fullWidth>
                Cómo Llegar ▶▶
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default LocationSection