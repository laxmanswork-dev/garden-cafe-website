/*
 * The "Garden" signature — one word, signed with a pen, not set in a font.
 *
 * Pen strokes in a 72 × 38 box (baseline y 32, the small letters ~6 units
 * tall), in the order a hand signs them:
 *   1. the capital G in one gesture — from the spur, round the bowl, up
 *      the back, then out into a loose loop over the word and down into
 *      the a;
 *   2. "arden", small and joined, heights left uneven; the n drops below
 *      the line and curls back under the word;
 *   3. a short, thinning run-out to the right — the pen leaving the paper.
 * Widths are screen pixels (the G firmest, the run-out finest); the
 * component slants the whole signature slightly.
 */

export const signature = {
  viewBox: '2 4 72 38',
  slant: 'translate(4 0) skewX(-8)',
  /** @type {[d: string, width: number][]} */
  strokes: [
    [
      'M15.4 26.4 C17 25.8 19 25.6 20.6 25.8 C21 28.6 19.6 32.4 14.4 32.8 C9.2 33.2 6.6 28.6 7 23.6 C7.4 18.4 10.4 13.8 15.2 11.2 C21 8 31.6 7 36.2 9.4 C39.8 11.4 37.4 15 31.4 16.4 C26.6 17.6 22.6 19.8 22.4 23.2 C22.3 24.8 23.4 25.9 25 26',
      1,
    ],
    [
      'M25 26 C26 25.8 26.8 25.8 27.4 26.2 C25.4 25.2 23.2 27 23.2 29.4 C23.2 31.6 25.6 32 26.8 29.8 C27.2 28.6 27.4 27.2 27.4 26.2 C27.4 28.4 27.4 31 28.8 31.8 C30.2 31 30.4 27.6 30.8 26 C31.6 26.6 32.6 26.6 33.6 25.8 C34.8 25.4 36.8 25.6 38.2 26.4 C36.2 25.6 34.6 27.8 34.8 30 C35 32.4 37.6 32.2 38.6 30 C39.2 26 39.2 20.6 39.8 17.4 C40 22 40 27.8 40.6 31 C41.4 32 43.2 30.4 44.2 28.8 C45 27.4 44.4 26 43.2 26.4 C41.8 26.8 41.6 30 42.8 31.4 C43.8 32.4 45.6 31.6 46.6 30.4 C47.2 29 47.4 27.4 47.6 26 C47.8 28 47.8 30.2 47.6 32 C48.2 29 49.6 25.8 51.2 26 C52.6 26.2 52.4 28.4 52.6 30.6 C52.8 33.4 50.6 35.6 46.4 36.4 C40.6 37.4 33.4 37.2 31.4 36.4 C30 35.8 32 34.8 36 34.8',
      0.9,
    ],
    ['M36 34.8 C45 34.6 56 34 68 33.4', 0.6],
  ],
}
