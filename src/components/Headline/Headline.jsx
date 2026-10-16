import { Fragment } from 'react'
import ScrollReveal from '../ScrollReveal/ScrollReveal'
import { cn } from '../../utils/cn'
import './Headline.css'

/**
 * Chapter headline — the approved lines, each revealed from behind a mask.
 * Lines are the approved breaks; a line may still wrap on narrow screens.
 *
 * @param {object} props
 * @param {string[]} props.lines
 * @param {'h1' | 'h2' | 'h3'} [props.as]
 * @param {'display-lg' | 'display-md' | 'heading-xl'} [props.size]
 * @param {string} [props.id]
 * @param {'mask' | 'fade-up'} [props.reveal]  'fade-up': each line rises
 *   gently into view instead of from behind its mask
 */
export default function Headline({
  lines,
  as: Tag = 'h2',
  size = 'display-md',
  id,
  reveal = 'mask',
  className,
}) {
  return (
    <Tag id={id} className={cn('headline', size, className)}>
      {lines.map((line, index) => (
        <Fragment key={line}>
          {/* A real space between lines, so the heading reads (and copies)
              as one sentence; flex layout ignores it visually. */}
          {index > 0 && ' '}
          <ScrollReveal as="span" variant={reveal} delay={index * 0.09} className="headline__line">
            {/* Same inner box as the mask's, so the lines set identically. */}
            {reveal === 'mask' ? line : <span className="scroll-reveal__inner">{line}</span>}
          </ScrollReveal>
        </Fragment>
      ))}
    </Tag>
  )
}
