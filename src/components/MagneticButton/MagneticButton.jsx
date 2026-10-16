import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { MEDIA } from '../../utils/breakpoints'
import { SPRING } from '../../utils/motion'
import { cn } from '../../utils/cn'
import './MagneticButton.css'

/**
 * Wraps an interactive element (usually <Button>) so it drifts gently
 * toward the pointer. Motion values drive the transform, so pointer
 * movement never re-renders React.
 *
 * Only active for a fine hovering pointer and when reduced motion is off;
 * otherwise it renders children untouched in place.
 *
 * @param {object} props
 * @param {number} [props.strength]  0–1, fraction of the pointer offset followed
 */
export default function MagneticButton({ strength = 0.25, className, children }) {
  const hasFinePointer = useMediaQuery(MEDIA.finePointer)
  const prefersReducedMotion = useReducedMotion()
  const isEnabled = hasFinePointer && !prefersReducedMotion

  const pull = Math.min(Math.max(strength, 0), 1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING.magnetic)
  const springY = useSpring(y, SPRING.magnetic)

  // Measured on the static outer frame, so the moving inner element never
  // feeds back into its own position.
  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * pull)
    y.set((event.clientY - (rect.top + rect.height / 2)) * pull)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (!isEnabled) {
    return <span className={cn('magnetic', className)}>{children}</span>
  }

  return (
    <span
      className={cn('magnetic', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <m.span className="magnetic__inner" style={{ x: springX, y: springY }}>
        {children}
      </m.span>
    </span>
  )
}
