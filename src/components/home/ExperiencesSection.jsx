import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import ExperienceCard from './ExperienceCard'

/**
 * Sección "EXPERIENCIAS" del Home público.
 * Renderiza la cabecera + grid de atracciones disponibles.
 *
 * @param {Object} props
 * @param {Array} props.experiences - Array de atracciones a mostrar
 */
function ExperiencesSection({ experiences }) {
  return (
    <section
      id="experiencias"
      aria-label="Experiencias disponibles"
      className="py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header de sección */}
        <SectionHeader
          eyebrow="Sección 01 · Live"
          title="Experiencias"
          subtitle="04 circuitos premium · operativos 24/7"
          action={<Button variant="ghost">Ver Todos ▶</Button>}
        />

        {/* Grid de cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.map((exp) => (
            <ExperienceCard
  key={exp.id}
  name={exp.nombre}
  description={exp.descripcion}
  size={exp.tamano}
  record={exp.record}
  image={exp.image}
/>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperiencesSection