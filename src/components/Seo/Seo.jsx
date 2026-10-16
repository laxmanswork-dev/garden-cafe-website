import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { seo as defaults } from '../../data/cafeData'

const absoluteUrl = (path) => (defaults.siteUrl ? new URL(path, defaults.siteUrl).href : null)

/**
 * Per-page document metadata. Render exactly one <Seo> per page.
 *
 * Tags that need facts we do not have yet (canonical URL, og:url, og:image,
 * locale, twitter:site) are omitted rather than faked; they appear
 * automatically once the PLACEHOLDER values in data/cafeData.js are set.
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

  const fullTitle = title
    ? absoluteTitle
      ? title
      : defaults.titleTemplate.replace('%s', title)
    : defaults.defaultTitle
  const metaDescription = description ?? defaults.defaultDescription
  const canonical = absoluteUrl(path ?? pathname)
  const ogImage = image ?? defaults.defaultImage
  const ogImageUrl = ogImage ? absoluteUrl(ogImage.src) : null
  const robots = noIndex || !defaults.allowIndexing ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={defaults.themeColor} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaults.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonical && <meta property="og:url" content={canonical} />}
      {defaults.locale && <meta property="og:locale" content={defaults.locale} />}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {ogImageUrl && <meta property="og:image:width" content={String(ogImage.width)} />}
      {ogImageUrl && <meta property="og:image:height" content={String(ogImage.height)} />}
      {ogImageUrl && <meta property="og:image:alt" content={ogImage.alt} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      {ogImageUrl && <meta name="twitter:image:alt" content={ogImage.alt} />}
      {defaults.twitterHandle && <meta name="twitter:site" content={defaults.twitterHandle} />}
    </Helmet>
  )
}
