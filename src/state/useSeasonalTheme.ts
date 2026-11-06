import { useEffect, useState } from 'react'
import { getActiveSeasonalTheme, type SeasonalTheme } from '../seasonalThemes'

const SEASON_CHECK_INTERVAL_MS = 60 * 60 * 1000

export function useSeasonalTheme() {
  const [seasonalTheme, setSeasonalTheme] = useState<SeasonalTheme | null>(
    getActiveSeasonalTheme,
  )

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = () => {
      const activeTheme = getActiveSeasonalTheme()
      setSeasonalTheme(activeTheme)
      if (activeTheme) {
        root.dataset.season = activeTheme.key
      } else {
        delete root.dataset.season
      }

      const themeColor = document.querySelector('meta[name="theme-color"]')
      if (themeColor) {
        themeColor.setAttribute('content', activeTheme ? '#17101B' : root.dataset.theme === 'dark' ? '#0B0C12' : '#F7F5FC')
      }
    }

    applyTheme()
    const interval = window.setInterval(applyTheme, SEASON_CHECK_INTERVAL_MS)
    return () => {
      window.clearInterval(interval)
      delete root.dataset.season
    }
  }, [])

  return seasonalTheme
}
