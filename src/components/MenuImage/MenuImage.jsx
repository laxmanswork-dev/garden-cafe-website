import { useEffect, useRef, useState } from 'react'
import { menuImageCopies, resolveMenuImage } from '../../utils/menuImages'
import { cn } from '../../utils/cn'
import './MenuImage.css'

/**
 * One dish's photograph, in its frame.
 *
 * - One frame for every dish: a fixed 4:3 (MenuImage.css) that no
 *   photograph, placeholder or caller can change, so nothing shifts.
 * - No photograph yet (or it fails to load): a quiet "Image to be added"
 *   with the dish name — never a broken image. Menu photographs that do
 *   not exist are never requested (utils/menuImages.js).
 * - While a photograph loads the frame stays plain, then it fades in.
 *
 * @param {object} props
 * @param {string} props.src             expected path, e.g. /images/menu/idli.png
 * @param {string} props.alt
 * @param {string} props.itemName        shown in the placeholder
 * @param {string} [props.objectPosition] default 'center'
 * @param {string} [props.sizes]
 * @param {boolean} [props.priority]     load eagerly (first visible dishes only)
 * @param {string} [props.className]
 */
export default function MenuImage({
  src,
  alt,
  itemName,
  objectPosition = 'center',
  sizes,
  priority = false,
  className,
}) {
  const file = resolveMenuImage(src)
  // Small WebP copies when they are up to date; otherwise the file itself.
  const copies = menuImageCopies(file)
  const imgRef = useRef(null)
  const [status, setStatus] = useState(file ? 'loading' : 'missing')

  // A cached photograph can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'missing')
  }, [file])

  const isMissing = !file || status === 'missing'

  return (
    <div className={cn('menu-image', `is-${isMissing ? 'missing' : status}`, className)}>
      {isMissing ? (
        <div className="menu-image__placeholder" aria-hidden="true">
          <span className="menu-image__note">Image to be added</span>
          <span className="menu-image__name">{itemName}</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          className="menu-image__img"
          src={copies?.src ?? file}
          srcSet={copies?.srcSet}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          style={{ objectPosition }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('missing')}
        />
      )}
    </div>
  )
}
