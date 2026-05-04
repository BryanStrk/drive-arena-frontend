import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import PackCard from './PackCard'

/**
 * Sección "PACKS EN OFERTA" del Home público.
 * Renderiza header + grid de packs promocionales.
 *
 * @param {Object} props
 * @param {Array} props.packs - Array de packs con descuentos
 */
function PacksSection({ packs }) {
  return (
    <section
      id="packs"
      aria-label="Packs en oferta"
      className="py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Sección 03 · Ofertas"
          title="Packs en Oferta"
          subtitle="Lodge + Pases + Pensión"
          action={<Button variant="ghost">Ver Todos ▶</Button>}
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              title={pack.title}
              description={pack.description}
              originalPrice={pack.originalPrice}
              currentPrice={pack.currentPrice}
              discountPercentage={pack.discountPercentage}
              availability={pack.availability}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PacksSection