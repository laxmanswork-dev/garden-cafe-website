import { m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import Button from '../../components/Button/Button'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import PageTransition from '../../components/PageTransition/PageTransition'
import ScrollReveal, {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import Seo from '../../components/Seo/Seo'
import * as content from '../../data/homeContent'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import './DesignSystem.css'

/**
 * DEVELOPMENT ONLY — living reference for the design system.
 * Routed at /_system in dev; excluded from production builds (see App.jsx).
 * Specimen text uses the approved section headings only.
 */

const sections = [
  { id: 'hero', index: 1, label: 'Hero', headline: content.hero.headline },
  ...[content.place, content.food, content.day, content.moments, content.visit],
].map(({ id, index, label, headline }) => ({ id, index, label, heading: headline }))

const COLORS = [
  'ink',
  'ink-soft',
  'stone',
  'stone-soft',
  'paper',
  'white',
  'moss',
  'moss-dark',
  'text-muted',
]

const TYPE_SCALE = [
  ['display-xl', sections[0].heading.join(' ')],
  ['display-lg', sections[1].heading.join(' ')],
  ['display-md', sections[2].heading.join(' ')],
  ['heading-xl', sections[3].heading.join(' ')],
  ['heading-lg', sections[4].heading.join(' ')],
  ['heading-md', sections[5].heading.join(' ')],
  ['body-lg', sections[5].heading.join(' ')],
  ['body', sections[4].heading.join(' ')],
  ['body-sm', sections[4].heading.join(' ')],
  ['eyebrow', 'Eyebrow'],
  ['label', 'Label'],
  ['caption', 'Caption'],
]

function Block({ id, title, children }) {
  return (
    <section className="ds-block" aria-labelledby={id}>
      <h2 id={id} className="ds-block__title eyebrow">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function DesignSystem() {
  const progress = useScrollProgress({ smooth: true })

  return (
    <PageTransition>
      <Seo title="Design system" noIndex />
      <m.div className="ds-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <div className="ds container">
        <header className="ds-header">
          <p className="eyebrow text-muted">Development reference</p>
          <h1 className="display-md">Design system</h1>
        </header>

        <Block id="ds-colour" title="Colour">
          <ul className="ds-swatches" role="list">
            {COLORS.map((name) => (
              <li key={name} className="ds-swatch">
                <span
                  className="ds-swatch__chip"
                  style={{ backgroundColor: `var(--color-${name})` }}
                />
                <code className="caption">--color-{name}</code>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="ds-type" title="Typography">
          <div className="ds-type">
            {TYPE_SCALE.map(([token, sample]) => (
              <div key={token} className="ds-type__row">
                <code className="caption">.{token}</code>
                <p className={token}>{sample}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="ds-labels" title="Section labels">
          <ul className="ds-stack" role="list">
            {sections.map((section) => (
              <li key={section.id}>
                <SectionLabel index={section.index} as="span">
                  {section.label}
                </SectionLabel>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="ds-buttons" title="Buttons">
          <div className="ds-row">
            <Button iconEnd={<ArrowRight />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="text" iconEnd={<ArrowUpRight />}>
              Text
            </Button>
            <Button variant="icon" aria-label="Example icon button">
              <Plus />
            </Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="ds-row ds-row--surface surface-ink">
            <Button iconEnd={<ArrowRight />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="text">Text</Button>
            <MagneticButton>
              <Button variant="secondary">Magnetic</Button>
            </MagneticButton>
          </div>
        </Block>

        <Block id="ds-grid" title="Grid — 4 / 8 / 12 columns">
          <div className="grid ds-grid-overlay" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="ds-grid-overlay__col" />
            ))}
          </div>
          <div className="grid ds-grid-demo">
            <div className="col ds-grid-demo__cell" style={{ '--span-md': 5, '--span-lg': 7 }}>
              span 4 · 5 · 7
            </div>
            <div
              className="col ds-grid-demo__cell"
              style={{ '--span-md': 3, '--span-lg': 4, '--start-lg': 9 }}
            >
              span 4 · 3 · 4 (start 9)
            </div>
            <div
              className="col ds-grid-demo__cell"
              style={{
                '--span': 3,
                '--start': 2,
                '--span-md': 4,
                '--start-md': 3,
                '--span-lg': 5,
                '--start-lg': 3,
              }}
            >
              offset composition
            </div>
          </div>
        </Block>

        <Block id="ds-motion" title="Motion">
          <div className="ds-motion">
            <ScrollReveal as="h3" variant="mask" className="display-md">
              {sections[4].heading[0]}
            </ScrollReveal>
            <ScrollReveal as="p" variant="mask" className="display-md" delay={0.1}>
              {sections[4].heading[1]}
            </ScrollReveal>

            <ScrollReveal className="ds-motion__image" variant="image">
              <div className="ds-motion__frame">
                <span className="caption">Image entrance (photography supplied later)</span>
              </div>
            </ScrollReveal>

            <ScrollRevealGroup as="ul" className="ds-stack" role="list">
              {sections.slice(1, 5).map((section) => (
                <ScrollRevealItem as="li" key={section.id} className="heading-lg">
                  {section.heading.join(' ')}
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>

            <ScrollReveal as="p" className="body-lg measure">
              {sections[5].heading[0]}
            </ScrollReveal>
          </div>
        </Block>
      </div>
    </PageTransition>
  )
}
