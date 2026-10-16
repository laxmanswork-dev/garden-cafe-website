import { LenisContext, useLenisSetup } from '../../hooks/useLenis'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { MEDIA } from '../../utils/breakpoints'

/**
 * Provides the scroll controller and runs Lenis for users who have not
 * asked for reduced motion. If the preference changes while the page is
 * open, Lenis is created or destroyed accordingly.
 */
export default function SmoothScroll({ children }) {
  const prefersReducedMotion = useMediaQuery(MEDIA.reducedMotion)
  const controller = useLenisSetup({ enabled: !prefersReducedMotion })

  return <LenisContext value={controller}>{children}</LenisContext>
}
