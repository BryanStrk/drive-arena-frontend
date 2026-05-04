import SectionHeader from '@/components/SectionHeader'
import Button from '@/components/Button'
import RankingTable from './RankingTable'

/**
 * Sección "RANKING DEL MES" del Home público.
 * Renderiza header + grid de tablas top-5 por atracción.
 *
 * @param {Object} props
 * @param {Array} props.rankings - Array de rankings por atracción
 */
function RankingSection({ rankings }) {
  return (
    <section
      id="ranking"
      aria-label="Ranking mensual de pilotos"
      className="py-20 px-6 bg-surface-1/30"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Sección 02 · Live"
          title="Ranking del Mes"
          subtitle="Top pilotos · Actualizado hoy 14:32"
          action={<Button variant="ghost">Ranking Completo ▶</Button>}
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rankings.map((ranking) => (
            <RankingTable
              key={ranking.attractionId}
              attractionName={ranking.attractionName}
              entries={ranking.entries}
              live
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RankingSection