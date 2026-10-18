import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { m, useReducedMotion } from 'framer-motion'
import Headline from '../../components/Headline/Headline'
import MenuItem from '../../components/MenuItem/MenuItem'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import Seo from '../../components/Seo/Seo'
import { menu, SPECIALS_GROUPS } from '../../data/menuData'
import { reportMissingMenuImages } from '../../utils/menuImages'
import { EASE_STANDARD } from '../../utils/motion'
import './Menu.css'

/*
 * /menu — the full Garden Cafe menu: an intro, a thin bar of sections that
 * stays in reach, then each section as a numbered chapter — its title held
 * beside a grid of dishes, each with its own photograph frame, number and
 * name. Content: data/menuData.js. Photographs: public/images/menu/.
 *
 * One grid for every section (Menu.css): two dishes to a row from 600px,
 * one on phones — so every frame on the page is the same size.
 */
const COLUMNS = 2

// The photograph's display width (see Menu.css).
const SIZES = '(min-width: 64em) 30vw, (min-width: 37.5em) 45vw, 100vw'

/* --------------------------------------------------------------------------
   The section bar: every section, one tap away; the one in view is marked.
   -------------------------------------------------------------------------- */

const SECTION_IDS = menu.map((section) => section.id)

function useSectionInView(ids) {
  const [current, setCurrent] = useState(ids[0])

  useEffect(() => {
    // A section counts as "in view" while it crosses a band just below the
    // bars at the top of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setCurrent(visible[0].target.id)
          return
        }
        // Nothing in the band: above the first section (back at the page
        // heading, e.g. after Home or a jump to the top), the first one
        // leads again rather than the last one passed on the way down.
        const first = document.getElementById(ids[0])
        if (first && first.getBoundingClientRect().top > window.innerHeight * 0.25) {
          setCurrent(ids[0])
        }
      },
      { rootMargin: '-25% 0px -70% 0px' },
    )
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [ids])

  return current
}

function SectionBar() {
  const current = useSectionInView(SECTION_IDS)
  const listRef = useRef(null)

  // Keep the current section in sight when the bar scrolls sideways.
  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector('[aria-current="location"]')
    if (!list || !link || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 3, behavior: 'smooth' })
  }, [current])

  return (
    <nav className="menu-bar" aria-label="Menu sections">
      <ul ref={listRef} className="menu-bar__list container" role="list">
        {menu.map((section) => (
          <li key={section.id}>
            <Link
              to={`#${section.id}`}
              className="menu-bar__link"
              aria-current={current === section.id ? 'location' : undefined}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* --------------------------------------------------------------------------
   A chapter: number, title, rule — then its dishes.
   -------------------------------------------------------------------------- */

const HEAD = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const NUMBER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE_STANDARD } },
}
const TITLE = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_STANDARD } },
}
// Each dish reveals as it reaches the screen; along a row they follow one
// another by a beat (`custom` = position in the row).
const DISH = {
  hidden: { opacity: 0, y: 20 },
  visible: (column) => ({
    opacity: 1,
    y: 0,
    transition: { delay: column * 0.07, duration: 0.8, ease: EASE_STANDARD },
  }),
}

function Chapter({ section, isFirst }) {
  // Reduced motion: everything is simply there — nothing waits to be revealed.
  const initial = useReducedMotion() ? false : 'hidden'
  const titleId = `${section.id}-title`

  return (
    <section id={section.id} className="menu-chapter" aria-labelledby={titleId}>
      <m.header
        className="menu-chapter__head"
        initial={initial}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={HEAD}
      >
        <m.p className="menu-chapter__number eyebrow text-tabular" variants={NUMBER}>
          {section.number}
        </m.p>
        <m.h2 id={titleId} className="menu-chapter__title" variants={TITLE}>
          {section.title}
        </m.h2>
        <span className="menu-chapter__rule" aria-hidden="true" />
      </m.header>

      <div className="menu-chapter__body">
        {groupDishes(section.items).map((group) => (
          <Fragment key={group.label ?? 'all'}>
            {group.label && <p className="menu-chapter__group eyebrow">{group.label}</p>}
            <ul className="menu-chapter__dishes" role="list" aria-label={group.label}>
              {group.dishes.map(({ item, number }, index) => (
                <m.li
                  key={item.id}
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={DISH}
                  custom={index % COLUMNS}
                >
                  <MenuItem
                    item={item}
                    number={number}
                    sizes={SIZES}
                    priority={isFirst && number <= COLUMNS}
                  />
                </m.li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

/**
 * A section's dishes, numbered 01, 02… through the whole section. When its
 * dishes carry two or more `group`s (Specials & Savoury Bites), they are
 * split under those subheadings, in SPECIALS_GROUPS order; otherwise one
 * unlabelled group.
 */
function groupDishes(items) {
  const labels = [...new Set(items.map((item) => item.group).filter(Boolean))]
  if (labels.length < 2) {
    return [{ label: null, dishes: items.map((item, i) => ({ item, number: i + 1 })) }]
  }
  const rank = (label) => {
    const at = SPECIALS_GROUPS.indexOf(label)
    return at === -1 ? SPECIALS_GROUPS.length : at
  }
  // Dishes without a group come first, under no subheading.
  const ordered = [null, ...labels.sort((a, b) => rank(a) - rank(b))]
  let number = 0
  return ordered
    .map((label) => ({
      label,
      dishes: items
        .filter((item) => (item.group ?? null) === label)
        .map((item) => ({ item, number: (number += 1) })),
    }))
    .filter((group) => group.dishes.length > 0)
}

// "breakfast, specials & savoury bites, …, vegetable juices and mojitos" — from the sections shown.
const SECTION_LIST = new Intl.ListFormat('en-GB').format(
  menu.map((section) => section.title.toLowerCase()),
)

export default function Menu() {
  useEffect(() => {
    reportMissingMenuImages(menu.flatMap((section) => section.items))
  }, [])

  return (
    <PageTransition>
      <Seo
        title="Garden Cafe Menu | Food & Drinks"
        absoluteTitle
        description={`The Garden Cafe menu: ${SECTION_LIST}.`}
      />

      <div className="menu-page">
        <header className="menu-page__intro container">
          <ScrollReveal>
            <SectionLabel index={4}>The Menu</SectionLabel>
          </ScrollReveal>
          <Headline
            as="h1"
            lines={['The Garden Cafe menu']}
            reveal="fade-up"
            className="menu-page__title"
          />
        </header>

        <SectionBar />

        <div className="menu-page__chapters container">
          {menu.map((section, index) => (
            <Chapter key={section.id} section={section} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
