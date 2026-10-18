import { cafe, seo } from '../data/cafeData.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** cafe.openingHours as Schema.org specifications. Only 'Daily' is mapped. */
function openingHours() {
  return cafe.openingHours.map(({ days, opens, closes }) => {
    if (days !== 'Daily') {
      throw new Error(
        `structured data: opening hours "${days}" are not mapped — update utils/structuredData.js`,
      )
    }
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS, opens, closes }
  })
}

/**
 * The cafe as Schema.org structured data (JSON-LD), for the homepage only —
 * the page that shows the address, hours and phone. Every value comes from
 * data/cafeData.js; nothing is added that the cafe has not confirmed (no
 * coordinates, ratings, reviews, prices or social profiles).
 *
 * `url` is added once seo.siteUrl (the production domain) is set; until
 * then it is left out rather than pointing anywhere provisional. The same
 * goes for a WebSite entry, which needs that URL to mean anything.
 *
 * Written into the built index.html by vite.config.js (pageHeads).
 */
export function cafeStructuredData() {
  const { location, phone } = cafe
  const business = {
    '@type': 'CafeOrCoffeeShop',
    name: location.placeName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [location.addressLine1, location.addressLine2].filter(Boolean).join(', '),
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.countryCode,
    },
    telephone: phone.href.replace(/^tel:/, ''),
    openingHoursSpecification: openingHours(),
  }

  if (!seo.siteUrl) return { '@context': 'https://schema.org', ...business }

  const site = new URL('/', seo.siteUrl).href
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...business, '@id': `${site}#cafe`, url: site },
      { '@type': 'WebSite', '@id': `${site}#website`, name: seo.siteName, url: site },
    ],
  }
}
