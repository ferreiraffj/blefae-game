import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../utils'
import { AnimalAvatar } from './AnimalAvatar'
import type { AnimalId } from '../domain/animals'

type CardTone = 'default' | 'accent' | 'success' | 'danger'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone
  children: ReactNode
}

export function Card({ tone = 'default', className, children, ...props }: CardProps) {
  return (
    <div className={cx('ui-card', `ui-card--${tone}`, className)} {...props}>
      {children}
    </div>
  )
}

type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'accent', className, children, ...props }: BadgeProps) {
  return (
    <span className={cx('badge', `badge--${tone}`, className)} {...props}>
      {children}
    </span>
  )
}

interface PlayerChipProps extends HTMLAttributes<HTMLSpanElement> {
  position?: number
  active?: boolean
  animalId?: AnimalId
  children: ReactNode
}

export function PlayerChip({
  position,
  active = false,
  animalId,
  className,
  children,
  ...props
}: PlayerChipProps) {
  return (
    <span className={cx('player-chip', active && 'player-chip--active', className)} {...props}>
      {position !== undefined ? <span className="player-chip__position">{position}</span> : null}
      <AnimalAvatar animalId={animalId} size="sm" />
      <span className="player-chip__name">{children}</span>
    </span>
  )
}
