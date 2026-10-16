import { menu } from './menuData'

/**
 * 03 — Food & Drinks (homepage): the four ways into the menu, built only
 * from the verified menu (menuData.js). Nothing here is a new dish — each
 * category names menu sections and four of their dishes to preview:
 * the first four in menu order, or, where a category spans several groups
 * (Specials, Cold Drinks), the first photographed dish of each group.
 *
 * The previews use small WebP copies of the menu photographs
 * (public/images/menu/web/<file>-480.webp and -960.webp, made from the
 * PNG masters beside them). A dish chosen here needs both copies.
 * `previews` names a different file for a dish's homepage photograph.
 *
 * `focus` is the CSS object-position for the category's photographs:
 * drinks stand tall in their frames, so they are held a little higher.
 */
const CATEGORIES = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    sections: ['breakfast'],
    dishes: ['Idli', 'Appam', 'Idiyappam', 'Kal Dosai'],
  },
  {
    id: 'snacks',
    name: 'Snacks',
    sections: ['snacks'],
    dishes: ['Ulundhu Vadai', 'Paruppu Vadai', 'Samosa', 'Bonda'],
  },
  {
    id: 'specials',
    name: 'Specials',
    sections: ['specials'],
    dishes: ['Fish Fry', 'Chicken Sandwich', 'French Fries', 'Bread Omelette'],
  },
  {
    id: 'cold-drinks',
    name: 'Cold Drinks',
    sections: ['fresh-juices', 'milk', 'vegetable-juices', 'mojitos'],
    dishes: ['Lime', 'Rose Milk', 'Cucumber Juice', 'Lime Mint Mojito'],
    focus: '50% 38%',
    // The homepage shows its own Lime photograph (limehome (2).png);
    // /menu keeps lime.png.
    previews: { Lime: 'limehome' },
  },
]

const WEB = '/images/menu/web/'
const fileName = (path) => path.slice(path.lastIndexOf('/') + 1).replace(/\.[a-z0-9]+$/i, '')

/**
 * @typedef {object} HighlightDish
 * @property {string} id
 * @property {string} name
 * @property {string} alt
 * @property {string} src      480px WebP
 * @property {string} srcSet   480 and 960px WebP
 *
 * @typedef {object} MenuHighlight
 * @property {string} id
 * @property {string} number   two-digit display index
 * @property {string} name
 * @property {number} count    dishes in the category on /menu
 * @property {string} focus
 * @property {HighlightDish[]} dishes
 */

/** @type {MenuHighlight[]} */
export const menuHighlights = CATEGORIES.map((category, index) => {
  const items = menu
    .filter((section) => category.sections.includes(section.id))
    .flatMap((section) => section.items)

  const dishes = category.dishes.map((name) => {
    const item = items.find((entry) => entry.name === name)
    if (!item) throw new Error(`menuHighlights: "${name}" is not on the menu (${category.name}).`)
    const file = category.previews?.[name] ?? fileName(item.image)
    return {
      id: item.id,
      name: item.name,
      alt: item.alt,
      src: `${WEB}${file}-480.webp`,
      srcSet: `${WEB}${file}-480.webp 480w, ${WEB}${file}-960.webp 960w`,
    }
  })

  return {
    id: category.id,
    number: String(index + 1).padStart(2, '0'),
    name: category.name,
    count: items.length,
    focus: category.focus ?? '50% 50%',
    dishes,
  }
})

/**
 * The hero's food cards link here with their own category
 * (/?category=snacks#food-drinks). Those that match a category open it;
 * the rest open the first.
 */
export const heroCategoryToHighlight = {
  snacks: 'snacks',
  milkshakes: 'cold-drinks',
}
