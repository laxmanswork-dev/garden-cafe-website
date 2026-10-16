import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import MotionProvider from './components/MotionProvider/MotionProvider'
import Navbar from './components/Navbar/Navbar'
import SmoothScroll from './components/SmoothScroll/SmoothScroll'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'
import { useRouteScroll } from './hooks/useRouteScroll'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import NotFound from './pages/NotFound/NotFound'
import OurStory from './pages/OurStory/OurStory'
import Footer from './sections/Footer/Footer'

// Development-only reference page. `import.meta.env.DEV` is statically
// false in production, so this chunk is not emitted in the build.
const DesignSystem = import.meta.env.DEV
  ? lazy(() => import('./pages/DesignSystem/DesignSystem'))
  : null

function AppRoutes() {
  const location = useLocation()
  useRouteScroll()

  return (
    // Keyed by pathname: hash changes scroll within a page, they do not
    // trigger a page transition. No initial={false} here: it would cascade
    // to every descendant and silently disable all entrance and scroll
    // reveals on first load. PageTransition skips its own fade instead.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/our-story" element={<OurStory />} />
        {DesignSystem && (
          <Route
            path="/_system"
            element={
              <Suspense fallback={null}>
                <DesignSystem />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

// The homepage sets a solid white navbar with dark type over its video.
function NavbarForRoute() {
  const { pathname } = useLocation()
  return <Navbar variant={pathname === '/' ? 'solid' : 'transparent'} />
}

/**
 * App shell: providers, skip link, navigation, routed content.
 * Page content lives in src/pages; homepage chapters in src/sections.
 */
export default function App() {
  return (
    <MotionProvider>
      <SmoothScroll>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <NavbarForRoute />
        <main id="main" tabIndex={-1}>
          <AppRoutes />
        </main>
        <Footer />
        <WhatsAppButton />
      </SmoothScroll>
    </MotionProvider>
  )
}
