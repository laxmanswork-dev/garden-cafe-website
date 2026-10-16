/**
 * Image conventions
 *
 * Real Garden Cafe photography lives in public/images/{cafe,food}.
 * Export every photo at the widths below, in WebP (and optionally AVIF):
 *
 *   public/images/cafe/terrace-640.webp
 *   public/images/cafe/terrace-960.webp
 *   public/images/cafe/terrace-1280.webp
 *   public/images/cafe/terrace-1920.webp
 *
 * then describe it once with createImage() in a data file.
 */

export const IMAGE_WIDTHS = [640, 960, 1280, 1920]

/** Common `sizes` values, matched to the editorial grid. */
export const IMAGE_SIZES = {
  full: '100vw',
  wide: '(min-width: 64em) 75vw, 100vw',
  half: '(min-width: 64em) 50vw, (min-width: 48em) 60vw, 100vw',
  third: '(min-width: 64em) 33vw, (min-width: 48em) 50vw, 100vw',
}

/**
 * @param {'cafe' | 'food'} folder
 * @param {string} name   file name without width suffix or extension
 * @param {number} width
 * @param {string} [format]
 */
export function imagePath(folder, name, width, format = 'webp') {
  return `/images/${folder}/${name}-${width}.${format}`
}

export function buildSrcSet(folder, name, widths = IMAGE_WIDTHS, format = 'webp') {
  return widths.map((w) => `${imagePath(folder, name, w, format)} ${w}w`).join(', ')
}

/**
 * @typedef {object} ImageAsset
 * @property {string} src       fallback source (a mid-size rendition)
 * @property {string} srcSet
 * @property {number} width     intrinsic width of the original — reserves layout
 * @property {number} height    intrinsic height of the original
 * @property {string} alt       describes what is in the photo; '' only if decorative
 * @property {{ type: string, srcSet: string }[]} [sources]  e.g. AVIF
 */

/**
 * Describe a photo once; pass the result to <ResponsiveImage {...asset} />.
 *
 * @param {object} options
 * @param {'cafe' | 'food'} options.folder
 * @param {string} options.name
 * @param {number} options.width
 * @param {number} options.height
 * @param {string} options.alt
 * @param {number[]} [options.widths]
 * @param {boolean} [options.avif]  true if -{width}.avif renditions exist
 * @returns {ImageAsset}
 */
export function createImage({ folder, name, width, height, alt, widths = IMAGE_WIDTHS, avif }) {
  const fallbackWidth = widths[Math.min(1, widths.length - 1)]
  return {
    src: imagePath(folder, name, fallbackWidth),
    srcSet: buildSrcSet(folder, name, widths),
    width,
    height,
    alt,
    sources: avif
      ? [{ type: 'image/avif', srcSet: buildSrcSet(folder, name, widths, 'avif') }]
      : [],
  }
}
