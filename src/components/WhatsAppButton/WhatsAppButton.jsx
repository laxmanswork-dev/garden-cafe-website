import { useEffect, useRef } from 'react'
import { cafe } from '../../data/cafeData'
import WhatsAppIcon from '../WhatsAppIcon/WhatsAppIcon'
import './WhatsAppButton.css'

/**
 * WhatsAppButton — small floating chat link, bottom-right on every page.
 *
 * Renders nothing until `cafe.whatsapp.href` is set. When the footer's base
 * row (copyright and legal links) scrolls into view, the button rises so it
 * rests above that row instead of covering it.
 */
export default function WhatsAppButton() {
  const ref = useRef(null)
  const href = cafe.whatsapp?.href

  useEffect(() => {
    const button = ref.current
    if (!button) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const base = document.querySelector('.footer__base')
      const overlap = base ? Math.max(0, window.innerHeight - base.getBoundingClientRect().top) : 0
      button.style.setProperty('--whatsapp-lift', `${overlap}px`)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  if (!href) return null

  return (
    <a
      ref={ref}
      className="whatsapp-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Garden Cafe on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}
