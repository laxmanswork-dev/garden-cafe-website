import { m, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_IN_OUT } from '../../utils/motion'
import { cn } from '../../utils/cn'
import './Botanical.css'

// A single stem with alternating leaves — the one botanical motif used
// across the site. Leaves are [x, y, angle, scale] along the stem.
const STEM = 'M80 400 C78 330 86 262 79 192 C73 132 81 72 94 8'
const LEAF = 'M0 0 C14 -11 38 -12 56 0 C38 10 14 10 0 0 Z'
const RIB = 'M2 0 C20 -1.5 36 -1.5 52 0'
const LEAVES = [
  [79, 352, -28, 1],
  [81, 306, -154, 0.94],
  [84, 256, -32, 0.88],
  [80, 204, -150, 0.8],
  [77, 152, -36, 0.72],
  [79, 104, -146, 0.62],
  [86, 58, -44, 0.5],
]

/**
 * Restrained botanical line art. Purely decorative (aria-hidden); inherits
 * colour from `color`. Draws itself in once when it enters the viewport.
 */
export default function Botanical({ className }) {
  const prefersReducedMotion = useReducedMotion()
  const draw = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.3 },
      }

  return (
    <svg
      className={cn('botanical', className)}
      viewBox="0 0 160 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <m.path
        d={STEM}
        {...draw}
        transition={{ duration: DURATION.slow * 2.2, ease: EASE_IN_OUT }}
      />
      {LEAVES.map(([x, y, angle, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
          <m.path
            d={LEAF}
            {...draw}
            transition={{
              duration: DURATION.slow * 1.4,
              ease: EASE_IN_OUT,
              delay: 0.4 + (LEAVES.length - index) * 0.12,
            }}
          />
          <m.path
            d={RIB}
            {...draw}
            transition={{
              duration: DURATION.slow,
              ease: EASE_IN_OUT,
              delay: 0.7 + (LEAVES.length - index) * 0.12,
            }}
          />
        </g>
      ))}
    </svg>
  )
}
