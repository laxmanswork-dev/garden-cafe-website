/**
 * What Garden Cafe offers — the seven categories that rotate in the hero's
 * food moment (components/HeroFoodMoment), in their approved order.
 *
 * PHOTOGRAPHY — PLACEHOLDER
 * Only real Garden Cafe food photographs belong here (never stock or
 * AI-generated images). To add one:
 *   1. Save it at the `image` path in public/images/food/
 *      (at least 800px on the short side; shown cropped to a 4:5 print).
 *   2. Set `photoSupplied: true`.
 *   3. Optionally set `focalPoint` (CSS object-position, e.g. '50% 60%')
 *      so the crop keeps the dish in frame.
 *   4. For the web, serve WebP copies 320 and 640px wide from
 *      public/images/food/web/ (`image` + `srcSet`); the original stays
 *      in public/images/food/ as the master. The frames show ~115–250px, so
 *      the full-size PNGs (650KB–1MB each) are never sent to visitors.
 * Until then the food moment shows a clearly marked placeholder frame, and no
 * request is made for the missing file.
 *
 * `alt` describes the photograph — update it to describe the real shot.
 */

/**
 * @typedef {object} MenuCategory
 * @property {string} id
 * @property {string} number        two-digit display index
 * @property {string} name
 * @property {string} image         path under /public
 * @property {string} alt
 * @property {boolean} photoSupplied  PLACEHOLDER flag — true once the real photo exists
 * @property {string} [focalPoint]   object-position for the crop
 * @property {string} [srcSet]       optional responsive renditions
 * @property {{ src: string, width: number, height: number }} [large]
 *   the full-width rendition, for the Food & Drinks spread
 */

/** @type {MenuCategory[]} */
export const menuCategories = [
  {
    id: 'tea',
    number: '01',
    name: 'Tea',
    image: '/images/food/web/tea-640.webp',
    srcSet: '/images/food/web/tea-320.webp 320w, /images/food/web/tea-640.webp 640w',
    alt: 'Tea served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/tea-825.webp', width: 825, height: 774 },
  },
  {
    id: 'coffee',
    number: '02',
    name: 'Coffee',
    image: '/images/food/web/coffee-640.webp',
    srcSet: '/images/food/web/coffee-320.webp 320w, /images/food/web/coffee-640.webp 640w',
    alt: 'Coffee served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/coffee-825.webp', width: 825, height: 648 },
  },
  {
    id: 'snacks',
    number: '03',
    name: 'Snacks',
    image: '/images/food/web/snacks-640.webp',
    srcSet: '/images/food/web/snacks-320.webp 320w, /images/food/web/snacks-640.webp 640w',
    alt: 'Snacks served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/snacks-825.webp', width: 825, height: 601 },
  },
  {
    // Falooda is not yet in the verified menu (menuData.js), so its link
    // opens Food & Drinks at its first category.
    id: 'falooda',
    number: '04',
    name: 'Falooda',
    image: '/images/food/web/falooda-640.webp',
    srcSet: '/images/food/web/falooda-320.webp 320w, /images/food/web/falooda-640.webp 640w',
    alt: 'Falooda served at Garden Cafe',
    photoSupplied: true,
  },
  {
    id: 'milkshakes',
    number: '05',
    name: 'Milkshakes',
    image: '/images/food/web/milkshakes-640.webp',
    srcSet: '/images/food/web/milkshakes-320.webp 320w, /images/food/web/milkshakes-640.webp 640w',
    alt: 'Chocolate and vanilla milkshakes served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/milkshakes-825.webp', width: 825, height: 859 },
  },
  {
    id: 'iceCream',
    number: '06',
    name: 'Ice Cream',
    image: '/images/food/web/ice-cream-640.webp',
    srcSet: '/images/food/web/ice-cream-320.webp 320w, /images/food/web/ice-cream-640.webp 640w',
    alt: 'Ice cream served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/ice-cream-807.webp', width: 807, height: 634 },
  },
  {
    id: 'sweets',
    number: '07',
    name: 'Sweets',
    image: '/images/food/web/sweets-640.webp',
    srcSet: '/images/food/web/sweets-320.webp 320w, /images/food/web/sweets-640.webp 640w',
    alt: 'Sweets served at Garden Cafe',
    photoSupplied: true,
    large: { src: '/images/food/web/sweets-775.webp', width: 775, height: 611 },
  },
]
