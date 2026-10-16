import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { DURATION, EASE_STANDARD } from '../../utils/motion'

const DEFAULT_TRANSITION = { duration: DURATION.normal, ease: EASE_STANDARD }

/**
 * Motion foundation for the whole app.
 *
 * - LazyMotion + `m` components keep Framer Motion's footprint small;
 *   `strict` makes accidental use of the heavier `motion.*` an error.
 *   domAnimation (animate, exit, variants, gestures, whileInView) ships in
 *   the main bundle: loaded as a separate chunk, it arrived a round trip
 *   later, and every entrance — the hero's included — sat invisible at its
 *   starting opacity until then. Switch to domMax only if drag or layout
 *   animations are genuinely needed.
 * - reducedMotion="user": when the OS asks for reduced motion, transform
 *   animations resolve instantly and only opacity fades remain.
 * - A shared default transition so ad-hoc timings are the exception.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={DEFAULT_TRANSITION}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
