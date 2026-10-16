import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import './Button.css'

/**
 * Button — renders the right element for the job:
 *   to="/path"        → router <Link>   (internal navigation)
 *   href="https://…"  → <a>             (external; opens in a new tab)
 *   neither           → <button>        (actions)
 *
 * Variants: primary · secondary · text · icon
 * Sizes:    sm · md (default) · lg — every size meets the 44px tap target.
 *
 * Icons are passed as elements and hidden from assistive tech:
 *   <Button iconEnd={<ArrowUpRight />}>Directions</Button>
 * The `icon` variant has no visible text and therefore requires aria-label.
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'text' | 'icon'} [props.variant]
 * @param {'sm' | 'md' | 'lg'} [props.size]
 * @param {string} [props.to]
 * @param {string} [props.href]
 * @param {import('react').ReactNode} [props.iconStart]
 * @param {import('react').ReactNode} [props.iconEnd]
 * @param {boolean} [props.disabled]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  iconStart,
  iconEnd,
  disabled = false,
  type = 'button',
  className,
  children,
  ...rest
}) {
  if (
    import.meta.env.DEV &&
    variant === 'icon' &&
    !rest['aria-label'] &&
    !rest['aria-labelledby']
  ) {
    console.warn('Button: the icon variant needs an aria-label.')
  }

  const classes = cn(
    'button',
    `button--${variant}`,
    `button--${size}`,
    disabled && 'is-disabled',
    className,
  )

  const content = (
    <>
      {iconStart && (
        <span className="button__icon" aria-hidden="true">
          {iconStart}
        </span>
      )}
      {children && <span className="button__label">{children}</span>}
      {iconEnd && (
        <span className="button__icon button__icon--end" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </>
  )

  // Links cannot be natively disabled: drop the destination and expose the
  // state, which also removes them from the tab order.
  if ((to || href) && disabled) {
    return (
      <a className={classes} role="link" aria-disabled="true" {...rest}>
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    return (
      <a
        className={classes}
        href={href}
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...rest}>
      {content}
    </button>
  )
}
