import { clsx } from 'clsx'

/**
 * Compose class names conditionally.
 *
 * @example cn('button', `button--${variant}`, { 'is-active': active }, className)
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs)
}
