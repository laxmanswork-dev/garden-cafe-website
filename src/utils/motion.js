/**
 * Motion system — Framer Motion side.
 * Values mirror the CSS tokens in src/styles/variables.css. Keep in sync.
 *
 * Principles: subtle · slow · physical · intentional.
 * Animate transform and opacity only.
 */

/** cubic-bezier(0.22, 1, 0.36, 1) — --ease-standard */
export const EASE_STANDARD = [0.22, 1, 0.36, 1]
/** cubic-bezier(0.65, 0, 0.35, 1) — --ease-in-out */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

/** Seconds. Mirrors --duration-fast / --duration-normal / --duration-slow. */
export const DURATION = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.9,
}

/** Delay between siblings in a staggered reveal (seconds). */
export const STAGGER = 0.08

/** Springs for pointer-following and scroll-linked values. */
export const SPRING = {
  magnetic: { stiffness: 180, damping: 18, mass: 0.4 },
  scroll: { stiffness: 120, damping: 30, restDelta: 0.001 },
}

/** Default in-view trigger: once, when a quarter of the element is visible. */
export const VIEWPORT = { once: true, amount: 0.25 }

const reveal = (delay) => ({
  duration: DURATION.slow,
  ease: EASE_STANDARD,
  // Only set delay when asked: an explicit `delay: 0` would override the
  // parent's staggerChildren timing.
  ...(delay ? { delay } : {}),
})

/**
 * Reveal variants, keyed by name. Each uses `hidden` → `visible` and accepts
 * `custom` = delay in seconds.
 *
 * With MotionConfig reducedMotion="user", transforms resolve instantly and
 * only opacity fades — so every variant still ends fully visible.
 */
export const REVEAL_VARIANTS = {
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    visible: (delay) => ({ opacity: 1, y: 0, transition: reveal(delay) }),
  },
  fade: {
    hidden: { opacity: 0 },
    visible: (delay) => ({ opacity: 1, transition: reveal(delay) }),
  },
  // Masked line reveal: the inner element rises from behind a clipping edge.
  mask: {
    hidden: { y: '105%' },
    visible: (delay) => ({ y: '0%', transition: reveal(delay) }),
  },
  // Image reveal: the frame uncovers upward, like a print being revealed.
  // ScrollReveal swaps this for 'fade' under reduced motion (clip-path is
  // not a transform, so MotionConfig would not neutralise it).
  clip: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    visible: (delay) => ({
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { ...reveal(delay), duration: DURATION.slow * 1.3, ease: EASE_IN_OUT },
    }),
  },
  // Image entrance: settles from a slight scale.
  image: {
    hidden: { opacity: 0, scale: 1.04 },
    visible: (delay) => ({
      opacity: 1,
      scale: 1,
      transition: { ...reveal(delay), duration: DURATION.slow * 1.4 },
    }),
  },
}

/** Parent variants that stagger ScrollRevealItem children. */
export const staggerVariants = (stagger = STAGGER, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Page-level transition: opacity only, so it is safe for every user. */
export const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE_STANDARD } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_IN_OUT } },
}
