/**
 * 03 — The Gallery: the six photographs, in the order they pass.
 *
 * PHOTOGRAPHY — PLACEHOLDER
 * Only real Garden Cafe photographs belong here (never stock or
 * AI-generated images). Until a slot's `src` is set, its frame shows a
 * plain placeholder and no image is requested. To add one:
 *   1. Save the original in _source-assets/public/images/cafe/gallery/.
 *   2. Make WebP copies 400 and 800px wide (quality ~80) in
 *      public/images/cafe/gallery/, e.g. open-air-seating-400.webp and
 *      open-air-seating-800.webp.
 *   3. Set `src` (the 800 copy) and `srcSet` below, and update `alt` to
 *      describe the real shot.
 *   4. Optionally set `focalPoint` (CSS object-position, e.g. '50% 60%') so
 *      the 4:5 crop keeps the subject in frame.
 *
 * VIDEO — every slot is already wired to public/images/cafe/gallery/<id>.mp4
 * Each of those files is EMPTY for now (a placeholder): an empty or missing
 * video is skipped, and the frame keeps its photograph or placeholder. To
 * make a slot move, replace its .mp4 with a real clip of the cafe, same
 * name. Keep the camera original in _source-assets/public/images/cafe/gallery/
 * and put a web copy in public/ — 5–10 seconds, H.264 MP4, 720px tall at
 * most, no sound, fast start — e.g.:
 *   ffmpeg -ss 0 -t 8 -i original.mp4 -an -vf "scale=-2:'min(720,ih)'"
 *     -c:v libx264 -profile:v high -crf 26 -preset slow
 *     -pix_fmt yuv420p -movflags +faststart time-with-friends.mp4
 * Optionally add a poster (the clip's first frame as WebP, 400 and 800
 * wide) as `poster` / `posterSrcSet`; without one the frame shows its
 * photograph (or placeholder) until the video starts.
 * The video loads only as the gallery nears the screen (useGalleryVideos).
 * Remove a slot's `video` to keep it a still photograph.
 *
 * `label` is the caption on the frame's mount.
 */

/**
 * @typedef {object} GalleryPhoto
 * @property {string} id
 * @property {string} label
 * @property {string} alt
 * @property {string | null} src     null until the real photograph exists
 * @property {string} [srcSet]
 * @property {string} [focalPoint]
 * @property {{ src: string, poster?: string, posterSrcSet?: string }} [video]
 *   a short MP4 shown in place of the photograph
 */

/** @type {GalleryPhoto[]} */
export const galleryPhotos = [
  // "Open-air seating" and "Thoughtful facilities" were removed at the
  // client's request (2026-10-17); their files are in backups/.
  {
    // Friends talking and spending time together at a table.
    id: 'time-with-friends',
    label: 'Relax and take your time',
    alt: 'String lights among the plants and the lit pavilion at Garden Cafe in the evening',
    src: null,
    // The supplied clip (time-with-friend.mp4, 7.8s portrait 1080×1920,
    // 20 MB): the whole clip at 30fps, 720×1280 H.264, no sound.
    // Poster: its first frame.
    video: {
      src: '/images/cafe/gallery/time-with-friends.mp4',
      poster: '/images/cafe/gallery/time-with-friends-poster-800.webp',
      posterSrcSet:
        '/images/cafe/gallery/time-with-friends-poster-400.webp 400w, /images/cafe/gallery/time-with-friends-poster-800.webp 800w',
    },
  },
  {
    // A group sharing a table: room for shared visits.
    id: 'a-place-to-gather',
    label: 'A place to gather',
    alt: 'Friends sharing tea around a granite table at Garden Cafe, lanterns and a palm overhead',
    // A still photograph (the only one in the gallery). The supplied photo
    // (a-place-to-gathe.png — a 4096×3072 JPEG) cropped to 4:5 around the
    // friends at the table (x from 512), WebP q80.
    src: '/images/cafe/gallery/a-place-to-gather-800.webp',
    srcSet:
      '/images/cafe/gallery/a-place-to-gather-400.webp 400w, /images/cafe/gallery/a-place-to-gather-800.webp 800w',
  },
  {
    // The real plants and the garden around the tables.
    id: 'surrounded-by-greenery',
    label: 'Surrounded by greenery',
    alt: 'Plants and greenery around the tables at Garden Cafe',
    src: null,
    // The supplied clip (surrounded-by-greenery..mp4, 10.8s portrait
    // 1080×1920, 28 MB): its first 10 seconds at 30fps, 720×1280 H.264, no
    // sound (1.2 MB). Poster: its first frame.
    video: {
      src: '/images/cafe/gallery/surrounded-by-greenery.mp4',
      poster: '/images/cafe/gallery/surrounded-by-greenery-poster-800.webp',
      posterSrcSet:
        '/images/cafe/gallery/surrounded-by-greenery-poster-400.webp 400w, /images/cafe/gallery/surrounded-by-greenery-poster-800.webp 800w',
    },
  },
  {
    // The cafe's own evening light — a photograph of the actual cafe.
    id: 'the-cafe-after-sunset',
    label: 'The cafe after sunset',
    alt: 'Garden Cafe in the evening, after sunset',
    src: null,
    // The supplied clip (the-cafe-after-sunset.mp4, 12.2s, 31 MB): its first
    // 10 seconds, 1280×720 H.264, no sound (1.2 MB). Poster: its first frame.
    video: {
      src: '/images/cafe/gallery/the-cafe-after-sunset.mp4',
      poster: '/images/cafe/gallery/the-cafe-after-sunset-poster-800.webp',
      posterSrcSet:
        '/images/cafe/gallery/the-cafe-after-sunset-poster-400.webp 400w, /images/cafe/gallery/the-cafe-after-sunset-poster-800.webp 800w',
    },
  },
]
