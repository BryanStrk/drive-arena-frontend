import Hero from '@/components/home/Hero'
import StatsBar from '@/components/home/StatsBar'
import ExperiencesSection from '@/components/home/ExperiencesSection'
import RankingSection from '@/components/home/RankingSection'
import PacksSection from '@/components/home/PacksSection'
import LodgesSection from '@/components/home/LodgesSection'
import LocationSection from '@/components/home/LocationSection'
import HomeFooter from '@/components/home/HomeFooter'
import StickyBottomNav from '@/components/home/StickyBottomNav'
import FadeInSection from '@/components/FadeInSection'

import {
  RESORT_STATS,
  EXPERIENCES,
  MONTHLY_RANKINGS,
  OFFER_PACKS,
  RESORT_LODGES,
  RESORT_LOCATION,
} from '@/data/homeMocks'

/**
 * Home público de Drive Arena.
 * Composición de las 7 secciones del landing con animaciones de entrada.
 */
function Home() {
  return (
    <>
      {/* HERO — sin FadeInSection, debe verse instantáneamente al cargar */}
      <Hero />

      {/* Stats bar — animación rápida */}
      <FadeInSection duration={0.6} distance={20}>
        <StatsBar stats={RESORT_STATS} />
      </FadeInSection>

      {/* Experiencias — más drama */}
      <FadeInSection duration={0.8} distance={48}>
        <ExperiencesSection experiences={EXPERIENCES} />
      </FadeInSection>

      {/* Ranking del mes */}
      <FadeInSection duration={0.8} distance={48}>
        <RankingSection rankings={MONTHLY_RANKINGS} />
      </FadeInSection>

      {/* Packs en oferta */}
      <FadeInSection duration={0.8} distance={48}>
        <PacksSection packs={OFFER_PACKS} />
      </FadeInSection>

      {/* Lodges del resort */}
      <FadeInSection duration={0.8} distance={48}>
        <LodgesSection lodges={RESORT_LODGES} />
      </FadeInSection>

      {/* Ubicación */}
      <FadeInSection duration={0.8} distance={48}>
        <LocationSection location={RESORT_LOCATION} />
      </FadeInSection>

      {/* Footer rico */}
      <FadeInSection duration={0.6} distance={20}>
        <HomeFooter />
      </FadeInSection>

      {/* Sticky bottom nav — siempre visible, sin animación */}
      <StickyBottomNav />
    </>
  )
}

export default Home
