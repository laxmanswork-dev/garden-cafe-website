/**
 * Opening hours: display and an open/closed status worked out from the
 * cafe's published schedule (data/cafeData.js). The status is arithmetic
 * on the clock, never a live signal from the cafe.
 */

/** '05:30' → 330 (minutes after midnight). */
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** '05:30' → '5:30 AM', '23:00' → '11:00 PM'. */
export function formatTime(hhmm) {
  const minutes = toMinutes(hhmm)
  const h = Math.floor(minutes / 60) % 24
  const m = String(minutes % 60).padStart(2, '0')
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`
}

/**
 * Whether a schedule entry is open at a moment of the day: from `opens`
 * up to, not including, `closes`. A closing time before the opening time
 * runs past midnight.
 *
 * @param {number} minutes  minutes after midnight, 0–1439
 * @param {{ opens: string, closes: string }} entry
 */
export function isOpenAt(minutes, { opens, closes }) {
  const start = toMinutes(opens)
  const end = toMinutes(closes)
  return start <= end ? minutes >= start && minutes < end : minutes >= start || minutes < end
}

/**
 * Minutes after midnight right now in `timeZone` (the cafe's clock, so the
 * status is right wherever the visitor is).
 *
 * @param {string} timeZone  IANA name, e.g. 'Asia/Kolkata'
 * @param {Date} [date]
 */
export function minutesNow(timeZone, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type) => Number(parts.find((part) => part.type === type).value)
  return get('hour') * 60 + get('minute')
}
