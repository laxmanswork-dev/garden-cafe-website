import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { seo as defaults } from '../../data/cafeData'
import { seoTags } from '../../utils/seoTags'

/**
 * Per-page document metadata. Render exactly one <Seo> per page.
 *
 * The tags themselves come from utils/seoTags, which the build also uses to
 * write them into each page's HTML file (vite.config.js). Those static
 * copies are removed in main.jsx before React renders, so the page never
 * carries two sets.
 *
 * @param {object} props
 * @param {string} [props.title]        page title; site name is appended
 * @param {string} [props.description]
 * @param {string} [props.path]         canonical path; defaults to current route
 * @param {{ src: string, width: number, height: number, alt: string }} [props.image]
 * @param {'website' | 'article'} [props.type]
 * @param {boolean} [props.noIndex]     force noindex for this page
 * @param {boolean} [props.absoluteTitle]  use `title` exactly, without the site name
 */
export default function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex,
  absoluteTitle = false,
}) {
  const { pathname } = useLocation()

  const tags = seoTags({
    title: title && !absoluteTitle ? defaults.titleTemplate.replace('%s', title) : title,
    description,
    path: path ?? pathname,
    image,
    type,
    noIndex,
  })

  return (
    <Helmet>
      <title>{tags.title}</title>
      {tags.meta.map((attributes) => (
        <meta key={attributes.name ?? attributes.property} {...attributes} />
      ))}
      {tags.links.map((attributes) => (
        <link key={attributes.rel} {...attributes} />
      ))}
    </Helmet>
  )
}
