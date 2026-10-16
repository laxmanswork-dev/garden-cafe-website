import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), menuImages()],
  css: {
    // Inline (empty) PostCSS config: stops Vite searching parent directories
    // for a postcss.config.js, so no external setup (e.g. Tailwind) can leak
    // into this project. All CSS here is handcrafted.
    postcss: {},
  },
})
