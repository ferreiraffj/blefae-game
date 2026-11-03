import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils'
import { IconButton } from './Button'
import { XIcon } from './Icons'

interface ModalProps {
  title?: ReactNode
  subtitle?: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  className?: string
  bodyClassName?: string
  closeLabel?: string
}

/**
 * Diálogo modal com overlay desfocado, bloqueio de scroll e fechamento por Esc.
 */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  className,
  bodyClassName,
  closeLabel = 'Fechar',
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    const focusTarget = dialogRef.current
    focusTarget?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={cx('modal', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {title ? (
          <div className="modal__header">
            <div>
              <h2 className="modal__title" id={titleId}>
                {title}
              </h2>
              {subtitle ? <p className="modal__subtitle">{subtitle}</p> : null}
            </div>
            <IconButton label={closeLabel} onClick={onClose} className="icon-btn--ghost">
              <XIcon />
            </IconButton>
          </div>
        ) : null}

        <div className={cx('modal__body', bodyClassName)}>{children}</div>

        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
