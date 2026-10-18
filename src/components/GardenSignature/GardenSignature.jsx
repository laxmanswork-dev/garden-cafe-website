import { signature } from './signatureStrokes'
import './GardenSignature.css'

/*
 * The signed "Garden" — the cafe's own mark, drawn from its pen strokes
 * (signatureStrokes.js), never set in a font. Inline SVG: no request, sharp
 * at any size and density, sized entirely by CSS (height; the width follows
 * the 72 × 38 drawing). The strokes are in the drawing's own units, so they
 * thicken with it and the signature keeps its proportions at every size.
 * Decorative here: whoever places it names it (e.g. a visually hidden
 * "Garden Cafe" beside it in a heading).
 */

// The pen, in drawing units: at the original small size (~1.75 screen px
// per unit) this drew the strokes at ~1px; larger, they scale with it.
const PEN = 1 / 1.75

export default function GardenSignature({ className }) {
  return (
    <svg
      className={className ? `garden-signature ${className}` : 'garden-signature'}
      viewBox={signature.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={signature.slant}>
        {signature.strokes.map(([d, width]) => (
          <path key={d} d={d} strokeWidth={width * PEN} />
        ))}
      </g>
    </svg>
  )
}
