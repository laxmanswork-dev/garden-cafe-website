/**
 * Garden Cafe — business information, site structure and SEO defaults.
 *
 * RULE: never guess. Every value marked PLACEHOLDER must be replaced with
 * information supplied by Garden Cafe. Until then it stays `null` / empty,
 * and components must render nothing (not a fake value) for it.
 *
 * Find everything outstanding with:  grep -rn "PLACEHOLDER" src
 */

// The cafe's WhatsApp number, country code first, digits only. Confirmed by
// Garden Cafe (2026-10-16): the same number as the phone. Used by the
// floating WhatsApp button and by each dish's "Order on WhatsApp" on /menu.
const WHATSAPP_NUMBER = '917845388110'

/** A wa.me link that opens the cafe's chat with `text` typed in (never sent). */
const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

// The address as Google Maps should look it up.
const MAP_QUERY = 'The Garden Cafe, Otthapuli, North Kundal, Kanniyakumari, Tamil Nadu 629702'

export const cafe = {
  name: 'Garden Cafe',
  tagline: null, // PLACEHOLDER — supplied by client
  description: null, // PLACEHOLDER — supplied by client

  // Address supplied by Garden Cafe (2026-10-16).
  location: {
    placeName: 'The Garden Cafe',
    addressLine1: 'Otthapuli, North Kundal',
    addressLine2: null,
    city: 'Kanniyakumari',
    region: 'Tamil Nadu',
    postalCode: '629702',
    country: null, // PLACEHOLDER
    // Google Maps directions to the address above (no API key needed).
    mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`,
    // Google Maps embed of the same address (no API key needed).
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`,
    coordinates: null, // PLACEHOLDER — { lat: number, lng: number }
  },

  // Supplied by Garden Cafe (2026-10-16).
  phone: { display: '078453 88110', href: 'tel:+917845388110' },
  // `href` is the floating button's general enquiry; `orderHref(dish)`
  // is a dish's "Order on WhatsApp" on /menu. Both only prefill the chat:
  // the visitor presses Send, and the cafe confirms price and availability.
  whatsapp: {
    number: WHATSAPP_NUMBER,
    href: whatsappLink("Hi Garden Cafe! I'd like to plan a visit."),
    orderHref: (dishName) =>
      whatsappLink(
        `Hi Garden Cafe! I'd like to order ${dishName}. Could you please confirm the current price and availability?`,
      ),
  },

  // PLACEHOLDER — address string
  email: null,

  /**
   * Supplied by Garden Cafe (2026-10-16): every day, 5:30 AM – 11:00 PM.
   * Times are the cafe's own (`timeZone`). Shape:
   * { days: string, opens: 'HH:MM', closes: 'HH:MM', note?: string }
   * @type {{ days: string, opens: string, closes: string, note?: string }[]}
   */
  openingHours: [{ days: 'Daily', opens: '05:30', closes: '23:00' }],
  timeZone: 'Asia/Kolkata',

  /**
   * PLACEHOLDER — Shape:
   * { platform: 'instagram' | 'facebook' | …, label: string, href: string }
   * @type {{ platform: string, label: string, href: string }[]}
   */
  socialLinks: [],

  /**
   * The navbar and footer call to action. Since 2026-10-16 it is
   * "View menu" → /menu, where each dish has "Order on WhatsApp" (the
   * user's choice; it was "Reserve a table" → /#visit, then "Order now" →
   * a removed /order page). No booking system has been confirmed: `href` stays null, so
   * the Visit section shows no Reserve action. Setting `href` (external
   * booking URL) would take precedence over `to` here and show it there.
   */
  reservation: {
    label: 'View menu',
    to: '/menu',
    href: null, // PLACEHOLDER — external booking URL
  },

  /**
   * Destinations for calls to action whose pages or assets do not exist
   * yet. `null` renders the action in its disabled state (or hides optional
   * actions) — never a dead link. Fill these in as they become available.
   */
  links: {
    story: '/our-story', // the Our Story page
    storyVideo: null, // PLACEHOLDER — 'Watch our story' video URL (optional action)
    fullMenu: '/menu', // the full menu page (its content is still a placeholder)
    privacy: null, // PLACEHOLDER — Privacy Policy page
    terms: null, // PLACEHOLDER — Terms & Conditions page
  },
}

/**
 * Primary navigation (header and footer). Links resolve to homepage
 * chapters via hash ('Menu' goes to its own page); 'Home' returns to the top.
 */
export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'The Cafe', to: '/#the-place' },
  { label: 'Menu', to: '/menu' },
  { label: 'Visit Us', to: '/#visit' },
]

/**
 * SEO defaults consumed by components/Seo.
 * Indexing stays disabled until launch, so nothing provisional can end up
 * in search results.
 */
export const seo = {
  siteName: 'Garden Cafe',
  titleTemplate: '%s — Garden Cafe',
  defaultTitle: 'Garden Cafe — Good Food. Open Skies. Great Company.',
  // Approved positioning copy (The Place). Replace if the client supplies a
  // dedicated meta description.
  defaultDescription:
    'Garden Cafe is an open-air space designed for good food, easy conversations and time spent together.',
  siteUrl: null, // PLACEHOLDER — production origin, e.g. 'https://…' (no trailing slash)
  locale: null, // PLACEHOLDER — Open Graph locale, e.g. 'en_GB'
  defaultImage: null, // PLACEHOLDER — { src: '/images/og/….jpg', width: 1200, height: 630, alt }
  twitterHandle: null, // PLACEHOLDER — '@handle' if the cafe uses X/Twitter
  themeColor: '#F7F5EF', // --color-paper
  allowIndexing: false, // set to true at launch, once placeholders are replaced
}
