import { m, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder'
import { menuCategories } from '../../data/menuCategories'
import { EASE_STANDARD } from '../../utils/motion'
import './HeroFoodMoment.css'

/*
 * The hero's food moment — seven photographs as one curated collection.
 *
 * The seven framed photographs hang beneath the hero's actions (the signed
 * "Garden" is now the hero's headline, see GardenSignature), each with its
 * own small tilt, like prints pinned up by hand. At every size they form one horizontal strip that drifts slowly
 * left to right, without end (see COPIES below); pointing at it or tabbing
 * into it holds it still. Desktop shows all seven at once, phones two and a
 * part of the next.
 *
 * Motion, once on load: the photographs settle into place with a small
 * stagger. Then each photograph
 * keeps a slow, gentle sway — under a degree, on its own timing, so the six
 * never move together.
 *
 * The passing breeze: every 3s a soft gust crosses the collection from the
 * first photograph to the last. Each one in turn is pushed a little further
 * than its sway, swings back past rest and settles, like prints on a line
 * when the wind moves through the garden, and a patch of dappled light
 * slides across its photograph as the gust goes by. Then a brief pause,
 * until the next one. Hover lifts a photograph and eases it toward level.
 * Reduced motion: the whole composition is simply there, still — one row
 * of seven that narrower screens can swipe through.
 *
 * Each photograph links to its own category: it lands on Food & Drinks
 * already filtered (/?category=tea#food-drinks) — one step, not two.
 */

/*
 * How each frame hangs, in category order: its drop below the shared top
 * space (rem), resting tilt (deg), and its sway — swing either side of rest
 * (deg) and one full cycle (s), and how far the passing breeze pushes it
 * (deg). In the moving strip every frame hangs from the same line (one
 * drop, 32px), so the row travels as one level band; only the small
 * alternating tilts (under a degree) keep it a hung arrangement, not a grid.
 */
const DROP = 2

const HANG = [
  { drop: DROP, tilt: -1, sway: 0.7, cycle: 7.4, gust: 2.4 }, // Tea
  { drop: DROP, tilt: 0.6, sway: 0.55, cycle: 6.6, gust: 1.9 }, // Coffee
  { drop: DROP, tilt: -0.6, sway: 0.65, cycle: 8.2, gust: 2.2 }, // Snacks
  { drop: DROP, tilt: 0.9, sway: 0.5, cycle: 7, gust: 1.8 }, // Sweets
  { drop: DROP, tilt: -0.6, sway: 0.6, cycle: 7.8, gust: 2.1 }, // Milkshakes
  { drop: DROP, tilt: 0.6, sway: 0.75, cycle: 6.9, gust: 2.6 }, // Ice Cream
  { drop: DROP, tilt: -0.8, sway: 0.55, cycle: 7.6, gust: 2 }, // Falooda
]

// The sway begins once the entrance has settled, each frame a beat apart.
const SWAY_START = 2.8
const SWAY_STEP = 0.45

// The breeze: first gust once everything has settled, then one every
// cycle; it reaches each photograph a beat after the one before, so it
// travels across the row as a wave. (Cycle length lives in the CSS.)
const GUST_START = 5
const GUST_STEP = 0.18

// Entrance timeline (s): after the signature (≈0.2 → 0.9s) and action.
const T = { photos: 1.55 }
const STEP = 0.06

const settle = (delay, duration = 1.1) => ({ duration, ease: EASE_STANDARD, delay })

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

/*
 * The moving strip: the seven frames are one list, repeated COPIES times in
 * a single track. The track slides right by exactly one list's width (its
 * own width / COPIES, see .garland-track in the CSS) and starts over, which
 * lands every frame where the copy before it just was — no jump, no gap.
 * Three copies, not two: one list (~1020px) is a touch narrower than the
 * desktop window (66rem), so two would open a gap just before the reset.
 * The copies reuse the same image files, so nothing extra downloads; they
 * are hidden from assistive tech and their links are out of the tab order,
 * so keyboard and screen-reader users meet each photograph once. Not
 * `inert`: most of the time the frames on screen are copies, and they must
 * still answer a click or tap like the originals.
 */
const COPIES = 3

function Frames({ copy, from }) {
  const isCopy = copy > 0

  return (
    <ul
      className="garland"
      role="list"
      aria-label={isCopy ? undefined : 'What we serve'}
      aria-hidden={isCopy || undefined}
    >
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
                tabIndex={isCopy ? -1 : undefined}
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
  )
}

export default function HeroFoodMoment() {
  const prefersReducedMotion = useReducedMotion()
  // Reduced motion: render every layer in its final state.
  const from = (state) => (prefersReducedMotion ? false : state)

  return (
    <div className="garland-set">
      {/* Hover and keyboard focus hold the strip still (CSS), so a moving
          photograph is never a moving target. */}
      <div className="garland-strip">
        <div className="garland-strip__window">
          <div className="garland-track" style={{ '--copies': COPIES }}>
            {Array.from({ length: COPIES }, (_, copy) => (
              <Frames key={copy} copy={copy} from={from} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
