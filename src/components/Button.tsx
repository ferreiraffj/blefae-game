import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../utils'

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  block?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  block = false,
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`, block && 'btn--block', className)}
      {...props}
    >
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export function IconButton({ label, className, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx('icon-btn', className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  )
}
