/**
 * Menu — the full Garden Cafe menu (/menu) and the homepage's featured set.
 *
 * SOURCE: dish names as listed from Garden Cafe's own menu boards
 * (supplied 2026-10-03), spelling normalised to title case, plus the
 * Specials & Savoury Bites dishes confirmed the same day. Sections are
 * by type of dish. Names only — never sizes. Do not add dishes,
 * descriptions or ingredients that Garden Cafe has not confirmed.
 *
 * PHOTOGRAPHS — every dish has its own frame and its own file:
 *
 *   public/images/menu/<dish>.png     e.g. idli.png, blueberry-mojito.png
 *
 * All photographs share this one folder. A dish listed in two sections
 * would use the same file in both.
 *
 * Drop the real photograph at that path and the menu shows it; until then
 * the frame shows "Image to be added". .jpg, .webp and .avif work too under
 * the same name (see vite.config.js). To adjust a crop, give the dish an
 * objectPosition, e.g. dish('Idli', { objectPosition: '50% 40%' }).
 *
 * Prices are deliberately not used yet: every dish carries `price: null`
 * and the page does not render prices.
 */

/**
 * @typedef {object} MenuItem
 * @property {string} id              unique across the menu: '<category>-<dish>'
 * @property {string} category        the section's id
 * @property {string} name
 * @property {string} image           expected photograph path (see above)
 * @property {string} alt
 * @property {string} objectPosition  CSS object-position for the crop
 * @property {number | null} price    null = not shown
 * @property {string} [group]         subheading within a section (Specials)
 */

/**
 * The subheadings within Specials & Savoury Bites, in the order shown.
 * Only groups that have dishes appear.
 */
export const SPECIALS_GROUPS = ['Sandwiches', 'Fries & Loaded', 'Omelettes', 'Other Specials']

/**
 * @typedef {object} MenuSection
 * @property {string} id       anchor on /menu
 * @property {string} number   two-digit display index, from the section's place among those shown
 * @property {string} title
 * @property {MenuItem[]} items
 */

/** PLACEHOLDER — ISO 4217 code and display locale for price formatting. */
export const menuCurrency = {
  code: null, // PLACEHOLDER
  locale: null, // PLACEHOLDER
}

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// 'Lime Mint Mojito' → 'Lime mint mojito'; acronyms such as 'ABC' stay as they are.
const sentenceCase = (name) =>
  name
    .split(' ')
    .map((word, i) => (i === 0 || word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(' ')

/**
 * One dish. `overrides` may set objectPosition, alt or (later) price.
 * @param {string} name
 * @param {Partial<MenuItem>} [overrides]
 */
const dish = (name, overrides = {}) => ({ name, ...overrides })

/**
 * @param {string} id
 * @param {string} title
 * @param {ReturnType<typeof dish>[]} dishes
 * @param {(name: string) => string} [describe]  alt text for this section's dishes
 * @returns {MenuSection}
 */
function section(id, title, dishes, describe = (name) => `${name} served at Garden Cafe`) {
  return {
    id,
    title,
    items: dishes.map(({ name, ...overrides }) => ({
      id: `${id}-${slug(name)}`,
      category: id,
      name,
      image: `/images/menu/${slug(name)}.png`,
      alt: describe(sentenceCase(name)),
      objectPosition: 'center',
      price: null,
      ...overrides,
    })),
  }
}

/**
 * Every section, in menu order — by type of dish: breakfast, snacks,
 * savoury food, then cold drinks. A section with no confirmed dishes yet
 * stays here, ready, but is not shown (see `menu` below).
 */
const sections = [
  section('breakfast', 'Breakfast', [
    dish('Idli'),
    dish('Appam'),
    dish('Idiyappam'),
    dish('Kal Dosai'),
    dish('Puri Kizhangu'),
    dish('Sambar Vadai'),
    dish('Rasavadai'),
    dish('Kadalai Kari'),
    dish('Muttai Kari'),
    dish('Chapati', { image: '/images/menu/Chapati.png' }),
  ]),
  section('snacks', 'Snacks', [
    dish('Ulundhu Vadai'),
    dish('Paruppu Vadai'),
    dish('Samosa'),
    dish('Bonda'),
    dish('Ulundhu Paniyaram'),
    dish('Milagai Bajji'),
    dish('Vazhakkai Bajji'),
    dish('Pazham Bajji'),
  ]),
  // Burgers, sandwiches, fries, Maggi and noodles, omelettes and other
  // savoury specials — one section. Give each dish its `group` (one of
  // SPECIALS_GROUPS below); with two or more groups the page shows them
  // under small subheadings, in that order. One item per dish, never sizes.
  // Cheese Fries is deliberately not on the menu.
  // Confirmed by Garden Cafe 2026-10-03. French Fries comes in sizes: one
  // item here.
  section('specials', 'Specials & Savoury Bites', [
    dish('Fish Fry', { image: '/images/menu/Fish.png' }),
    dish('Kelangu & Beef Curry', { image: '/images/menu/Kelangu & Beef Curry (2).png' }),
    dish('Veg Sandwich', { group: 'Sandwiches' }),
    dish('Chicken Sandwich', { group: 'Sandwiches' }),
    dish('Cheese Sandwich', { group: 'Sandwiches' }),
    dish('Cheese Chicken Sandwich', { group: 'Sandwiches' }),
    dish('French Fries', { group: 'Fries & Loaded' }),
    dish('Chicken Loaded Fries', { group: 'Fries & Loaded' }),
    dish('Chicken Popcorn', { group: 'Fries & Loaded', image: '/images/menu/Chicken Popcorn.png' }),
    dish('Broasted Chicken', { group: 'Fries & Loaded' }),
    dish('Bread Omelette', { group: 'Omelettes' }),
  ]),
  section(
    'fresh-juices',
    'Fresh Juices',
    [
      dish('Lime'),
      dish('Lime Mint'),
      dish('Apple Fresh'),
      dish('Grapes'),
      dish('Watermelon'),
      dish('Sweet Melon'),
      dish('Pomegranate'),
      dish('Pineapple'),
      dish('Mango'),
      dish('Orange'),
    ],
    (name) => `${name}, a fresh juice served at Garden Cafe`,
  ),
  // The milkshakes keep the photographs saved under their earlier names.
  section('milk', 'Milk & Milkshakes', [
    dish('Pista Milkshake', { image: '/images/menu/pista-milk.png' }),
    dish('Mango Milkshake', { image: '/images/menu/mango-milk.png' }),
    dish('Butterscotch Milkshake', { image: '/images/menu/butterscotch-milk.png' }),
    dish('Strawberry Milkshake', { image: '/images/menu/strawberry-milk.png' }),
    dish('Chocolate Milkshake', { image: '/images/menu/chocolate-milk.png' }),
    dish('Vanilla Milkshake', { image: '/images/menu/vanilla-milk.png' }),
    dish('Rose Milk'),
    dish('Badam Milk'),
  ]),
  section('vegetable-juices', 'Vegetable Juices', [
    dish('Cucumber Juice'),
    dish('Carrot Juice'),
    dish('White Pumpkin Juice'),
    dish('Beetroot Juice'),
    dish('Amla Juice'),
    dish('ABC Juice'),
  ]),
  section('mojitos', 'Mojitos', [
    dish('Lime Mint Mojito'),
    dish('Pineapple Mojito'),
    dish('Strawberry Mojito'),
    dish('Mango Mojito'),
    dish('Pomegranate Mojito'),
    dish('Green Apple Mojito'),
    dish('Black Currant Mojito'),
    dish('Watermelon Mojito'),
    dish('Blueberry Mojito'),
  ]),
]

/**
 * The menu as shown: sections with dishes, numbered 01, 02… in order, so a
 * section that gains its first dish takes its place and the rest renumber.
 *
 * @type {MenuSection[]}
 */
export const menu = sections
  .filter((entry) => entry.items.length > 0)
  .map((entry, index) => ({ ...entry, number: String(index + 1).padStart(2, '0') }))

/**
 * Homepage featured items (04 — Food & Drinks). PLACEHOLDER — empty until
 * Garden Cafe chooses which dishes to feature and supplies their photos;
 * the section shows marked placeholder slots meanwhile.
 *
 * @type {(MenuItem & { image?: import('../utils/image').ImageAsset, featured?: boolean })[]}
 */
export const menuItems = [] // PLACEHOLDER
