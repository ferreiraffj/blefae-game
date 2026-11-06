import { describe, expect, it } from 'vitest'
import { getActiveSeasonalTheme } from './seasonalThemes'

describe('temas sazonais', () => {
  it('ativa Halloween dentro da janela configurada', () => {
    expect(getActiveSeasonalTheme(new Date(2026, 9, 31))?.key).toBe('halloween')
    expect(getActiveSeasonalTheme(new Date(2026, 10, 7))?.key).toBe('halloween')
  })

  it('desativa Halloween fora da janela configurada', () => {
    expect(getActiveSeasonalTheme(new Date(2026, 8, 30))).toBeNull()
    expect(getActiveSeasonalTheme(new Date(2026, 10, 8))).toBeNull()
  })
})
