import { m, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Button from '../../components/Button/Button'
import GardenSignature from '../../components/GardenSignature/GardenSignature'
import HeroFoodMoment from '../../components/HeroFoodMoment/HeroFoodMoment'
import { cafe } from '../../data/cafeData'
import { hero } from '../../data/homeContent'
import { useOffscreen } from '../../hooks/useOffscreen'
import { DURATION, EASE_STANDARD } from '../../utils/motion'
import './Hero.css'

/*
 * 01 — Hero · LIGHT / CENTRED
 *
 * Confidence through restraint: a small descriptor, the large signed
 * "Garden" as the statement, the two actions — then the moving line of food
 * photographs beneath. The navbar keeps the badge and wordmark.
 *
 * Entrance (once, on load): the signature fades in; the action fades up;
 * then the food line settles into place.
 * Reduced motion: transforms resolve instantly, only short fades remain.
 */

const settle = (delay, duration = DURATION.slow) => ({ duration, ease: EASE_STANDARD, delay })

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: settle(delay),
})

// Background film: _source-assets/public/images/food/garden.mp4 (the
// original, kept outside the site) cleaned for the web —
// denoised and given a light clarity grade (H.264, no audio, faststart),
// with the 50 fps source halved to 25 fps. Larger screens get a
// Lanczos-upscaled 1440p cut (9.4 MB); phones get 1080p (6.5 MB). The first
// frame is the poster, shown until playback starts and held for reduced motion.
const HERO_VIDEO_HD = '/images/cafe/garden-hero-1440.mp4'
const HERO_VIDEO = '/images/cafe/garden-hero.mp4'
const HERO_POSTER = '/images/cafe/garden-hero.webp'

/**
 * Data Saver is on, or the browser rates the connection 3G or slower: the
 * film (6–9 MB) would cost the visitor more than it gives, so the poster —
 * the film's first frame — stays, as it does under reduced motion. Browsers
 * without the Network Information API (Safari, Firefox) report nothing and
 * play the film as before.
 */
function isConstrainedConnection() {
  const connection = typeof navigator === 'undefined' ? null : navigator.connection
  if (!connection) return false
  return connection.saveData === true || /^(slow-2g|2g|3g)$/.test(connection.effectiveType ?? '')
}

/**
 * Whether the film may start loading: once the page itself has loaded, so
 * its megabytes never compete with the scripts, fonts and photographs the
 * first view needs (the poster — the film's first frame — holds until
 * then). Never under reduced motion, which keeps the poster and so needs
 * no film at all — nor on a slow or metered connection (see below).
 */
function useFilmReady(prefersReducedMotion) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || isConstrainedConnection()) return undefined
    let timer = 0
    const start = () => {
      timer = setTimeout(() => setReady(true), 0)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      clearTimeout(timer)
    }
  }, [prefersReducedMotion])

  return ready
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const filmReady = useFilmReady(prefersReducedMotion)
  const videoRef = useRef(null)

  // Sources added after mount need an explicit load. If the browser
  // refuses to autoplay (e.g. data saver), the poster simply stays.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (prefersReducedMotion) {
      video.pause()
      return
    }
    if (!filmReady) return
    video.load()
    video.play()?.catch(() => {})
  }, [filmReady, prefersReducedMotion])

  // Scrolled away: the film rests and the food line's loops pause (CSS,
  // .hero[data-offscreen]), so neither costs anything while unseen. Both
  // carry on where they left off on the way back.
  const sectionRef = useRef(null)
  useOffscreen(sectionRef, {
    onChange: (offscreen) => {
      const video = videoRef.current
      if (!video || !filmReady || prefersReducedMotion) return
      if (offscreen) video.pause()
      else video.play()?.catch(() => {})
    },
  })

  return (
    <section ref={sectionRef} className="hero surface-ink" aria-labelledby="hero-title">
      {/* Decorative: muted, looping, hidden from assistive tech. Reduced
          motion holds the first frame instead of playing. */}
      <div className="hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero__video"
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          preload="none"
        >
          {filmReady && (
            <>
              <source src={HERO_VIDEO_HD} type="video/mp4" media="(min-width: 64em)" />
              <source src={HERO_VIDEO} type="video/mp4" />
            </>
          )}
        </video>
      </div>

      <div className="hero__content">
        {/* Supporting descriptor above the h1 — a paragraph, not a heading. */}
        <m.p className="hero__eyebrow eyebrow" {...fadeUp(0.15)}>
          {hero.eyebrow}
        </m.p>

        {/* The page's h1: the signed "Garden" as the hero's statement. Screen
            readers and search engines read "Garden Cafe"; the signature is
            drawn complete and only fades in, briefly — it is in the page from
            the first render, so nothing waits on the animation. */}
        <h1 id="hero-title" className="hero__headline">
          <span className="visually-hidden">{cafe.name}</span>
          <m.span
            className="hero__signature"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={settle(0.2, DURATION.slow)}
          >
            <GardenSignature />
          </m.span>
        </h1>

        <m.div className="hero__actions" {...fadeUp(0.55)}>
          {/* Primary: the menu — what most visitors come for first. Black
              filled, like the navbar's Reserve. */}
          <Button variant="primary" className="hero__menu-link" to={hero.menuCta.to}>
            {hero.menuCta.label}
          </Button>
          {/* Secondary: the space itself — an ivory outline, no fill. */}
          <Button variant="secondary" to={hero.primaryCta.to} iconEnd={<ArrowRight />}>
            {hero.primaryCta.label}
          </Button>
          {/* Optional action: appears once a story video is supplied. */}
          {cafe.links.storyVideo && (
            <Button variant="text" href={cafe.links.storyVideo} iconStart={<Play />}>
              {hero.secondaryCta.label}
            </Button>
          )}
        </m.div>

        {/* The G-A-R-D-E-N food line — each part handles its own entrance. */}
        <div className="hero__food">
          <HeroFoodMoment />
        </div>
      </div>
    </section>
  )
}
