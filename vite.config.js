import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seo } from './src/data/cafeData.js'
import { pageMeta } from './src/data/pageMeta.js'
import { seoTags } from './src/utils/seoTags.js'
import { cafeStructuredData } from './src/utils/structuredData.js'

/*
 * Menu photographs: which of public/images/menu/<dish>.* exist.
 *
 * Exposed as `virtual:menu-images` — a map from each photograph's path
 * without its extension ('/images/menu/idli') to the file that is
 * really there ('/images/menu/idli.png', or .jpg/.webp/…). The
 * menu shows a photograph only when its file exists, so missing ones never
 * cost a failed request; dropping a file into its folder is all it takes
 * (the dev server reloads when files are added, replaced or removed).
 *
 * Its `webCopies` export maps a photograph's file to the small WebP copies
 * the page loads instead (public/images/menu/web/page/<slug>-480.webp and
 * -960.webp; <slug> is the file name lower-cased, other characters as '-').
 * A copy older than its photograph is ignored, with a warning, so a
 * replaced photo is never shown stale: the page falls back to the original
 * until the copies are remade, e.g. with ffmpeg:
 *   ffmpeg -i idli.png -vf "scale='min(960,iw)':-2" -quality 80 web/page/idli-960.webp
 */
const MENU_DIR = path.resolve('public/images/menu')
const MENU_IMAGE = /\.(jpe?g|png|webp|avif)$/i
const VIRTUAL_ID = 'virtual:menu-images'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const WEB_DIR = path.join(MENU_DIR, 'web')
const COPIES_DIR = path.join(WEB_DIR, 'page')
const COPY_WIDTHS = [480, 960]

const toUrl = (file) => `/${path.relative('public', file).split(path.sep).join('/')}`

const webSlug = (file) =>
  path
    .basename(file)
    .replace(MENU_IMAGE, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** [photograph url, [480 url, 960 url]] for each photograph with fresh copies. */
function listWebCopies(files, warn) {
  return files.flatMap((file) => {
    if (file.startsWith(WEB_DIR)) return []
    const copies = COPY_WIDTHS.map((w) => path.join(COPIES_DIR, `${webSlug(file)}-${w}.webp`))
    if (!copies.every((copy) => fs.existsSync(copy))) return []
    const photoTime = fs.statSync(file).mtimeMs
    if (copies.some((copy) => fs.statSync(copy).mtimeMs < photoTime)) {
      warn(
        `${toUrl(file)} is newer than its WebP copies; the menu shows it as-is until they are remade`,
      )
      return []
    }
    return [[toUrl(file), copies.map(toUrl)]]
  })
}

function listMenuImages(dir = MENU_DIR) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMenuImages(full)
    return MENU_IMAGE.test(entry.name) ? [full] : []
  })
}

function menuImages() {
  return {
    name: 'garden-cafe-menu-images',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    load(id) {
      if (id !== RESOLVED_ID) return null
      const files = listMenuImages()
      const entries = files.map((file) => [toUrl(file).replace(MENU_IMAGE, ''), toUrl(file)])
      const copies = listWebCopies(files, (message) => this.warn(message))
      return (
        `export default new Map(${JSON.stringify(entries)})\n` +
        `export const webCopies = new Map(${JSON.stringify(copies)})`
      )
    },
    configureServer(server) {
      server.watcher.add(MENU_DIR)
      const refresh = (file) => {
        if (!file.startsWith(MENU_DIR) || !MENU_IMAGE.test(file)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('change', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}

/*
 * Page heads in the HTML files.
 *
 * The site renders in the browser, so the built index.html has no title or
 * description of its own: link previews (WhatsApp, Facebook, X) and crawlers
 * that do not run JavaScript would see none. After the build this writes
 * each real page's tags (data/pageMeta.js through utils/seoTags.js — the
 * same ones components/Seo renders) into its own file:
 *
 *   index.html       /
 *   menu.html        /menu        (Cloudflare Pages serves it without .html)
 *   our-story.html   /our-story
 *   404.html         any other address, with a real 404 status — on Pages,
 *                    its presence also turns off the fallback that answered
 *                    every unknown address with the homepage and a 200
 *
 * Every file is the same app; the tags carry data-static-seo, and main.jsx
 * removes them before React writes its own, so a page never has two sets.
 *
 * The homepage also gets the cafe's structured data (utils/structuredData.js)
 * as one JSON-LD block. It lives only here — React does not render it — so
 * it is not marked for removal and there is never a second copy.
 */
const PAGE_FILES = [
  ['index.html', pageMeta.home, { structuredData: true }],
  ['menu.html', pageMeta.menu],
  ['our-story.html', pageMeta.story],
  ['404.html', pageMeta.notFound],
]

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const toAttributes = (attributes) =>
  Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ')

// JSON-LD inside a <script>: escape '<' so no value can close the tag.
const jsonLd = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c')

function staticHead(page, { structuredData = false } = {}) {
  const { title, meta, links } = seoTags({ ...page, path: page.path ?? '/404' })
  return [
    `<title data-static-seo>${escapeHtml(title)}</title>`,
    ...meta.map((attributes) => `<meta data-static-seo ${toAttributes(attributes)} />`),
    ...links.map((attributes) => `<link data-static-seo ${toAttributes(attributes)} />`),
    ...(structuredData
      ? [`<script type="application/ld+json">\n${jsonLd(cafeStructuredData())}\n    </script>`]
      : []),
  ]
    .map((tag) => `    ${tag}`)
    .join('\n')
}

/*
 * sitemap.xml and the robots.txt Sitemap line — written only at launch, when
 * the production domain is set AND indexing is switched on (seo.siteUrl and
 * seo.allowIndexing in data/cafeData.js). Before that the build contains no
 * sitemap and no absolute URL at all. Lists every page with a path that is
 * not kept out of search results: /, /menu, /our-story.
 */
function writeSitemap(outDir) {
  if (!seo.siteUrl || !seo.allowIndexing) return
  const urls = Object.values(pageMeta)
    .filter((page) => page.path && !page.noIndex)
    .map((page) => `  <url><loc>${escapeHtml(new URL(page.path, seo.siteUrl).href)}</loc></url>`)
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  )
  const robots = path.join(outDir, 'robots.txt')
  fs.appendFileSync(robots, `\nSitemap: ${new URL('/sitemap.xml', seo.siteUrl).href}\n`)
}

function pageHeads() {
  let outDir
  return {
    name: 'garden-cafe-page-heads',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    writeBundle() {
      const shell = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      if (!shell.includes('</head>')) throw new Error('page heads: no </head> in index.html')
      for (const [file, page, options] of PAGE_FILES) {
        const html = shell.replace('</head>', `${staticHead(page, options)}\n  </head>`)
        fs.writeFileSync(path.join(outDir, file), html)
      }
      writeSitemap(outDir)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), menuImages(), pageHeads()],
  css: {
    // Inline (empty) PostCSS config: stops Vite searching parent directories
    // for a postcss.config.js, so no external setup (e.g. Tailwind) can leak
    // into this project. All CSS here is handcrafted.
    postcss: {},
  },
})
