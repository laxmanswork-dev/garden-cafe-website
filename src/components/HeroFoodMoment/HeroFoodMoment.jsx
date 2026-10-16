import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder'
import { menuCategories } from '../../data/menuCategories'
import { EASE_STANDARD } from '../../utils/motion'
import { signature } from './gardenSignature'
import './HeroFoodMoment.css'

/*
 * The hero's food moment — seven photographs as one curated collection.
 *
 * A single small signed "Garden" (see gardenSignature.js) sits above
 * the collection as a quiet signature; the seven framed photographs hang
 * beneath it at slightly different heights and tilts, like prints pinned up
 * by hand. Desktop: one row of seven. 600px up: rows of three, the seventh
 * centred beneath. Phones: rows of two, the seventh centred beneath.
 *
 * The signature signs itself, on a loop: the pen draws the G in one
 * gesture, then "arden", then the short run-out; the word holds, fades, and
 * is signed again (see .garland__signature in the CSS). The first signing
 * is its entrance.
 *
 * Motion, once on load: the signature settles with a 3px rise as it is
 * first signed, then the photographs settle into place with a small stagger. Then each photograph
 * keeps a slow, gentle sway — under a degree, on its own timing, so the six
 * never move together.
 *
 * The passing breeze: every 3s a soft gust crosses the collection from the
 * first photograph to the last. Each one in turn is pushed a little further
 * than its sway, swings back past rest and settles, like prints on a line
 * when the wind moves through the garden, and a patch of dappled light
 * slides across its photograph as the gust goes by. Then a brief pause,
 * until the next one. Hover lifts a photograph and eases it toward level.
 * Reduced motion: the whole composition is simply there, still.
 *
 * Each photograph links to its own category: it lands on Food & Drinks
 * already filtered (/?category=tea#food-drinks) — one step, not two.
 */

/*
 * How each frame hangs, in category order: its drop below the shared top
 * space (rem), resting tilt (deg), and its sway — swing either side of rest
 * (deg) and one full cycle (s), and how far the passing breeze pushes it
 * (deg) — longer drops swing further. Set by hand — long, short, medium, short,
 * medium, long — within ~22px, so the row reads as a hung arrangement,
 * never a grid.
 */
const HANG = [
  { drop: 2.75, tilt: -2, sway: 0.7, cycle: 7.4, gust: 2.4 }, // Tea — 44px
  { drop: 1.625, tilt: 1, sway: 0.55, cycle: 6.6, gust: 1.9 }, // Coffee — 26px
  { drop: 2.125, tilt: -1, sway: 0.65, cycle: 8.2, gust: 2.2 }, // Snacks — 34px
  { drop: 1.5, tilt: 1.75, sway: 0.5, cycle: 7, gust: 1.8 }, // Sweets — 24px
  { drop: 2, tilt: -1, sway: 0.6, cycle: 7.8, gust: 2.1 }, // Milkshakes — 32px
  { drop: 2.875, tilt: 1, sway: 0.75, cycle: 6.9, gust: 2.6 }, // Ice Cream — 46px
  { drop: 1.75, tilt: -1.5, sway: 0.55, cycle: 7.6, gust: 2 }, // Falooda — 28px
]

// The sway begins once the entrance has settled, each frame a beat apart.
const SWAY_START = 2.8
const SWAY_STEP = 0.45

// The breeze: first gust once everything has settled, then one every
// cycle; it reaches each photograph a beat after the one before, so it
// travels across the row as a wave. (Cycle length lives in the CSS.)
const GUST_START = 5
const GUST_STEP = 0.18

// Entrance timeline (s): after the headline (≈0.25 → 0.9s) and action.
const T = { signature: 1.05, photos: 1.55 }
const STEP = 0.06

const settle = (delay, duration = 1.1) => ({ duration, ease: EASE_STANDARD, delay })

// A fine pen, in viewBox units: the signature draws at ~1.67 (phones) to
// ~1.88 (desktop) screen px per unit, so 1 / 1.75 keeps the stroke widths
// at ~1px, as before. (Not non-scaling-stroke: that measures dashes in
// screen px, which breaks drawing each stroke by its pathLength.)
const PEN = 1 / 1.75

function Signature({ from }) {
  return (
    <m.svg
      className="garland__signature"
      viewBox={signature.viewBox}
      aria-hidden="true"
      focusable="false"
      initial={from({ y: 3 })}
      animate={{ y: 0 }}
      transition={settle(T.signature, 1)}
    >
      <g className="garland__ink" transform={signature.slant}>
        {/* pathLength 1: each stroke is drawn by its dash offset, 1 → 0. */}
        {signature.strokes.map(([d, width]) => (
          <path key={d} d={d} pathLength={1} strokeWidth={width * PEN} />
        ))}
      </g>
    </m.svg>
  )
}

function Photo({ category }) {
  return (
    <div className="garland__photo">
      {/* Dappled light that crosses the photograph with each gust. */}
      <span className="garland__light" aria-hidden="true" />
      {category.photoSupplied ? (
        <img
          src={category.image}
          srcSet={category.srcSet}
          // The photos are wider than the 4:5 frame, so cover-cropping draws
          // them ~1.3–1.7× the frame's width (~9rem): 14rem asks for enough.
          sizes="14rem"
          alt={category.alt}
          decoding="async"
          style={{ objectPosition: category.focalPoint }}
        />
      ) : (
        <ImagePlaceholder ratio="auto" label="photo" />
      )}
    </div>
  )
}

export default function HeroFoodMoment() {
  const prefersReducedMotion = useReducedMotion()
  // Reduced motion: render every layer in its final state.
  const from = (state) => (prefersReducedMotion ? false : state)

  return (
    <div className="garland-set">
      <Signature from={from} />

      <ul className="garland" role="list" aria-label="What we serve">
        {menuCategories.map((category, index) => {
          const hang = HANG[index]
          const step = index * STEP

          return (
            <li
              key={category.id}
              className="garland__item"
              style={{
                '--drop': `${hang.drop}rem`,
                '--tilt': `${hang.tilt}deg`,
                '--sway': `${hang.sway}deg`,
                '--sway-cycle': `${hang.cycle}s`,
                '--sway-delay': `${SWAY_START + index * SWAY_STEP}s`,
                '--gust': `${hang.gust}deg`,
                '--gust-delay': `${GUST_START + index * GUST_STEP}s`,
              }}
            >
              {/* Settles straight down into place at its resting tilt —
                  no swing, no spin. */}
              <m.div
                className="garland__hang"
                initial={from({ opacity: 0, y: 10, rotate: hang.tilt })}
                animate={{ opacity: 1, y: 0, rotate: hang.tilt }}
                transition={settle(T.photos + step, 1.2)}
              >
                <Link
                  className="garland__sway"
                  to={`/?category=${category.id}#food-drinks`}
                  aria-label={`${category.name} — see it on the menu`}
                >
                  <div className="garland__gust">
                    <figure className="garland__frame">
                      <Photo category={category} />
                      <figcaption className="garland__name">{category.name}</figcaption>
                    </figure>
                  </div>
                </Link>
              </m.div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
