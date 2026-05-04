import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import LodgeCard from './LodgeCard'

/**
 * Sección "LODGES DEL RESORT" del Home público.
 * Renderiza header + grid de alojamientos del resort.
 *
 * @param {Object} props
 * @param {Array} props.lodges - Array de lodges del resort
 */
function LodgesSection({ lodges }) {
  return (
    <section
      id="lodges"
      aria-label="Lodges del resort"
      className="py-20 px-6 bg-surface-1/30"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Sección 04 · Resort"
          title="Lodges del Resort"
          subtitle="Alojamiento Premium · Experiencia Exclusiva"
          action={<Button variant="ghost">Ver Todos ▶</Button>}
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {lodges.map((lodge) => (
            <LodgeCard
                key={lodge.id}
                name={lodge.nombre}
                description={lodge.descripcion}
                category={lodge.category}
                categoryVariant={lodge.categoryVariant}
                priceMedia={lodge.priceMedia}
                priceFull={lodge.priceFull}
                image={lodge.image}
                />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LodgesSection