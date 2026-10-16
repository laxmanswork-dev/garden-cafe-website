import { m, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import Button from '../../components/Button/Button'
import HeroFoodMoment from '../../components/HeroFoodMoment/HeroFoodMoment'
import { cafe } from '../../data/cafeData'
import { hero } from '../../data/homeContent'
import { DURATION, EASE_STANDARD } from '../../utils/motion'
import './Hero.css'

/*
 * 01 — Hero · LIGHT / CENTRED
 *
 * Confidence through restraint: headline, one action — centred on warm
 * paper — then the G-A-R-D-E-N food line beneath the action: six real
 * photographs hanging from the letters of the word. The brand lives in the
 * navbar.
 *
 * Entrance (once, on load): the headline rises line by line from behind
 * masks; the action fades up; then the garden line draws itself in.
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
const HERO_POSTER = '/images/cafe/garden-hero.jpg'

/**
 * Whether the film may start loading: once the page itself has loaded, so
 * its megabytes never compete with the scripts, fonts and photographs the
 * first view needs (the poster — the film's first frame — holds until
 * then). Never under reduced motion, which keeps the poster and so needs
 * no film at all.
 */
function useFilmReady(prefersReducedMotion) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return undefined
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

  return (
    <section className="hero surface-ink" aria-labelledby="hero-title">
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

        {/* The page's h1. Masked rise, not an opacity fade: the text is painted
            from the first frame, so it never holds back Largest Contentful Paint. */}
        <h1 id="hero-title" className="hero__headline">
          {hero.headline.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && ' '}
              <span className="hero__line">
                <m.span
                  className="hero__line-inner"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={settle(0.25 + index * 0.09, DURATION.slow * 1.1)}
                >
                  {line}
                </m.span>
              </span>
            </Fragment>
          ))}
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
