import { useId } from 'react'
import { m } from 'framer-motion'
import { coverCrown } from './botanical'

/*
 * One framed photograph: a real Garden Cafe photograph clipped to its
 * frame (makeFrame in botanical.js — `tree` here, a name kept from the
 * organic crowns the section once used). The frame sits a little above
 * the feature's rule (CafeFeature) and comes into view as one piece with
 * its feature.
 *
 * Depth: the photograph may drift a few units up or down inside the frame
 * as the page scrolls, while the frame itself stays fixed. It is fitted
 * just large enough to cover the frame across that drift.
 */

/**
 * The photograph fitted to the crown, enlarged about the crown's centre so
 * it still covers the crown when shifted `range` units either way.
 */
function fitPhoto(tree, photo, range) {
  const fit = coverCrown(tree, photo)
  if (!range) return fit
  const { crown } = tree
  const s = 1 + (2 * range) / crown.height
  const cx = crown.x + crown.width / 2
  const cy = crown.y + crown.height / 2
  return {
    x: cx + (fit.x - cx) * s,
    y: cy + (fit.y - cy) * s,
    width: fit.width * s,
    height: fit.height * s,
  }
}

/**
 * @param {object} props
 * @param {ReturnType<import('./botanical').makeFrame>} props.tree
 * @param {{ src: string, alt: string, width: number, height: number, focus?: [number, number], zoom?: number }} props.photo
 * @param {boolean} props.load   set once the tree is near the viewport (lazy)
 * @param {{ y: import('framer-motion').MotionValue<number>, range: number }} [props.depth]
 */
export default function BotanicalTree({ tree, photo, load, depth }) {
  const clipId = `crown-${useId().replace(/:/g, '')}`

  return (
    <svg
      className="botanical-tree"
      viewBox={tree.viewBox}
      style={{ aspectRatio: tree.ratio }}
      role="img"
      aria-label={photo.alt}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={tree.canopy} />
        </clipPath>
        {/* The moulding's tone: a shade lighter at the top, where the
            light falls, deepening to the bottom. */}
        <linearGradient id={`${clipId}-tone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#544f46" />
          <stop offset="1" stopColor="#413d36" />
        </linearGradient>
      </defs>

      {/* The frame's moulding, then the warm-white mount inside it. */}
      {tree.moulding && (
        <>
          <path
            className="botanical-tree__moulding"
            d={tree.moulding}
            fill={`url(#${clipId}-tone)`}
          />
          <path className="botanical-tree__lip" d={tree.lip} />
        </>
      )}
      {tree.mount && <path className="botanical-tree__mount" d={tree.mount} />}

      {/* The clip sits on the group, so the photograph moves within it;
          the inner group takes the hover zoom (ThePlace.css). */}
      <g clipPath={`url(#${clipId})`}>
        <g className="botanical-tree__zoom">
          <m.image
            className="botanical-tree__photo"
            href={load ? photo.src : undefined}
            {...fitPhoto(tree, photo, depth?.range)}
            preserveAspectRatio="none"
            style={depth ? { y: depth.y } : undefined}
          />
        </g>
      </g>

      {/* The hairline at the edge of the mount's window. */}
      {tree.mount && <path className="botanical-tree__window" d={tree.canopy} />}
    </svg>
  )
}
