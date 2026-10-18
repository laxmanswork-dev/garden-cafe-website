import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cafe, navigation } from '../../data/cafeData'
import { useLenis } from '../../hooks/useLenis'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { MEDIA } from '../../utils/breakpoints'
import { cn } from '../../utils/cn'
import Button from '../Button/Button'
import './Navbar.css'

const SCROLL_THRESHOLD = 24

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Keep Tab / Shift+Tab inside `container` while the mobile menu is open. */
function trapFocus(event, container) {
  const focusable = [...container.querySelectorAll(FOCUSABLE)].filter(
    (element) => element.offsetParent !== null,
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/**
 * Site navigation — structural foundation; final visual design comes later.
 *
 * States (as classes on <header>):
 *   navbar--transparent / navbar--solid   initial appearance
 *   is-solid                              solid now (scrolled, menu open, or variant)
 *   is-scrolled                           page scrolled past the threshold
 *   is-menu-open                          mobile menu open
 *   navbar--on-dark                       transparent over dark imagery
 *
 * @param {object} props
 * @param {'transparent' | 'solid'} [props.variant]
 * @param {'dark' | 'light'} [props.tone]  text tone while transparent
 */
export default function Navbar({ variant = 'transparent', tone = 'dark' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDesktop = useMediaQuery(MEDIA.lg)
  const isScrolled = useScrolledPast(SCROLL_THRESHOLD)
  const scroll = useLenis()
  const menuId = useId()
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  // The mobile menu cannot stay open once the layout becomes desktop.
  if (isDesktop && isMenuOpen) setIsMenuOpen(false)

  const isSolid = variant === 'solid' || isScrolled || isMenuOpen
  const { reservation } = cafe

  const closeMenu = useCallback(({ restoreFocus = false } = {}) => {
    setIsMenuOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    scroll.lock()
    panelRef.current?.querySelector(FOCUSABLE)?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu({ restoreFocus: true })
      if (event.key === 'Tab' && headerRef.current) trapFocus(event, headerRef.current)
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      scroll.unlock()
    }
  }, [isMenuOpen, scroll, closeMenu])

  const handleToggle = () => {
    if (isMenuOpen) closeMenu({ restoreFocus: true })
    else setIsMenuOpen(true)
  }

  const handleNavigate = () => closeMenu()

  return (
    <header
      ref={headerRef}
      className={cn('navbar', `navbar--${variant}`, {
        'navbar--on-dark': tone === 'light',
        'is-solid': isSolid,
        'is-scrolled': isScrolled,
        'is-menu-open': isMenuOpen,
      })}
    >
      <div className="navbar__bar container">
        <Link className="navbar__logo" to="/" onClick={handleNavigate}>
          {/* The badge is decorative next to the wordmark, which names the link. */}
          <img
            className="navbar__badge"
            src="/images/brand/garden-cafe-logo.webp"
            alt=""
            width="240"
            height="240"
            decoding="async"
          />
          {cafe.name}
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="navbar__toggle"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={handleToggle}
        >
          <span className="navbar__toggle-line" aria-hidden="true" />
          <span className="navbar__toggle-line" aria-hidden="true" />
        </button>

        <div
          ref={panelRef}
          id={menuId}
          className="navbar__panel"
          inert={!isDesktop && !isMenuOpen}
          data-lenis-prevent
        >
          <nav className="navbar__nav" aria-label="Primary">
            <ul className="navbar__links">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link className="navbar__link" to={item.to} onClick={handleNavigate}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            className="navbar__cta"
            size="sm"
            {...(reservation.href ? { href: reservation.href } : { to: reservation.to })}
            onClick={handleNavigate}
          >
            {reservation.label}
          </Button>
        </div>
      </div>
    </header>
  )
}
