import type { ReactNode } from 'react'
import { cx } from '../utils'

interface SuspensePanelProps {
  title: string
  hint?: string
  variant?: 'default' | 'danger'
  compact?: boolean
  icon?: ReactNode
}

/**
 * Painel de suspense usado antes de revelar o impostor ou a palavra secreta.
 */
export function SuspensePanel({
  title,
  hint,
  variant = 'default',
  compact = false,
  icon,
}: SuspensePanelProps) {
  return (
    <div
      className={cx(
        'suspense',
        compact && 'suspense--compact',
        variant === 'danger' && 'suspense--danger',
      )}
      role="status"
      aria-live="polite"
    >
      <span className="suspense__ring" aria-hidden="true" />
      <span className="suspense__ring suspense__ring--inner" aria-hidden="true" />
      <span className="suspense__icon" aria-hidden="true">
        {icon ?? (variant === 'danger' ? '🕵️' : '🔮')}
      </span>
      <p className="suspense__title">{title}</p>
      {hint ? <p className="suspense__hint">{hint}</p> : null}
      <span className="suspense__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}
