/*
 * The photograph frames of 02 — The Cafe.
 *
 * Each feature's photograph sits in one plain frame — a rectangle with a
 * barely rounded corner — drawn in units that ThePlace.css scales (--u).
 * (The section once drew its photographs inside organic tree crowns; the
 * file and component names remain from that.)
 */

const r1 = (n) => Math.round(n * 10) / 10

// A rectangle path with rounded corners.
const rect = (x, y, w, h, r) =>
  `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}` +
  `A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}` +
  `V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`

/**
 * A photographic frame, built like a real one from the outside in: a
 * moulding `rim` units wide, a warm-white mount `mat` units wide inside it,
 * then the photograph — and `gap` units of air beneath. `width` × `height`
 * is the moulding's outer edge.
 *
 * @param {{ width: number, height: number, radius?: number, gap?: number, mat?: number, rim?: number }} spec
 */
export function makeFrame({ width, height, radius = 0, gap = 0, mat = 0, rim = 0 }) {
  const edge = rim + mat
  const crown = { x: edge, y: edge, width: width - 2 * edge, height: height - 2 * edge }
  return {
    viewBox: `0 0 ${width} ${height + gap}`,
    ratio: `${width} / ${height + gap}`,
    width,
    moulding: rim ? rect(0, 0, width, height, radius) : null,
    // A fine line one unit inside the moulding's outer edge, where its
    // rounded profile catches the light.
    lip: rim ? rect(1, 1, width - 2, height - 2, 0) : null,
    mount: mat ? rect(rim, rim, width - 2 * rim, height - 2 * rim, rim ? 0 : radius) : null,
    canopy: rect(crown.x, crown.y, crown.width, crown.height, edge ? 0 : radius),
    crown,
  }
}

/**
 * Fit a photograph inside a frame like CSS `object-fit: cover`, with its
 * own `object-position` (focus, 0–1 on each axis) — never stretched. `zoom`
 * (1 or more) draws the photograph closer, so `focus` can crop both ways.
 *
 * @param {ReturnType<typeof makeFrame>} tree
 * @param {{ width: number, height: number, focus?: [number, number], zoom?: number }} photo
 */
export function coverCrown(tree, photo) {
  const { crown } = tree
  const [fx, fy] = photo.focus ?? [0.5, 0.5]
  const scale = Math.max(crown.width / photo.width, crown.height / photo.height) * (photo.zoom ?? 1)
  const width = photo.width * scale
  const height = photo.height * scale
  return {
    x: r1(crown.x - (width - crown.width) * fx),
    y: r1(crown.y - (height - crown.height) * fy),
    width: r1(width),
    height: r1(height),
  }
}
