import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

// Global styles load before any component CSS (imported through App), so
// the cascade is always: tokens → reset → type → global → utilities →
// responsive → motion → components.
import 'lenis/dist/lenis.css'
import './styles/variables.css'
import './styles/reset.css'
import './styles/typography.css'
import './styles/global.css'
import './styles/utilities.css'
import './styles/responsive.css'
import './styles/animations.css'

import App from './App'

// Each page's HTML file carries its title and meta tags for link previews
// and crawlers that do not run JavaScript (written by the build, see
// vite.config.js). From here on components/Seo owns them: React adds tags
// but never removes ones it did not create, so the static copies go first.
document.querySelectorAll('[data-static-seo]').forEach((tag) => tag.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
