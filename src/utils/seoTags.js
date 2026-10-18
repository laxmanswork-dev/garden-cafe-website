import { seo as defaults } from '../data/cafeData.js'

const absoluteUrl = (path) => (defaults.siteUrl ? new URL(path, defaults.siteUrl).href : null)

/*
 * Canonical URLs. Each real page passes its own clean path (data/pageMeta.js),
 * never the address it was reached by, so variants share one canonical:
 * '/?category=tea#food-drinks' (a Food & Drinks tab) is '/', and the
 * trailing-slash and .html forms are redirected by Cloudflare Pages anyway.
 * Pages kept out of search results (404) get none: they are not the
 * preferred version of anything.
 */

/**
 * A page's document metadata as plain data: its title, and its <meta> and
 * <link> tags in order. One definition for both places that write them —
 * components/Seo in the browser and the build's static HTML files
 * (vite.config.js) — so the two can never disagree.
 *
 * Tags that need facts we do not have yet (canonical URL, og:url, og:image,
 * locale, twitter:site) are left out rather than faked; they appear once the
 * PLACEHOLDER values in data/cafeData.js are set.
 *
 * @param {object} page
 * @param {string} [page.title]        exact title; the site's default if absent
 * @param {string} [page.description]
 * @param {string} page.path           canonical path
 * @param {{ src: string, width: number, height: number, alt: string }} [page.image]
 * @param {'website' | 'article'} [page.type]
 * @param {boolean} [page.noIndex]
 * @returns {{ title: string, meta: Record<string, string>[], links: Record<string, string>[] }}
 */
export function seoTags({ title, description, path, image, type = 'website', noIndex }) {
  const fullTitle = title ?? defaults.defaultTitle
  const metaDescription = description ?? defaults.defaultDescription
  const canonical = noIndex ? null : absoluteUrl(path)
  const ogImage = image ?? defaults.defaultImage
  const ogImageUrl = ogImage ? absoluteUrl(ogImage.src) : null
  const robots = noIndex || !defaults.allowIndexing ? 'noindex, nofollow' : 'index, follow'

  const meta = [
    { name: 'description', content: metaDescription },
    { name: 'robots', content: robots },
    { name: 'theme-color', content: defaults.themeColor },

    // Open Graph
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: defaults.siteName },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: metaDescription },
    canonical && { property: 'og:url', content: canonical },
    defaults.locale && { property: 'og:locale', content: defaults.locale },
    ogImageUrl && { property: 'og:image', content: ogImageUrl },
    ogImageUrl && { property: 'og:image:width', content: String(ogImage.width) },
    ogImageUrl && { property: 'og:image:height', content: String(ogImage.height) },
    ogImageUrl && { property: 'og:image:alt', content: ogImage.alt },

    // Twitter / X
    { name: 'twitter:card', content: ogImageUrl ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: metaDescription },
    ogImageUrl && { name: 'twitter:image', content: ogImageUrl },
    ogImageUrl && { name: 'twitter:image:alt', content: ogImage.alt },
    defaults.twitterHandle && { name: 'twitter:site', content: defaults.twitterHandle },
  ].filter(Boolean)

  const links = canonical ? [{ rel: 'canonical', href: canonical }] : []

  return { title: fullTitle, meta, links }
}
