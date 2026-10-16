import { useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { SPRING } from '../utils/motion'

/**
 * Scroll progress as a Framer Motion value (0 → 1). Motion values update
 * outside React, so consumers do not re-render while scrolling.
 *
 * Page progress:     const progress = useScrollProgress()
 * Element progress:  const progress = useScrollProgress({ target: ref })
 *
 * @param {object} [options]
 * @param {import('react').RefObject<HTMLElement>} [options.target]
 * @param {import('framer-motion').UseScrollOptions['offset']} [options.offset]
 *   defaults to Framer's ['start end', 'end start'] when a target is given
 * @param {boolean} [options.smooth] spring-smoothed (ignored for reduced motion)
 * @returns {import('framer-motion').MotionValue<number>}
 */
export function useScrollProgress({ target, offset, smooth = false } = {}) {
  const { scrollYProgress } = useScroll(target ? { target, offset } : undefined)
  const smoothed = useSpring(scrollYProgress, SPRING.scroll)
  const reduceMotion = useReducedMotion()

  return smooth && !reduceMotion ? smoothed : scrollYProgress
}
