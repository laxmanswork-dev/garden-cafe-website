/**
 * Our Story page (/our-story) — APPROVED CONTENT. Reproduce exactly; do not
 * rewrite, extend or "improve" it. No names, places, dates or milestones
 * beyond these words.
 *
 * Text-led: no cafe photographs. The one image is the owners’ photograph,
 * not supplied yet — see ownerPhoto below.
 */

export const story = {
  label: 'Our Story',
  headline: ['A dream that found its place.'],
  paragraphs: [
    'Before Garden Cafe, we spent years working abroad, learning new things and dreaming of building something of our own.',
    'Over time, that dream became something we wanted to bring closer to home. We imagined a place where people could enjoy good food, fresh air and the simple joy of spending time together.',
    'With that hope, we began Garden Cafe. It took hard work, courage and a dream we shared.',
    'What started as a dream between the two of us has become a place where others can make memories of their own.',
  ],
  closing: 'We’re glad you’re here.',
  cta: { label: 'Visit Garden Cafe', to: '/#visit' },
}

/**
 * The owners' photograph, cropped to 4:5 from _source-assets/public/images/
 * story/owner.png. Set to null to show the empty placeholder instead.
 * Never a stand-in photograph.
 */
export const ownerPhoto = {
  src: '/images/story/owners-868.webp',
  srcSet: '/images/story/owners-480.webp 480w, /images/story/owners-868.webp 868w',
  width: 868,
  height: 1085,
  alt: 'The two owners of Garden Cafe standing together at the cafe',
}
