/**
 * Homepage copy — APPROVED CONTENT. Reproduce exactly; do not rewrite,
 * extend or "improve" it. Line arrays are the approved line breaks for
 * headlines on wide screens.
 *
 * Business facts (address, hours, menu, prices…) do not live here; they
 * come from cafeData.js / menuData.js.
 */

export const hero = {
  eyebrow: 'GARDEN CAFE · OPEN-AIR CAFE',
  headline: ['A warm cup, fresh air,', 'and time to just be.'],
  primaryCta: { label: 'Our story', to: '/our-story' },
  menuCta: { label: 'View menu', to: '/#food-drinks' }, // same destination as the navbar's Menu
  secondaryCta: { label: 'Watch our story' }, // shown only when cafe.links.storyVideo exists
}

export const place = {
  id: 'the-place',
  index: 2,
  label: 'The Cafe',
  headline: ['Some places make', 'you want to stay.'],
  points: [
    { title: 'Open air', text: 'Fresh air, greenery and room to settle in.' },
    { title: 'Good food', text: 'Familiar favourites and something new to try.' },
    { title: 'Stay a little longer', text: 'Come for a quick coffee, or take your time.' },
    {
      title: 'As evening falls',
      text: 'The same space takes on a different feeling as evening arrives.',
    },
  ],
}

export const gallery = {
  id: 'gallery',
  index: 3,
  label: 'The Gallery',
  headline: 'A little more of the place we call ours.',
}

export const food = {
  id: 'food-drinks',
  index: 4,
  label: 'Food & Drinks',
  // One line, left to wrap (balanced).
  headline: ['South Indian favourites, snacks and refreshing drinks.'],
  cta: { label: 'View the complete menu', to: '/menu' },
}

export const day = {
  id: 'through-the-day',
  index: 5,
  label: 'Through the Day',
  headline: ['The same place.', 'A different feeling.'],
  parts: [
    {
      id: 'morning',
      title: 'Morning',
      text: 'A quieter start, fresh air and something good to begin the day.',
    },
    {
      id: 'afternoon',
      title: 'Afternoon',
      text: 'Good food, easy conversations and time to slow down.',
    },
    {
      id: 'evening',
      title: 'Evening',
      text: 'Warm lights, open air and a reason to stay a little longer.',
    },
  ],
}

export const moments = {
  id: 'moments',
  index: 6,
  label: 'Made for Moments',
  headline: ['Bring your people.', 'Create memories.'],
  body: 'Come together for a meal, a conversation, a celebration or simply another good day.',
  occasions: [
    { title: 'Friends', text: 'Good food. Better conversations.' },
    { title: 'Families', text: 'Meals that bring everyone together.' },
    { title: 'Celebrations', text: 'Big moments feel better here.' },
    { title: 'Work meetups', text: 'A relaxed place for ideas and conversations.' },
  ],
}

export const visit = {
  id: 'visit',
  index: 5,
  label: 'Visit Us',
  headline: ['A table outdoors,', 'a slower kind of day.'],
  groups: {
    location: { title: 'Location', placeholder: '[Real address will be added]' },
    hours: {
      title: 'Opening hours',
      placeholder: '[Real hours will be added]',
      // Worked out from the hours above, not from the cafe itself.
      open: 'Open now',
      closed: 'Closed now',
    },
    contact: { title: 'Contact', placeholder: '[Real contact will be added]' },
  },
  actions: {
    directions: 'Get directions',
    call: 'Call now',
    reserve: 'Reserve a table',
  },
  mapTitle: 'Map showing The Garden Cafe, North Kundal, Kanniyakumari',
}

export const footer = {
  brand: 'Garden Cafe',
  place: 'Otthapuli, Kanyakumari',
  legal: { privacy: 'Privacy Policy', terms: 'Terms & Conditions' },
}
