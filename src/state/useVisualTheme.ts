import { useEffect, useState } from 'react'
import { accentByKey, hexToRgb, type VisualThemeConfig } from '../domain/types'
import { loadVisualTheme, persistVisualTheme } from '../state/storage'

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function channelLuminance(channel: number): number {
  const value = channel / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  )
}

/** Escolhe texto claro ou escuro com base no maior contraste. */
function readableOn(hex: string): string {
  const luminance = relativeLuminance(hex)
  const whiteContrast = 1.05 / (luminance + 0.05)
  const blackContrast = (luminance + 0.05) / 0.05
  return whiteContrast >= blackContrast ? '#ffffff' : '#160f24'
}

export function useVisualTheme() {
  const [config, setConfig] = useState<VisualThemeConfig>(loadVisualTheme)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    if (config.mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    setSystemDark(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [config.mode])

  const resolved = config.mode === 'auto' ? (systemDark ? 'dark' : 'light') : config.mode

  useEffect(() => {
    persistVisualTheme(config)
  }, [config])

  useEffect(() => {
    const root = document.documentElement
    const accent = accentByKey(config.accent)
    const accentColor = accent.hex

    root.dataset.theme = resolved
    root.dataset.animations = config.smoothAnimations ? 'on' : 'off'
    root.style.setProperty('--accent', accentColor)
    root.style.setProperty('--accent-rgb', hexToRgb(accentColor))
    root.style.setProperty('--on-accent', readableOn(accentColor))
    root.style.setProperty('--radius', `${config.cornerRadius}px`)

    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.setAttribute('content', resolved === 'dark' ? '#181126' : '#FDFBF7')
  }, [config, resolved])

  return { config, setConfig, resolved }
}
