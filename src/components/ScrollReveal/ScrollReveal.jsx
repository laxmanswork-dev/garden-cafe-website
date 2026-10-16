import { m, useReducedMotion } from 'framer-motion'
import { REVEAL_VARIANTS, VIEWPORT, staggerVariants } from '../../utils/motion'
import { cn } from '../../utils/cn'
import './ScrollReveal.css'

/**
 * Reveal content as it enters the viewport — once, subtly.
 *
 *   <ScrollReveal>…</ScrollReveal>                         fade-up (default)
 *   <ScrollReveal variant="fade" delay={0.1}>…</ScrollReveal>
 *   <ScrollReveal as="h2" variant="mask">Line of text</ScrollReveal>
 *   <ScrollReveal variant="image"><ResponsiveImage … /></ScrollReveal>
 *   <ScrollReveal variant="clip">…</ScrollReveal>       image/frame uncover
 *
 * The element stays in the DOM and in the accessibility tree throughout.
 * Reduced motion: transforms resolve instantly (MotionConfig), so content
 * appears with at most a short opacity fade.
 *
 * @param {object} props
 * @param {keyof typeof REVEAL_VARIANTS} [props.variant]
 * @param {string} [props.as]       element tag, e.g. 'div', 'h2', 'li'
 * @param {number} [props.delay]    seconds
 * @param {number} [props.amount]   0–1 of the element visible before it reveals
 */
export default function ScrollReveal({
  variant = 'fade-up',
  as = 'div',
  delay,
  amount = VIEWPORT.amount,
  className,
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion()
  const Element = m[as]
  const variants = REVEAL_VARIANTS[prefersReducedMotion && variant === 'clip' ? 'fade' : variant]

  // Mask and clip: the outer element observes the viewport; an inner layer
  // moves or is clipped. (An element translated out of a clipping box, or
  // clipped to nothing, never registers as in view — the reveal would
  // never fire.)
  if (variant === 'mask' || variant === 'clip') {
    const Inner = variant === 'mask' ? m.span : m.div
    return (
      <Element
        className={cn('scroll-reveal', `scroll-reveal--${variant}`, className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: VIEWPORT.once, amount }}
        {...rest}
      >
        <Inner className="scroll-reveal__inner" variants={variants} custom={delay}>
          {children}
        </Inner>
      </Element>
    )
  }

  return (
    <Element
      className={cn('scroll-reveal', className)}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: VIEWPORT.once, amount }}
      {...rest}
    >
      {children}
    </Element>
  )
}

/**
 * Staggered reveal: the group observes the viewport and releases its
 * ScrollRevealItem children one after another.
 *
 *   <ScrollRevealGroup as="ul">
 *     <ScrollRevealItem as="li">…</ScrollRevealItem>
 *   </ScrollRevealGroup>
 *
 * @param {object} props
 * @param {string} [props.as]
 * @param {number} [props.stagger]  seconds between children
 * @param {number} [props.delay]    seconds before the first child
 * @param {number} [props.amount]
 */
export function ScrollRevealGroup({
  as = 'div',
  stagger,
  delay = 0,
  amount = VIEWPORT.amount,
  className,
  children,
  ...rest
}) {
  const Element = m[as]

  return (
    <Element
      className={className}
      variants={staggerVariants(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: VIEWPORT.once, amount }}
      {...rest}
    >
      {children}
    </Element>
  )
}

/**
 * @param {object} props
 * @param {keyof typeof REVEAL_VARIANTS} [props.variant]  'mask' is not supported here
 * @param {string} [props.as]
 */
export function ScrollRevealItem({
  variant = 'fade-up',
  as = 'div',
  className,
  children,
  ...rest
}) {
  const Element = m[as]

  return (
    <Element
      className={cn('scroll-reveal', className)}
      variants={REVEAL_VARIANTS[variant]}
      {...rest}
    >
      {children}
    </Element>
  )
}
