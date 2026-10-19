# Garden Cafe

The website for Garden Cafe: a handcrafted React site in an editorial, architectural and calm style.

**Direction:** Editorial minimalism × natural character × quiet luxury.

---

## Technology

| Concern          | Choice                          |
| ---------------- | ------------------------------- |
| UI               | React 19 (JavaScript / JSX)     |
| Build            | Vite                            |
| Routing          | React Router DOM                |
| Motion           | Framer Motion (`LazyMotion`)    |
| Smooth scrolling | Lenis                           |
| Icons            | Lucide React                    |
| Metadata / SEO   | React Helmet Async              |
| Class names      | clsx (via `utils/cn.js`)        |
| Styling          | Handcrafted CSS + design tokens |
| Quality          | ESLint, Prettier, EditorConfig  |

There is deliberately **no** Tailwind, Bootstrap, component library, GSAP or Three.js.

## Commands

Requires Node 20.19+.

```bash
npm install          # install dependencies
npm run dev          # development server
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier — write
npm run format:check # Prettier — check only
```

In development, **`/_system`** shows the design system reference: colour, type scale, buttons, grid and motion. It is excluded from production builds.

## Structure

```
public/
  favicon.svg            temporary mark, to be replaced with the final identity
  robots.txt
  fonts/                 self-hosted WOFF2 files (see "Fonts")
  images/{cafe,food,gallery}/   real Garden Cafe photography only

src/
  main.jsx               entry: global styles, providers, router
  App.jsx                app shell: skip link, navbar, routes, page transitions

  components/            reusable building blocks (Component.jsx + Component.css)
    Navbar/              logo, links, reservation CTA, mobile menu, scroll states
    Button/              primary · secondary · text · icon; Link / <a> / <button>
    SectionLabel/        "02 — The Place" chapter marker
    MagneticButton/      pointer-following wrapper (fine pointers only)
    ScrollReveal/        in-view reveals: fade-up, fade, mask, image, stagger groups
    PageTransition/      route fade + scroll reset
    ResponsiveImage/     srcset/sizes, lazy/eager, reserved aspect ratio
    Seo/                 title, description, canonical, Open Graph, Twitter, theme colour
    MotionProvider/      LazyMotion + MotionConfig (reduced motion honoured)
    SmoothScroll/        Lenis lifecycle + scroll controller context

  sections/              homepage chapters, built one at a time
    Hero/ ThePlace/ TheSpace/ FoodDrinks/ ThroughTheDay/
    Moments/ Gallery/ Visit/ Footer/

  pages/
    Home/                composes the sections
    NotFound/
    DesignSystem/        dev-only reference (/_system)

  data/                  content, never hard-coded in JSX
    homeContent.js       APPROVED homepage copy — reproduce exactly, never rewrite
    cafeData.js          business info, CTA destinations, navigation, SEO
    menuData.js          menu schema (empty until the real menu is supplied)
    galleryData.js       gallery schema (empty until photography is supplied)

  hooks/
    useLenis.js          Lenis setup + scroll controller (native fallback)
    useMediaQuery.js     useSyncExternalStore-based media queries
    useScrollProgress.js scroll progress as a MotionValue (no re-renders)
    useScrolledPast.js   boolean threshold for navbar state
    useRouteScroll.js    hash navigation, focus management, route scroll reset

  utils/
    cn.js                class name composition
    motion.js            easing, durations, springs, reveal variants
    breakpoints.js       JS mirror of the CSS breakpoints
    image.js             image path/srcset conventions, createImage()

  styles/                imported once, in this order, by main.jsx
    variables.css        design tokens: the single source of truth
    reset.css
    typography.css       font-face slots + type classes
    global.css           document, focus, skip link, selection
    utilities.css        container, section, grid, surfaces, a11y helpers
    responsive.css       breakpoint tiers (grid columns, span tiers)
    animations.css       motion principles + reduced-motion overrides
```

## Design system

### Colour

The palette is mostly neutral: warm grey, stone, soft cream and charcoal, with a restrained moss accent. The photography supplies the natural colour. All colours are tokens in `variables.css`. Never write a hex value in a component.

Use **surfaces** (`.surface-paper`, `.surface-stone`, `.surface-ink`) to set a section's background. They remap the text, muted text, line and focus-ring tokens, so components inside read correctly with no extra work.

> **Contrast note:** the approved `--color-text-muted` measures 4.01:1 on `--color-stone`, below WCAG AA (4.5:1). `.surface-stone` therefore switches muted text to `--color-text-muted-on-stone` (4.80:1). `--color-moss` is also below AA on stone (4.09:1). Use it for large type or accents there, not body text. On paper, every text colour passes AA.

### Typography

- **Display:** Cormorant Garamond (`--font-display`)
- **Body/UI:** Inter (`--font-body`)

Classes: `display-xl` · `display-lg` · `display-md` · `heading-xl` · `heading-lg` · `heading-md` · `body-lg` · `body` · `body-sm` · `eyebrow` · `label` · `caption`.

All sizes are fluid `clamp()` values, interpolated from a 375px to a 1440px viewport. The visual class is independent of the heading level: choose `<h2>` for the document outline and `.display-lg` for the look.

#### Fonts

Self-hosted in `public/fonts/` (Latin subset WOFF2, SIL Open Font License; the licences sit next to the files). No third-party font requests are made. The hero-critical files (Cormorant 300 and Inter variable) are preloaded in `index.html`.

### Layout and grid

- Tokens: `--page-padding`, `--content-width` (1440), `--section-spacing`, `--grid-gap`
- `.container`: centred column with fluid padding; override the width with `--container-max`
- `.section`: vertical rhythm between chapters
- `.grid` + `.col`: **4 / 8 / 12 columns** (mobile / ≥768 / ≥1024). Children place themselves with custom properties, which makes asymmetric compositions easy:

```jsx
<div className="grid">
  <div className="col" style={{ '--span-md': 5, '--span-lg': 7, '--start-lg': 2 }} />
  <div className="col" style={{ '--span-md': 3, '--span-lg': 3, '--start-lg': 10 }} />
</div>
```

Breakpoints: 600 · 768 · 1024 · 1280 · 1440 (in `em`, mirrored in `utils/breakpoints.js`). Design reference: 1440 × 900. Verified without horizontal overflow at 1920, 1440, 1280, 1024, 768, 600, 480, 390 and 375.

### Motion

Motion is **subtle, slow, physical and intentional**.

- One easing curve, `--ease-standard` (`cubic-bezier(0.22, 1, 0.36, 1)`), and three durations: `--duration-fast` / `-normal` / `-slow`. These are mirrored in `utils/motion.js`.
- Animate `transform` and `opacity` only.
- Use `<ScrollReveal>` (`fade-up`, `fade`, `mask`, `image`) and `<ScrollRevealGroup>` / `<ScrollRevealItem>` for staggers. Don't hand-roll one-off animations.
- **Reduced motion:** Lenis is not started, Framer transforms resolve instantly (only opacity fades), and CSS transitions collapse. This follows the OS preference live.

### Smooth scrolling

Lenis smooths **wheel input only**. Touch, keyboard, scrollbar, find-in-page and focus scrolling stay native. Always scroll through the controller:

```js
const scroll = useLenis()
scroll.scrollTo('#visit') // Lenis when running, native otherwise
scroll.lock() / scroll.unlock() // e.g. for overlays
```

Add `data-lenis-prevent` to any nested scrollable area.

### Images

Use real Garden Cafe photography only. Export each photo at 640/960/1280/1920 widths (`name-640.webp` …), describe it once with `createImage()` in a data file, and render it with `<ResponsiveImage>`. Space is always reserved, so there is no layout shift. Images are lazy by default; pass `priority` for the hero only.

**Menu photographs** (`public/images/menu/<dish>.png`) are masters; the menu loads 480/960px WebP copies from `public/images/menu/web/page/` instead. A copy older than its master is ignored (the master is shown, with a build warning), so after replacing a photo, remake its two copies (see the comment in `vite.config.js`). **The Cafe's photographs** load `public/images/cafe/place/*.webp`; after replacing one, remake its `.webp` and update its pixel size in `ThePlace.jsx`.

**Unused source material** (raw video drafts, PNG masters, drafts) lives in `_source-assets/`, outside the site and Git. Its `MOVED-FROM-PUBLIC.txt` lists each file's original path.

### SEO

Each page renders exactly one `<Seo>`. Approved titles and descriptions live in `src/data/pageMeta.js`; defaults in `seo` in `cafeData.js`. The tags are built once (`src/utils/seoTags.js`) and written twice: by `<Seo>` in the browser, and by the build into each page's HTML file (`index.html`, `menu.html`, `our-story.html`, `404.html` — `pageHeads` in `vite.config.js`) for link previews and crawlers that don't run JavaScript. `main.jsx` removes the static copies before React renders, so a page never has two sets.

The homepage also carries one `CafeOrCoffeeShop` JSON-LD block (`src/utils/structuredData.js`), from the confirmed business details only.

The production origin is `seo.siteUrl` (`https://gardencafekanyakumari.com`). From it the build writes canonical URLs, `og:url`, the café's `url` and `WebSite` entry, `sitemap.xml` (`/`, `/menu`, `/our-story`) and the robots.txt `Sitemap:` line. `og:image` is omitted until `seo.defaultImage` is supplied. **Indexing is still disabled** (`allowIndexing: false`): every page says `noindex, nofollow` until the launch checks below pass.

### Accessibility

- Skip link, landmark structure, one `<h1>` per page
- Visible `:focus-visible` rings that follow the surface colour
- Mobile menu: `aria-expanded`/`aria-controls`, focus moved in and trapped, Escape closes and returns focus, background scroll locked, panel `inert` when closed
- Hash navigation moves focus to the target section
- 44px minimum tap targets; `alt` required on every image
- Reduced motion honoured throughout

## Content placeholders

Business information that has **not** been supplied (address, phone, email, opening hours, menu, prices, photography, meta description, domain, reservation method) is left `null` or empty and marked `PLACEHOLDER`. Components must render nothing for a missing value, never an invented one.

```bash
grep -rn "PLACEHOLDER" src
```

## Development rules

1. No generic restaurant template layouts, and no repeated section layouts.
2. No excessive cards, rounded corners, shadows or gradients. No glassmorphism.
3. No stock or AI-generated photography. No AI-sounding marketing copy.
4. No invented business information.
5. No random colours, type sizes or spacing. Use tokens only.
6. No excessive animation. Use the motion system only.
7. No UI frameworks, component libraries or unnecessary dependencies.
8. The approved section headings in `cafeData.js` are final copy. Don't rewrite them.
9. Semantic HTML first. Never make a clickable `<div>`.
10. Keep one visual system consistent from the hero through the footer.

## Deployment (Cloudflare)

- Build command `npm run build`, output directory `dist`, Node 20.19 or later.
- The Cloudflare project is a Worker serving static files: deploy command `npx wrangler deploy`, configured by `wrangler.jsonc` (assets from `dist`, no Worker code). Keep that file — without it `wrangler deploy` tries to set the project up itself by parsing `vite.config.js`, and fails. The `name` in it must match the Worker's name in the dashboard. (`dist` also works unchanged as a Cloudflare Pages site with no deploy command.)
- No redirect file is needed. The build writes `menu.html` and `our-story.html` (served at `/menu` and `/our-story`; the `/` and `.html` forms redirect there) and a top-level `404.html`, so unknown addresses get a real 404 status instead of the homepage (`not_found_handling: "404-page"`). Every real route is a file, so a refresh always works. When adding a page, add it to `pageMeta.js` and `PAGE_FILES` in `vite.config.js`.
- Pages rejects files over 25 MiB; keep large originals in `_source-assets/`.
- **Before switching indexing on**: confirm the deployed site serves `https://gardencafekanyakumari.com/sitemap.xml` and shows the canonical tags; in Cloudflare, enable _Always Use HTTPS_ and 301-redirect `www.gardencafekanyakumari.com` (and any `*.workers.dev`/`*.pages.dev` host) to `https://gardencafekanyakumari.com`. Then set `seo.allowIndexing: true` in `cafeData.js`, rebuild and deploy (every page switches to `index, follow`), and resubmit the sitemap in Google Search Console. Optionally supply `seo.defaultImage` (1200 × 630) for link previews.

## Environment note

`vite.config.js` sets an inline, empty PostCSS config. Vite would otherwise search parent directories for a `postcss.config.js`, and a Tailwind config in a parent folder on this machine was breaking the build. Keep the inline config.
