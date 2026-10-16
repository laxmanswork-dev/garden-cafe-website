import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribe to a CSS media query. Re-renders only when the match changes.
 *
 * @example const isDesktop = useMediaQuery(MEDIA.lg)
 * @param {string} query
 * @param {boolean} [serverFallback] value used when window is unavailable
 * @returns {boolean}
 */
export function useMediaQuery(query, serverFallback = false) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}
