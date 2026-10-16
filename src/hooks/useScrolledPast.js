import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

/**
 * True once the page has scrolled past `threshold` px. State only changes
 * when the boolean flips, so scrolling does not cause re-renders.
 *
 * @param {number} [threshold]
 * @returns {boolean}
 */
export function useScrolledPast(threshold = 16) {
  const { scrollY } = useScroll()
  const [isPast, setIsPast] = useState(() => scrollY.get() > threshold)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsPast(y > threshold)
  })

  return isPast
}
