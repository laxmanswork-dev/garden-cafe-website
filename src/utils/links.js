/**
 * Turn a destination from the data layer into Button props.
 *
 *   null / undefined        → { disabled: true }   (never a dead link)
 *   'https://…', 'tel:…'    → { href }
 *   '/path' or '/#section'  → { to }               (router link)
 *
 * @param {string | null | undefined} destination
 */
export function linkProps(destination) {
  if (!destination) return { disabled: true }
  return /^(https?:|mailto:|tel:)/.test(destination) ? { href: destination } : { to: destination }
}
