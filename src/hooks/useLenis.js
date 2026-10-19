import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Smooth scrolling (Lenis) — setup and access.
 *
 * Lenis only smooths wheel input on the window. Keyboard, touch, scrollbar,
 * find-in-page and focus-driven scrolling remain fully native. It is not
 * initialised at all for users who prefer reduced motion.
 *
 * Everything scrolls through a *scroll controller*, which uses Lenis when it
 * is running and falls back to native scrolling otherwise — so components
 * never need to know whether Lenis is active.
 *
 * Opt a nested scroll area out of Lenis with the `data-lenis-prevent`
 * attribute.
 */

const LENIS_OPTIONS = {
  autoRaf: true,
  lerp: 0.1, // physical, slightly weighted — not floaty
  smoothWheel: true,
  syncTouch: false, // native momentum scrolling on touch devices
  anchors: false, // hash navigation is routed through the scroll controller
}

/**
 * @typedef {object} ScrollToOptions
 * @property {boolean} [immediate] jump without animation
 * @property {number} [offset]    extra px offset (negative = stop higher)
 */

/**
 * @typedef {object} ScrollController
 * @property {Lenis | null} instance
 * @property {(target: number | string | HTMLElement, options?: ScrollToOptions) => void} scrollTo
 * @property {() => void} lock   stop scrolling (e.g. while a menu is open)
 * @property {() => void} unlock
 */

/** @returns {ScrollController & { attach: (l: Lenis) => void, detach: (l: Lenis) => void }} */
function createScrollController() {
  let lenis = null

  const resolveTarget = (target) =>
    typeof target === 'string' ? document.querySelector(target) : target

  return {
    get instance() {
      return lenis
    },

    attach(instance) {
      lenis = instance
    },

    detach(instance) {
      if (lenis === instance) lenis = null
    },

    scrollTo(target, { immediate = false, offset = 0 } = {}) {
      if (lenis) {
        // Measure the page first: Lenis caps every scroll at the height it
        // last measured, and after a route change that is still the previous
        // page's — a jump from /our-story to /#visit stopped at the bottom
        // of the short story page instead of reaching the section.
        lenis.resize()
        // Lenis reads scroll-margin-top / scroll-padding-top itself.
        lenis.scrollTo(target, { immediate, offset, force: true })
        return
      }

      const behavior = immediate ? 'instant' : 'smooth'
      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior })
        return
      }

      const element = resolveTarget(target)
      if (!element) return
      if (offset === 0) {
        element.scrollIntoView({ behavior, block: 'start' })
        return
      }
      const top = element.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior })
    },

    lock() {
      document.documentElement.classList.add('is-scroll-locked')
      lenis?.stop()
    },

    unlock() {
      document.documentElement.classList.remove('is-scroll-locked')
      lenis?.start()
    },
  }
}

export const LenisContext = createContext(createScrollController())

/**
 * Creates the scroll controller and manages the Lenis lifecycle.
 * Call once, near the root (see components/SmoothScroll).
 *
 * @param {object} options
 * @param {boolean} options.enabled false for reduced motion
 * @returns {ScrollController}
 */
export function useLenisSetup({ enabled }) {
  const [controller] = useState(createScrollController)

  useEffect(() => {
    if (!enabled) return undefined

    const lenis = new Lenis(LENIS_OPTIONS)
    controller.attach(lenis)

    return () => {
      controller.detach(lenis)
      lenis.destroy() // removes listeners, cancels rAF, strips html classes
    }
  }, [enabled, controller])

  return controller
}

/**
 * Access the scroll controller from any component.
 *
 * @example
 * const scroll = useLenis()
 * scroll.scrollTo('#visit')
 *
 * @returns {ScrollController}
 */
export function useLenis() {
  return useContext(LenisContext)
}
