import { useRef } from 'react'
import { m, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { MEDIA } from '../../utils/breakpoints'
import { EASE_STANDARD, VIEWPORT } from '../../utils/motion'
import BotanicalTree from './BotanicalTree'
import { useLeave } from './motion'

const formatIndex = (index) => String(index + 1).padStart(2, '0')

/*
 * Every variant takes `custom` = { cue, k, side }: `cue.delay` is this feature's
 * start (see motion.js) and `k` scales the distances (1 on desktop, less on
 * tablets and phones).
 */

// The framed photograph slides in from its own side — the left column from
// the left, the right column from the right (`side` -1 / 1) — and settles
// with a slow fade. Translation only, so the grid never shifts.
const VISUAL = {
  hidden: ({ k, side }) => ({ opacity: 0, x: 44 * k * side }),
  visible: ({ cue }) => ({
    opacity: 1,
    x: 0,
    transition: { delay: cue.delay, duration: 1.1, ease: EASE_STANDARD },
  }),
}

// The words follow their photograph, a line at a time.
const words = (start) => ({
  hidden: ({ k }) => ({ opacity: 0, y: 12 * k }),
  visible: ({ cue }) => ({
    opacity: 1,
    y: 0,
    transition: { delay: start + cue.delay, duration: 0.9, ease: EASE_STANDARD },
  }),
})
const INDEX = words(0.14)
const TITLE = words(0.18)
const TEXT = words(0.24)

// Depth: how far the photograph drifts inside its crown across a full pass
// of the screen, each way (drawing units: ~7px at 1440). Phones: none.
const DEPTH = { desktop: 4.5, tablet: 3 }

/**
 * One feature of the cafe: its framed photograph, with its number, title
 * and sentence set inside the photograph at the top-left corner.
 *
 * @param {object} props
 * @param {{ title: string, text: string }} props.point
 * @param {number} props.index
 * @param {ReturnType<import('./botanical').makeFrame>} props.tree
 * @param {{ src: string, alt: string, width: number, height: number, focus?: [number, number] }} props.photo
 * @param {{ readonly delay: number }} props.cue  when this feature appears
 */
export default function CafeFeature({ point, index, tree, photo, cue }) {
  const ref = useRef(null)
  const visualRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery(MEDIA.lg)
  const isTablet = useMediaQuery(MEDIA.md)
  const k = isDesktop ? 1 : isTablet ? 0.8 : 0.6
  // Left column (01, 03) from the left, right column (02, 04) from the
  // right; phones keep the same alternation down their single column.
  const side = index % 2 === 0 ? -1 : 1
  const custom = { cue, k, side }

  // The photograph is requested only as the tree approaches the viewport.
  const near = useInView(ref, { once: true, margin: '400px 0px' })

  const leave = useLeave(ref, { lift: 16 * k, off: prefersReducedMotion })

  const range = prefersReducedMotion ? 0 : isDesktop ? DEPTH.desktop : isTablet ? DEPTH.tablet : 0
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [range, -range])

  return (
    <m.li
      ref={ref}
      className="place-feature"
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: VIEWPORT.once, amount: 0.3 }}
      custom={custom}
      style={{ '--tree-units': tree.width, ...leave }}
    >
      <m.div ref={visualRef} className="place-feature__visual" variants={VISUAL} custom={custom}>
        <BotanicalTree
          tree={tree}
          photo={photo}
          load={near}
          depth={range ? { y: drift, range } : undefined}
        />

        {/* The words sit inside the photograph, at its top-left corner. */}
        <div className="place-feature__words">
          <m.span
            className="place-feature__index eyebrow text-tabular"
            aria-hidden="true"
            variants={INDEX}
            custom={custom}
          >
            {formatIndex(index)}
          </m.span>
          <m.h3 className="place-feature__title" variants={TITLE} custom={custom}>
            {point.title}
          </m.h3>
          <m.p className="place-feature__text" variants={TEXT} custom={custom}>
            {point.text}
          </m.p>
        </div>
      </m.div>
    </m.li>
  )
}
