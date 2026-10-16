import { useScroll, useTransform } from 'framer-motion'
import { MEDIA } from '../../utils/breakpoints'

/*
 * The section's motion: it comes into focus in order — headline, row 1's
 * trees, row 1's words, row 2's trees, row 2's words — and leaves in
 * layers as each part passes the top of the screen.
 */

/** Row 1 waits this long for the headline (s). */
const ROW_LEAD = 0.25
/** The right-hand tree of a row follows the left (s). */
const COL_STAGGER = 0.14
/** Row 2 follows row 1 by this much when both appear together (s). */
const ROW_STAGGER = 0.5

/**
 * One cue per feature, in place.points order. A cue's `delay` is worked out
 * the moment its feature starts to appear (then kept), so row 2 waits for
 * row 1 only when the two come into view together; scrolled to on its own,
 * it starts at once. Below 1024px (one column) they barely wait.
 */
export function makeCues(count) {
  let row1At = null
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2
    let delay
    return {
      get delay() {
        if (delay !== undefined) return delay
        const now = performance.now() / 1000
        if (!window.matchMedia(MEDIA.lg).matches) {
          delay = index === 0 ? ROW_LEAD * 0.6 : 0
        } else if (row === 0) {
          row1At ??= now
          delay = ROW_LEAD + col * COL_STAGGER
        } else {
          const since = row1At === null ? Infinity : now - row1At
          delay = Math.max(0, ROW_LEAD + ROW_STAGGER - since) + col * COL_STAGGER
        }
        return delay
      },
    }
  })
}

/**
 * The exit: as the element's bottom rises from 30% of the screen to the
 * top, it lifts a little and fades — each part on its own, so the section
 * leaves in layers. Off under reduced motion.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {{ lift: number, off: boolean }} options  lift in px
 */
export function useLeave(ref, { lift, off }) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [
      [1, 0.3],
      [1, 0],
    ],
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -lift])
  return off ? undefined : { opacity, y }
}
