import available, { webCopies } from 'virtual:menu-images'

const MENU_PREFIX = '/images/menu/'
const EXTENSION = /\.[a-z0-9]+$/i

/**
 * The file to load for a menu photograph, or null when it has not been
 * added yet. Menu paths are looked up in the list of files that really
 * exist (vite.config.js), whatever their extension; other paths pass
 * through unchanged.
 *
 * @param {string | null | undefined} src
 * @returns {string | null}
 */
export function resolveMenuImage(src) {
  if (!src) return null
  if (!src.startsWith(MENU_PREFIX)) return src
  return available.get(src.replace(EXTENSION, '')) ?? null
}

/**
 * The 480 and 960px WebP copies of a resolved menu photograph, as an
 * `src` / `srcSet` pair, or null when it has no up-to-date copies (then
 * the original file is shown). See vite.config.js.
 *
 * @param {string | null} file  from resolveMenuImage()
 * @returns {{ src: string, srcSet: string } | null}
 */
export function menuImageCopies(file) {
  const copies = file && webCopies.get(file)
  if (!copies) return null
  const [small, large] = copies
  return { src: small, srcSet: `${small} 480w, ${large} 960w` }
}

/**
 * Development aid: list the menu photographs still to be added, once, in
 * the browser console (a warning, never an error).
 *
 * @param {{ name: string, image: string }[]} items
 */
let reported = false

export function reportMissingMenuImages(items) {
  if (!import.meta.env.DEV || reported) return
  reported = true
  const missing = items.filter((item) => !resolveMenuImage(item.image))
  if (missing.length === 0) return
  console.warn(
    `[menu] ${missing.length} of ${items.length} photographs not added yet. ` +
      'Place each file at its path (any of .jpg .png .webp .avif):\n' +
      missing.map((item) => `  ${item.image}  (${item.name})`).join('\n'),
  )
}
