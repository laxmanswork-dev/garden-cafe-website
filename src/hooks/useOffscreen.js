import { useEffect, useRef } from 'react'

/**
 * Marks an element `data-offscreen` while it is out of view (with `margin`
 * to spare, so it is already running again before it comes back), and
 * calls `onChange(offscreen)` when that flips. CSS uses the attribute to
 * pause looping animations nobody can see — on phones they would otherwise
 * keep the main thread busy while the visitor scrolls the rest of the page.
 * Set straight on the element: no React state, so no re-renders.
 *
 * @param {import('react').RefObject<HTMLElement | null>} ref
 * @param {{ margin?: string, onChange?: (offscreen: boolean) => void }} [options]
 */
export function useOffscreen(ref, { margin = '200px 0px', onChange } = {}) {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting
        element.toggleAttribute('data-offscreen', offscreen)
        onChangeRef.current?.(offscreen)
      },
      { rootMargin: margin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, margin])
}
