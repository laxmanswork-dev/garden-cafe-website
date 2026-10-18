import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import Button from '../../components/Button/Button'
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import { galleryPhotos } from '../../data/galleryPhotos'
import { gallery } from '../../data/homeContent'
import { useOffscreen } from '../../hooks/useOffscreen'
import './Gallery.css'
import { useGalleryVideos } from './useGalleryVideos'

// Each frame shows ~150–290px of photograph (Gallery.css): the 400 copy on
// standard screens, the 800 copy on sharp ones.
const SIZES = '(min-width: 48em) 25vw, 42vw'

// The frames that hold a video (the rest hold a photograph).
const VIDEOS = galleryPhotos.filter((photo) => photo.video)

function Frame({ photo, copy, videoHost }) {
  // A video frame shows its poster (or else its photograph) until — and
  // wherever — the video is not playing.
  const poster = photo.video?.poster
  const still = poster ?? photo.src
  const style = photo.focalPoint ? { '--focus': photo.focalPoint } : undefined

  return (
    <li className="gallery__item">
      <figure className="gallery__frame">
        <div className="gallery__photo" style={style}>
          {still ? (
            <img
              src={still}
              srcSet={poster ? photo.video.posterSrcSet : photo.srcSet}
              sizes={SIZES}
              // The copy repeats the first set for the loop; it is hidden
              // from assistive technology, so its images carry no alt.
              alt={copy ? '' : photo.alt}
              width={800}
              height={1000}
              // The gallery is the third chapter, always below the first
              // screen: every image waits until it is nearly in view.
              loading="lazy"
              decoding="async"
            />
          ) : (
            <ImagePlaceholder ratio="auto" label={photo.video ? 'video' : 'photo'} />
          )}
          {photo.video && (
            <div
              ref={videoHost(photo.id, copy)}
              className="gallery__video"
              data-video-id={photo.id}
              data-video-copy={copy ? 1 : 0}
            />
          )}
        </div>
        <figcaption className="gallery__label">{photo.label}</figcaption>
      </figure>
    </li>
  )
}

/**
 * 03 — The Gallery · four photographs on one slow ribbon.
 *
 * The label and a single short line, then the four framed photographs
 * (data/galleryPhotos.js) drifting left to right as one continuous strip,
 * the way prints might pass in a quiet window display. The strip is the set
 * twice over: it moves by exactly one set's width and starts again, so the
 * loop never shows a seam. The second set is hidden from assistive
 * technology.
 *
 * Tablets and up see just under four at once; phones about two. The motion
 * is a CSS animation (transform only), so
 * nothing re-renders while it runs. It pauses while a mouse rests over it,
 * and the Pause button stops it for everyone. Reduced motion: no movement —
 * the four sit still in a row that scrolls sideways where it is wider than
 * the screen.
 *
 * A frame may hold a short video instead of a photograph (galleryPhotos.js);
 * useGalleryVideos loads and plays it — once, however often it is drawn —
 * over its poster. The Pause button pauses the videos too.
 */
export default function Gallery() {
  const [paused, setPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const ribbonRef = useRef(null)
  // Out of view, the strip rests (CSS: .gallery[data-offscreen]).
  useOffscreen(sectionRef)
  const videoHost = useGalleryVideos({
    sectionRef,
    ribbonRef,
    videos: VIDEOS,
    paused,
    off: prefersReducedMotion,
  })

  return (
    <section
      ref={sectionRef}
      id={gallery.id}
      className="chapter chapter--ruled gallery surface-paper"
      aria-labelledby="gallery-title"
    >
      <div className="container gallery__head">
        <div className="gallery__intro">
          <ScrollReveal>
            <SectionLabel index={gallery.index}>{gallery.label}</SectionLabel>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.09}>
            <h2 id="gallery-title" className="gallery__headline heading-lg">
              {gallery.headline}
            </h2>
          </ScrollReveal>
        </div>

        {!prefersReducedMotion && (
          <ScrollReveal variant="fade" delay={0.18} className="gallery__control">
            <Button
              variant="text"
              size="sm"
              iconStart={paused ? <Play /> : <Pause />}
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Play the gallery' : 'Pause the gallery'}
            >
              {paused ? 'Play' : 'Pause'}
            </Button>
          </ScrollReveal>
        )}
      </div>

      <ScrollReveal variant="fade" delay={0.12}>
        <div
          ref={ribbonRef}
          className="gallery__ribbon"
          data-paused={paused || undefined}
          role="region"
          aria-label="Gallery photographs"
          // Reduced motion: the still row may scroll sideways, so keyboard
          // users can reach it.
          tabIndex={prefersReducedMotion ? 0 : undefined}
        >
          <div className="gallery__track">
            <ul className="gallery__set" role="list">
              {galleryPhotos.map((photo) => (
                <Frame key={photo.id} photo={photo} videoHost={videoHost} />
              ))}
            </ul>
            <ul className="gallery__set gallery__set--copy" role="list" aria-hidden="true" inert>
              {galleryPhotos.map((photo) => (
                <Frame key={photo.id} photo={photo} videoHost={videoHost} copy />
              ))}
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
