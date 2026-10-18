/**
 * Page titles and descriptions — APPROVED WORDING (2026-10-19). Reproduce
 * exactly. One entry per real route; nothing here for pages that do not
 * exist.
 *
 * Read twice: by components/Seo in the browser, and by the build
 * (vite.config.js), which writes the same tags into each page's HTML file
 * so link previews and crawlers that do not run JavaScript see them too.
 * Keep this file free of imports that only work in the browser.
 */

export const pageMeta = {
  home: {
    path: '/',
    title: 'Garden Cafe | Open-Air Cafe in Kanniyakumari',
    description:
      'An open-air cafe in North Kundal, Kanniyakumari, serving South Indian favourites, snacks and refreshing drinks — for good food, easy conversations and time spent together.',
  },
  menu: {
    path: '/menu',
    title: 'Menu | Garden Cafe, Kanniyakumari',
    description:
      'The Garden Cafe menu: breakfast, snacks, specials and savoury bites, fresh juices, milkshakes, vegetable juices and mojitos. Order any dish on WhatsApp.',
  },
  story: {
    path: '/our-story',
    title: 'Our Story | Garden Cafe, Kanniyakumari',
    description:
      'The story behind Garden Cafe in Kanniyakumari — years of working abroad, a dream shared by two, and an open-air place for good food and time together.',
  },
  // Any address that is not a page. Kept out of search results; it keeps
  // the site's default description.
  notFound: {
    title: 'Page not found | Garden Cafe',
    noIndex: true,
  },
}
