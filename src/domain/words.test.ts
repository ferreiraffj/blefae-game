import { describe, expect, it } from 'vitest'
import { getMultipleChoiceOptions, randomWord, THEMES_WITH_ICONS, WORD_BANK } from './words'

/** Gerador determinístico para manter os testes estáveis. */
function seededRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('banco de palavras', () => {
  it('tem todos os temas originais preenchidos', () => {
    expect(THEMES_WITH_ICONS).toHaveLength(12)
    for (const theme of THEMES_WITH_ICONS) {
      expect(WORD_BANK[theme]?.length ?? 0).toBeGreaterThan(20)
    }
  })

  it('não repete palavras dentro da mesma partida', () => {
    const theme = '📱 Objetos Cotidianos'
    const used: string[] = []
    const rng = seededRandom(42)

    for (let index = 0; index < 10; index += 1) {
      const word = randomWord(theme, used, rng)
      expect(used).not.toContain(word)
      used.push(word)
    }

    expect(new Set(used).size).toBe(10)
  })

  it('busca em outros temas quando o tema escolhido esgota', () => {
    const theme = '📱 Objetos Cotidianos'
    const used = [...WORD_BANK[theme]]
    const word = randomWord(theme, used, seededRandom(7))

    expect(used).not.toContain(word)
  })

  it('gera alternativas de múltipla escolha com a resposta correta', () => {
    const theme = '🍕 Comidas & Gastronomia'
    const target = WORD_BANK[theme][0]
    const options = getMultipleChoiceOptions(theme, target, 5, seededRandom(11))

    expect(options).toHaveLength(5)
    expect(options).toContain(target)
    expect(new Set(options).size).toBe(5)
  })
})
