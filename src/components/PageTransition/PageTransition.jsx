import { m } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useScrollOnPageEnter } from '../../hooks/useRouteScroll'
import { PAGE_TRANSITION } from '../../utils/motion'
import { cn } from '../../utils/cn'
import './PageTransition.css'

/**
 * Wraps each page. Fades between routes (opacity only — safe for every
 * user) and resets scroll position once the incoming page has mounted.
 * The first page load skips this fade, so content paints immediately; the
 * page's own entrance and scroll reveals still run.
 */
export default function PageTransition({ className, children }) {
  useScrollOnPageEnter()
  // React Router gives the initial history entry the key 'default'.
  const isFirstLoad = useLocation().key === 'default'

  return (
    <m.div
      className={cn('page-transition', className)}
      initial={isFirstLoad ? false : PAGE_TRANSITION.initial}
      animate={PAGE_TRANSITION.animate}
      exit={PAGE_TRANSITION.exit}
    >
      {children}
    </m.div>
  )
}
