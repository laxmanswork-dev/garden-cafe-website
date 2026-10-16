import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { cafe, navigation } from '../../data/cafeData'
import { footer } from '../../data/homeContent'
import './Footer.css'

const YEAR = new Date().getFullYear()

function LegalLink({ to, children }) {
  // PLACEHOLDER pages: shown as plain text until the page exists, so the
  // footer never contains a dead link.
  if (!to) return <span className="footer__legal-item is-pending">{children}</span>
  return (
    <Link className="footer__legal-item footer__link" to={to}>
      {children}
    </Link>
  )
}

/** Footer · DARK / CLOSING FRAME · structured closing grid */
export default function Footer() {
  const { reservation, socialLinks, links } = cafe

  return (
    <footer className="footer surface-ink">
      <div className="container footer__inner">
        <div className="footer__main grid">
          <div className="col footer__brand">
            <p className="footer__wordmark">{footer.brand}</p>
            <p className="footer__place eyebrow">{footer.place}</p>
          </div>

          <nav className="col footer__nav" aria-label="Footer">
            <ul className="footer__nav-list">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link className="footer__link eyebrow" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col footer__actions">
            <Button
              variant="secondary"
              size="sm"
              iconEnd={<ArrowRight />}
              {...(reservation.href ? { href: reservation.href } : { to: reservation.to })}
            >
              {reservation.label}
            </Button>

            {socialLinks.length > 0 && (
              <ul className="footer__social" role="list">
                {socialLinks.map((social) => (
                  <li key={social.platform}>
                    <a
                      className="footer__link eyebrow"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer__base">
          <p className="footer__copyright">
            © {YEAR} {cafe.name}
          </p>
          <div className="footer__legal">
            <LegalLink to={links.privacy}>{footer.legal.privacy}</LegalLink>
            <LegalLink to={links.terms}>{footer.legal.terms}</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
