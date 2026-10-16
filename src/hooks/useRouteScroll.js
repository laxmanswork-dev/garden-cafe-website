import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from './useLenis'

/**
 * Scroll to the element named by a URL hash and move focus to it, so
 * keyboard and screen-reader users land where sighted users do.
 *
 * @returns {boolean} whether the target exists
 */
function scrollToHash(hash, scroll, { immediate }) {
  const id = decodeURIComponent(hash.slice(1))
  const element = id ? document.getElementById(id) : null
  if (!element) return false

  scroll.scrollTo(element, { immediate })
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
  element.focus({ preventScroll: true })
  return true
}

/**
 * Same-page navigation: hash links (/#visit) scroll smoothly to their
 * section; a link to the current page without a hash returns to the top.
 * On first load, a hash in the URL is honoured once content has rendered.
 *
 * Cross-page navigation is handled by useScrollOnPageEnter, which runs
 * after the outgoing page has faded out.
 */
export function useRouteScroll() {
  const { pathname, hash, key } = useLocation()
  const scroll = useLenis()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const isSamePage = previousPathname.current === pathname
    previousPathname.current = pathname
    if (!isSamePage) return

    const isInitialLoad = key === 'default'
    if (hash) {
      scrollToHash(hash, scroll, { immediate: isInitialLoad })
    } else if (!isInitialLoad) {
      scroll.scrollTo(0)
    }
  }, [pathname, hash, key, scroll])
}

/**
 * Runs when a page mounts after a route change: start at the top, or at the
 * hash target if one was requested. Skipped on first load so the browser's
 * own scroll restoration is respected.
 */
export function useScrollOnPageEnter() {
  const { hash, key } = useLocation()
  const scroll = useLenis()
  // Once per page mount: later hash changes on this page belong to
  // useRouteScroll.
  const hasEntered = useRef(false)

  useEffect(() => {
    if (hasEntered.current) return
    hasEntered.current = true

    if (key === 'default') return
    if (hash && scrollToHash(hash, scroll, { immediate: true })) return
    scroll.scrollTo(0, { immediate: true })
  }, [hash, key, scroll])
}
