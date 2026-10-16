import { useRef, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import Headline from '../../components/Headline/Headline'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import { place } from '../../data/homeContent'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { MEDIA } from '../../utils/breakpoints'
import CafeFeature from './CafeFeature'
import { makeFrame } from './botanical'
import { makeCues, useLeave } from './motion'
import './ThePlace.css'

/*
 * Four photographs in the order of place.points — one plain frame for all
 * four (see makeFrame in botanical.js). The organic tree crowns they once
 * sat in (makeTree) are kept there, unused.
 */
// `trunk` is now only the air between each crown and its rule: the trunks
// themselves are no longer drawn (BotanicalTree).
// One frame shared by all four features, identical in every dimension: a
// square-cornered stone moulding (4.4 units, ~8px at 1440), an ivory mount
// inside it (10 units, ~19px) and the photograph. The frame is as wide as
// the feature (--feature-w, ThePlace.css); its height is chosen so the
// photograph's window keeps the 334:186 proportion of the crops. Its size
// is mirrored in ThePlace.css (--frame-w, --frame-h, --frame-mat = moulding
// + mount), which places the words inside it.
const TREE = makeFrame({ width: 334, height: 198.8, rim: 4.4, mat: 10 })
const TREES = [TREE, TREE, TREE, TREE]

/*
 * Real Garden Cafe photographs only (public/images/cafe/place/, PNG made
 * from the masters): the courtyard (cafe/hv.png), the snacks
 * (food/snacks.png), the pavilion counter (a still from food/hvh.mp4) and
 * the lit tree at night (night.png, resized to night-web.png). Each is
 * fitted inside its crown like object-fit: cover; `focus` is its object-position (0–1 across, 0–1
 * down), chosen so the subject sits clear of the crown's edge.
 * `width` / `height` are the files' own pixels — the photo is stretched to
 * them (preserveAspectRatio="none"), so they must match the file exactly.
 * The site loads WebP copies (≤1600 wide, quality 82) made from the PNGs
 * beside them; after replacing a PNG, remake its .webp and update the size.
 */
const PHOTOS = [
  {
    // The courtyard's trees and the open sky between them.
    src: '/images/cafe/place/open-air.webp',
    alt: 'The open courtyard at Garden Cafe, shaded by tall trees, with potted plants along the paving.',
    width: 1600,
    height: 922,
    // Held right, so the covered seating shows beside the tree.
    focus: [0.95, 0.5],
  },
  {
    // The plate itself, with a little of the table and garden around it.
    src: '/images/cafe/place/good-food.webp',
    alt: 'Snacks served at Garden Cafe.',
    width: 825,
    height: 560,
    focus: [0.47, 0.58],
  },
  {
    // The covered counter and stools, framed by the palms: drawn a touch
    // closer and held to the bottom, so the seating, roof and greenery
    // all show.
    src: '/images/cafe/place/take-your-time.webp',
    alt: 'Palms around the counter and stools under the pavilion at Garden Cafe.',
    width: 1600,
    height: 902,
    focus: [0.6, 1],
    zoom: 1.1,
  },
  {
    // The courtyard at dusk: strings of bulbs overhead and the big tree
    // hung with fairy lights. Drawn a little closer and held left, so the
    // lights and the last of the sunset lead and most of the signboard on
    // the right falls outside the frame.
    src: '/images/cafe/place/night-web.webp',
    alt: 'Garden Cafe at dusk, with strings of warm bulbs overhead and a large tree hung with fairy lights.',
    width: 1338,
    height: 1176,
    focus: [0, 0.53],
    zoom: 1.2,
  },
]

// Two rows: the introduction with the first two features, then the other
// two.
const SPREADS = [
  [0, 1],
  [2, 3],
]

/**
 * 02 — The Cafe · LIGHT / EDITORIAL / BOTANICAL
 * One editorial spread: the label and headline, then two rows — Open air
 * and Good food, Take your time and When the light changes. Each feature
 * is one of four related trees — a real photograph seen through its crown
 * — standing on a rule, with its words beneath. Phones read it as one
 * column, a feature at a time.
 *
 * Motion (motion.js): the section comes into focus in order — headline,
 * row 1, row 2 — and leaves in layers, the intro and each feature lifting
 * and fading on its own as it passes the top of the screen.
 */
export default function ThePlace() {
  const introRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery(MEDIA.lg)
  const isTablet = useMediaQuery(MEDIA.md)
  const leave = useLeave(introRef, {
    lift: isDesktop ? 16 : isTablet ? 13 : 10,
    off: prefersReducedMotion,
  })
  const [cues] = useState(() => makeCues(place.points.length))

  return (
    <section
      id={place.id}
      className="chapter chapter--ruled place surface-paper"
      aria-labelledby="place-title"
    >
      {SPREADS.map((spread, spreadIndex) => (
        <div
          key={spread.join('-')}
          className={`container place__spread place__spread--${spreadIndex + 1}`}
        >
          {spreadIndex === 0 && (
            <m.div ref={introRef} className="place__intro" style={leave}>
              <ScrollReveal>
                <SectionLabel index={place.index}>{place.label}</SectionLabel>
              </ScrollReveal>
              <Headline
                id="place-title"
                lines={place.headline}
                reveal="fade-up"
                className="place__headline"
              />
            </m.div>
          )}

          <ol className="place__pair" role="list" start={spread[0] + 1}>
            {spread.map((index) => (
              <CafeFeature
                key={place.points[index].title}
                point={place.points[index]}
                index={index}
                tree={TREES[index]}
                photo={PHOTOS[index]}
                cue={cues[index]}
              />
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
