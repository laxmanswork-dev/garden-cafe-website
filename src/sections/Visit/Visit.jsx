import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Button from '../../components/Button/Button'
import Headline from '../../components/Headline/Headline'
import ScrollReveal, {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import { cafe } from '../../data/cafeData'
import { visit } from '../../data/homeContent'
import { linkProps } from '../../utils/links'
import { formatTime, isOpenAt, minutesNow } from '../../utils/openingHours'
import './Visit.css'

/** How often the open/closed status is checked against the clock. */
const STATUS_CHECK_MS = 15000

function Placeholder({ children }) {
  return <p className="visit__placeholder">{children}</p>
}

function Location() {
  const { location } = cafe
  // 'Kanniyakumari, Tamil Nadu 629702' — the address as the cafe writes it.
  const lines = [
    location.placeName,
    location.addressLine1,
    location.addressLine2,
    [location.city, [location.region, location.postalCode].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', '),
    location.country,
  ].filter(Boolean)

  if (lines.length === 0) return <Placeholder>{visit.groups.location.placeholder}</Placeholder>
  return (
    <address className="visit__value">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </address>
  )
}

/**
 * Open or closed by the published hours, on the cafe's clock. Checked every
 * few seconds and whenever the tab comes back into view, so it turns over
 * at 5:30 AM and 11:00 PM without a reload.
 */
function isOpenNow() {
  const minutes = minutesNow(cafe.timeZone)
  return cafe.openingHours.some((entry) => isOpenAt(minutes, entry))
}

function useOpenNow() {
  const [open, setOpen] = useState(isOpenNow)

  useEffect(() => {
    const update = () => setOpen(isOpenNow())
    const timer = setInterval(update, STATUS_CHECK_MS)
    document.addEventListener('visibilitychange', update)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return open
}

function OpenStatus() {
  const open = useOpenNow()
  return (
    <p className="visit__status" data-open={open} aria-live="polite">
      {open ? visit.groups.hours.open : visit.groups.hours.closed}
    </p>
  )
}

function Hours() {
  if (cafe.openingHours.length === 0) {
    return <Placeholder>{visit.groups.hours.placeholder}</Placeholder>
  }
  return (
    <div className="visit__hours-group">
      <ul className="visit__value visit__hours" role="list">
        {cafe.openingHours.map((entry) => (
          <li key={entry.days}>
            <span>{entry.days}</span>
            <span className="text-tabular">
              {formatTime(entry.opens)} – {formatTime(entry.closes)}
            </span>
            {entry.note && <span className="visit__note">{entry.note}</span>}
          </li>
        ))}
      </ul>
      <OpenStatus />
    </div>
  )
}

function Contact() {
  const { phone, email } = cafe
  if (!phone && !email) return <Placeholder>{visit.groups.contact.placeholder}</Placeholder>
  return (
    <p className="visit__value">
      {phone && (
        <a className="link" href={phone.href}>
          {phone.display}
        </a>
      )}
      {email && (
        <a className="link" href={`mailto:${email}`}>
          {email}
        </a>
      )}
    </p>
  )
}

const GROUPS = [
  { key: 'location', Value: Location },
  { key: 'hours', Value: Hours },
  { key: 'contact', Value: Contact },
]

/** 04 — Visit Us · LIGHT / CLEAN · asymmetric information grid */
export default function Visit() {
  return (
    <section id={visit.id} className="chapter visit surface-paper" aria-labelledby="visit-title">
      <div className="container chapter__inner visit__layout grid">
        <div className="col visit__intro">
          <SectionLabel index={visit.index}>{visit.label}</SectionLabel>
          <div className="visit__intro-body">
            <Headline id="visit-title" lines={visit.headline} />
            <ScrollReveal className="visit__copy" delay={0.2}>
              {/* Actions activate only once the information behind them exists. */}
              <div className="visit__actions">
                <Button iconEnd={<ArrowUpRight />} {...linkProps(cafe.location.mapUrl)}>
                  {visit.actions.directions}
                </Button>
                {cafe.phone && (
                  <Button variant="secondary" href={cafe.phone.href}>
                    {visit.actions.call}
                  </Button>
                )}
                {cafe.reservation.href && (
                  <Button variant="text" iconEnd={<ArrowRight />} href={cafe.reservation.href}>
                    {visit.actions.reserve}
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollRevealGroup as="dl" className="col visit__info" stagger={0.1}>
          {GROUPS.map(({ key, Value }) => (
            <ScrollRevealItem key={key} className="visit__group">
              <dt className="eyebrow">{visit.groups[key].title}</dt>
              <dd>
                <Value />
              </dd>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        {cafe.location.mapEmbedUrl && (
          <ScrollReveal className="visit__map">
            <iframe
              src={cafe.location.mapEmbedUrl}
              title={visit.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
