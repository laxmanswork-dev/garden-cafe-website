import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import Seo from '../../components/Seo/Seo'
import './NotFound.css'

export default function NotFound() {
  return (
    <PageTransition>
      <Seo title="Page not found" noIndex />

      <div className="not-found container">
        <p className="eyebrow text-muted">404</p>
        <h1 className="display-md">This page doesn’t exist.</h1>
        <Button to="/" variant="secondary">
          Back to the homepage
        </Button>
      </div>
    </PageTransition>
  )
}
