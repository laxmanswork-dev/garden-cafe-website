import { cn } from '../../utils/cn'
import './ImagePlaceholder.css'

/**
 * TEMPORARY stand-in for photography that has not been supplied yet.
 * Reserves the exact art-directed frame (ratio) so the composition is
 * final; swap for <ResponsiveImage> once real Garden Cafe photos exist.
 * It is decorative, so it is hidden from assistive technology.
 *
 * @param {object} props
 * @param {string} [props.ratio]  e.g. '4 / 5'
 * @param {string} props.label    what belongs here, e.g. 'Food photograph'
 */
export default function ImagePlaceholder({ ratio = '4 / 5', label, className }) {
  return (
    <div
      className={cn('image-placeholder', className)}
      style={{ '--placeholder-ratio': ratio }}
      aria-hidden="true"
      data-placeholder="image"
    >
      <span className="image-placeholder__label">[ {label} ]</span>
    </div>
  )
}
