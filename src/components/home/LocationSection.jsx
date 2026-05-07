import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CircuitMap from "@/components/CircuitMap";

/**
 * Sección "CÓMO LLEGAR" del Home público.
 * Mapa interactivo (CartoDB Dark Matter + maplibre-gl) + card de info.
 *
 * @param {Object} props
 * @param {Object} props.location - Datos de la ubicación del resort
 * @param {number} props.location.lat - Latitud
 * @param {number} props.location.lng - Longitud
 * @param {string} props.location.name - Nombre del circuito
 * @param {string} props.location.coords - Coordenadas formateadas para mostrar
 * @param {string} props.location.address - Dirección multi-línea
 * @param {string[]} props.location.transport - Lista de medios de transporte
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
          {/* Mapa interactivo - 60% en desktop */}
          <Card
            noPadding
            className="lg:col-span-3 relative h-80 lg:h-auto min-h-[400px] overflow-hidden"
          >
            <CircuitMap
              lat={location.lat ?? 41.5705}
              lng={location.lng ?? 2.2611}
              zoom={13}
            />

            {/* Label flotante glassmorphism con coordenadas - bottom left */}
            <div className="absolute bottom-4 left-4 bg-surface-1/90 backdrop-blur-md border border-border-strong rounded-inner px-4 py-3 max-w-[260px] z-10 pointer-events-none">
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
                {location.address.split("\n").map((line, idx) => (
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
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-text-muted"
                  >
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
  );
}

export default LocationSection;
