import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../../components/Button/Button'
import Headline from '../../components/Headline/Headline'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import { food } from '../../data/homeContent'
import { heroCategoryToHighlight, menuHighlights } from '../../data/menuHighlights'
import './FoodDrinks.css'

/** How long each category shows before the next takes its turn. */
const AUTOPLAY_MS = 2500
/** How long a category the visitor chose stays before the turns carry on. */
const CHOSEN_HOLD_MS = 6000

// Image sizes as laid out in FoodDrinks.css: the lead dish is two thirds of
// the content on desktop, full width below; the others a fifth / a third.
const LEAD_SIZES = '(min-width: 64em) 62vw, calc(100vw - 2.5rem)'
const MORE_SIZES = '(min-width: 64em) 20vw, 33vw'

/**
 * Fetch a category's photographs ahead of time, at the sizes the page will
 * ask for, so switching shows them at once instead of an empty frame.
 */
const warmed = new Set()
function warm(category) {
  if (warmed.has(category.id)) return
  warmed.add(category.id)
  category.dishes.forEach((dish, index) => {
    const img = new Image()
    img.sizes = index === 0 ? LEAD_SIZES : MORE_SIZES
    img.srcset = dish.srcSet
    img.src = dish.src
  })
}

const initialIndex = (param) => {
  const id = heroCategoryToHighlight[param]
  return Math.max(
    0,
    menuHighlights.findIndex((category) => category.id === id),
  )
}

/**
 * 03 — Food & Drinks · a way into the menu.
 *
 * The label and heading, then four categories taken from the
 * verified menu (data/menuHighlights.js) as one row of tabs, and beneath
 * it four dishes of the chosen category — one large, three small — in real
 * Garden Cafe photographs; one link leads to the complete menu (/menu). The
 * categories are WAI-ARIA tabs: arrow keys, Home and End move between them.
 * A rule slides beneath the row to the chosen category.
 *
 * Desktop (≥ 1024px): the large dish takes two thirds of the width, the
 * other three stand beside it in a column of the same height. Below that,
 * the large dish sits above the other three. Below 768px the row of
 * categories scrolls sideways.
 */
export default function FoodDrinks() {
  const [params] = useSearchParams()
  const heroCategory = params.get('category')
  const [active, setActive] = useState(() => initialIndex(heroCategory))
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const tabsRef = useRef([])
  const [indicator, setIndicator] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const baseId = useId().replace(/:/g, '')
  const near = useInView(sectionRef, { once: true, margin: '600px 0px' })
  const onScreen = useInView(sectionRef, { amount: 0.35 })
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  // How long the current category stays: a visitor's own choice is held a
  // little longer before the turns carry on.
  const [hold, setHold] = useState(AUTOPLAY_MS)

  // The categories take turns while the section is on screen. They wait
  // while a keyboard user is moving through them, and never turn when the
  // visitor asks for reduced motion. Each category gets its full time.
  useEffect(() => {
    if (!onScreen || keyboardFocus || prefersReducedMotion) return undefined
    const timer = setTimeout(() => {
      setHold(AUTOPLAY_MS)
      setActive((current) => (current + 1) % menuHighlights.length)
    }, hold)
    return () => clearTimeout(timer)
  }, [active, hold, onScreen, keyboardFocus, prefersReducedMotion])

  // Arriving from a hero food card opens its category. Adjusted while
  // rendering (React's pattern for state that follows a changed input), so
  // the right category paints first time, with no extra render.
  const [seenCategory, setSeenCategory] = useState(heroCategory)
  if (heroCategory !== seenCategory) {
    setSeenCategory(heroCategory)
    if (heroCategory) setActive(initialIndex(heroCategory))
  }

  // Once the section is near, fetch every category's photographs.
  useEffect(() => {
    if (near) menuHighlights.forEach(warm)
  }, [near])

  // The sliding rule follows the chosen tab, and the row (when it scrolls,
  // on phones) keeps that tab in view.
  useLayoutEffect(() => {
    const list = listRef.current
    const measure = () => {
      const tab = tabsRef.current[active]
      if (!tab) return
      setIndicator({ x: tab.offsetLeft, width: tab.offsetWidth })
      if (list.scrollWidth > list.clientWidth) {
        const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
        list.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
    }
    measure()
    // Re-measure when the row or any tab changes size (resizing, or the
    // display font arriving after first paint).
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    tabsRef.current.forEach((tab) => tab && observer.observe(tab))
    return () => observer.disconnect()
  }, [active, prefersReducedMotion])

  const select = (index, { focus = false } = {}) => {
    const next = (index + menuHighlights.length) % menuHighlights.length
    setActive(next)
    setHold(CHOSEN_HOLD_MS)
    if (focus) tabsRef.current[next]?.focus({ preventScroll: true })
  }

  const onKeyDown = (event) => {
    const keys = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: menuHighlights.length - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(keys[event.key], { focus: true })
  }

  const tabId = (index) => `${baseId}-tab-${index}`
  const panelId = `${baseId}-panel`

  return (
    <section
      ref={sectionRef}
      id={food.id}
      className="chapter chapter--ruled food surface-paper"
      aria-labelledby="food-title"
    >
      <div className="container food__inner">
        {/* The heading, and the link to the complete menu beside it (on the
            right, above the last category, on desktop; beneath it below). */}
        <div className="food__head">
          <div className="food__intro">
            <ScrollReveal>
              <SectionLabel index={food.index}>{food.label}</SectionLabel>
            </ScrollReveal>
            <Headline
              id="food-title"
              lines={food.headline}
              size="heading-xl"
              reveal="fade-up"
              className="food__headline"
            />
          </div>

          <ScrollReveal variant="fade-up" delay={0.18} className="food__cta">
            <Button variant="primary" to={food.cta.to} iconEnd={<ArrowUpRight />}>
              {food.cta.label}
            </Button>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-up" className="food__menu">
          <div
            ref={listRef}
            className="food__tabs"
            role="tablist"
            aria-label="Menu categories"
            onKeyDown={onKeyDown}
            onFocus={(event) => setKeyboardFocus(event.target.matches(':focus-visible'))}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false)
            }}
          >
            {menuHighlights.map((entry, index) => (
              <button
                key={entry.id}
                ref={(node) => (tabsRef.current[index] = node)}
                id={tabId(index)}
                type="button"
                role="tab"
                className="food__tab"
                aria-selected={index === active}
                aria-controls={panelId}
                tabIndex={index === active ? 0 : -1}
                onClick={() => select(index)}
              >
                <span className="food__tab-number eyebrow text-tabular" aria-hidden="true">
                  {entry.number}
                </span>
                <span className="food__tab-name">{entry.name}</span>
                <span className="food__tab-count">{entry.count} on the menu</span>
              </button>
            ))}
            {indicator && (
              <span
                className="food__indicator"
                aria-hidden="true"
                style={{
                  width: indicator.width,
                  transform: `translateX(${indicator.x}px)`,
                }}
              />
            )}
          </div>

          <div id={panelId} className="food__panel" role="tabpanel" aria-labelledby={tabId(active)}>
            {/* All four categories share one place; the chosen one fades in
                on top while the last stays beneath it until covered, so the
                change is a true crossfade and nothing around it moves
                (FoodDrinks.css). The others are hidden from assistive tech. */}
            {menuHighlights.map((entry, index) => {
              const [lead, ...rest] = entry.dishes
              const isActive = index === active
              return (
                <div
                  key={entry.id}
                  className="food__dishes"
                  data-active={isActive}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  style={{ '--focus': entry.focus }}
                >
                  <figure className="food__dish food__dish--lead">
                    <div className="food__photo">
                      <img
                        src={lead.src}
                        srcSet={lead.srcSet}
                        sizes={LEAD_SIZES}
                        alt={lead.alt}
                        width="960"
                        height="640"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <figcaption className="food__dish-name">{lead.name}</figcaption>
                  </figure>

                  <ul className="food__more" role="list">
                    {rest.map((dish) => (
                      <li key={dish.id} className="food__dish">
                        <div className="food__photo">
                          <img
                            src={dish.src}
                            srcSet={dish.srcSet}
                            sizes={MORE_SIZES}
                            alt={dish.alt}
                            width="480"
                            height="320"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <span className="food__dish-name">{dish.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
