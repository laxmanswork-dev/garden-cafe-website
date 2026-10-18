import PageTransition from '../../components/PageTransition/PageTransition'
import Seo from '../../components/Seo/Seo'
import { pageMeta } from '../../data/pageMeta'
import Hero from '../../sections/Hero/Hero'
import ThePlace from '../../sections/ThePlace/ThePlace'
import Gallery from '../../sections/Gallery/Gallery'
import FoodDrinks from '../../sections/FoodDrinks/FoodDrinks'
import Visit from '../../sections/Visit/Visit'

/**
 * Homepage — chapters in their approved order. The footer is part of the
 * app shell (App.jsx).
 */
export default function Home() {
  return (
    <PageTransition>
      <Seo {...pageMeta.home} absoluteTitle />
      <Hero />
      <ThePlace />
      <Gallery />
      <FoodDrinks />
      <Visit />
    </PageTransition>
  )
}
