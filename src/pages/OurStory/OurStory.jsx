import { ArrowRight } from 'lucide-react'
import Button from '../../components/Button/Button'
import Headline from '../../components/Headline/Headline'
import PageTransition from '../../components/PageTransition/PageTransition'
import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import SectionLabel from '../../components/SectionLabel/SectionLabel'
import Seo from '../../components/Seo/Seo'
import { pageMeta } from '../../data/pageMeta'
import { ownerPhoto, story } from '../../data/storyContent'
import './OurStory.css'

/**
 * /our-story — how Garden Cafe began, in the owners' own words
 * (data/storyContent.js). Text-led: an opening (label, heading), the four
 * paragraphs as one narrative beside the owners' photograph, and a quiet
 * close — one line and the way to visit.
 */
export default function OurStory() {
  return (
    <PageTransition>
      <Seo {...pageMeta.story} absoluteTitle />

      <div className="story-page container">
        <header className="story-opening">
          <ScrollReveal>
            <SectionLabel>{story.label}</SectionLabel>
          </ScrollReveal>
          <Headline
            as="h1"
            lines={story.headline}
            reveal="fade-up"
            className="story-opening__title"
          />
        </header>

        <div className="story-body">
          <ScrollReveal className="story-body__text">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ScrollReveal>

          {/* Owner photograph placeholder — the two owners together, to be
              supplied (ownerPhoto in data/storyContent.js). Fixed 4:5 box, so
              the photo drops in without moving the layout. */}
          <ScrollReveal variant="image" className="story-body__photo">
            {ownerPhoto ? (
              <ResponsiveImage
                {...ownerPhoto}
                ratio="4 / 5"
                sizes="(min-width: 48em) 40vw, calc(100vw - 2.5rem)"
              />
            ) : (
              <div className="story-body__placeholder" aria-hidden="true" />
            )}
          </ScrollReveal>
        </div>

        <div className="story-closing">
          <ScrollReveal as="p" className="story-closing__line">
            {story.closing}
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <Button variant="primary" to={story.cta.to} iconEnd={<ArrowRight />}>
              {story.cta.label}
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  )
}
