import { useEffect, useState } from 'react'

/** Respeita a preferência de animações do app e do sistema operacional. */
export function shouldAnimateSuspense(): boolean {
  if (typeof window === 'undefined') return false
  const animationsOff = document.documentElement.dataset.animations === 'off'
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  return !animationsOff && !reducedMotion
}

/**
 * Mantém a tela em suspense por alguns instantes antes de revelar o conteúdo.
 * Quando as animações estão desligadas, revela imediatamente.
 */
export function useSuspenseReveal(delay = 1600, resetKey?: unknown): boolean {
  const [revealed, setRevealed] = useState(() => !shouldAnimateSuspense())

  useEffect(() => {
    if (!shouldAnimateSuspense()) {
      setRevealed(true)
      return
    }

    setRevealed(false)
    const timer = window.setTimeout(() => setRevealed(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay, resetKey])

  return revealed
}
