/**
 * Breakpoints — mirror of src/styles/responsive.css. Keep both in sync.
 * Use with useMediaQuery(); prefer CSS media queries for pure styling.
 */
export const BREAKPOINTS = {
  sm: 600,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
}

const toEm = (px) => `${px / 16}em`

export const MEDIA = {
  sm: `(min-width: ${toEm(BREAKPOINTS.sm)})`,
  md: `(min-width: ${toEm(BREAKPOINTS.md)})`,
  lg: `(min-width: ${toEm(BREAKPOINTS.lg)})`,
  xl: `(min-width: ${toEm(BREAKPOINTS.xl)})`,
  '2xl': `(min-width: ${toEm(BREAKPOINTS['2xl'])})`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  finePointer: '(hover: hover) and (pointer: fine)',
}
