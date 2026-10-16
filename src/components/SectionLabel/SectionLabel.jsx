import { cn } from '../../utils/cn'
import './SectionLabel.css'

const formatIndex = (index) => String(index).padStart(2, '0')

/**
 * Editorial chapter marker, e.g. "02 — The Place".
 * Not a heading: it sits above the section's real <h2>.
 *
 * @param {object} props
 * @param {number | string} [props.index]  chapter number, zero-padded
 * @param {'p' | 'span' | 'div'} [props.as]
 */
export default function SectionLabel({ index, as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cn('section-label', 'eyebrow', className)} {...rest}>
      {index !== undefined && (
        <span className="section-label__index text-tabular">{formatIndex(index)}</span>
      )}
      {index !== undefined && <span className="section-label__rule" aria-hidden="true" />}
      <span className="section-label__text">{children}</span>
    </Tag>
  )
}
