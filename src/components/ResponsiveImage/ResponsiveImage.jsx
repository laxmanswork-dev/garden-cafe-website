import { cn } from '../../utils/cn'
import './ResponsiveImage.css'

/**
 * The one way to render photography.
 *
 * - Space is always reserved (aspect-ratio from `ratio`, or width/height),
 *   so images never cause layout shift.
 * - Lazy by default. Set `priority` only for the hero / LCP image: it loads
 *   eagerly with high fetch priority.
 * - `alt` is required. Pass alt="" only for purely decorative images.
 *
 * Spread an ImageAsset from utils/image.js: <ResponsiveImage {...asset} sizes={IMAGE_SIZES.half} />
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {number} [props.width]      intrinsic width
 * @param {number} [props.height]     intrinsic height
 * @param {string} [props.srcSet]
 * @param {string} [props.sizes]
 * @param {{ type: string, srcSet: string }[]} [props.sources]  e.g. AVIF
 * @param {string} [props.ratio]      crop to a ratio, e.g. '4 / 5'; defaults to intrinsic
 * @param {string} [props.position]   object-position, e.g. '50% 30%'
 * @param {boolean} [props.priority]
 * @param {string} [props.className]  applied to the frame
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes = '100vw',
  sources = [],
  ratio,
  position,
  priority = false,
  className,
  ...rest
}) {
  if (import.meta.env.DEV && alt === undefined) {
    console.warn(`ResponsiveImage: missing alt for ${src}. Use alt="" only if decorative.`)
  }

  const aspectRatio = ratio ?? (width && height ? `${width} / ${height}` : undefined)

  return (
    <div
      className={cn('responsive-image', aspectRatio && 'responsive-image--framed', className)}
      style={{ '--image-ratio': aspectRatio, '--image-position': position }}
    >
      <picture>
        {sources.map((source) => (
          <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
        ))}
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          {...rest}
        />
      </picture>
    </div>
  )
}
