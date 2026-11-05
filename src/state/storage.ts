import { isGameState } from '../domain/engine'
import {
  ACCENTS,
  DEFAULT_SCORE_CONFIG,
  DEFAULT_VISUAL_THEME,
  type GameState,
  type SetupDraft,
  type VisualThemeConfig,
} from '../domain/types'
import { THEMES } from '../domain/words'

const GAME_KEY = 'blefae:game:v1'
const VISUAL_THEME_KEY = 'blefae:visual-theme:v1'
const SETUP_KEY = 'blefae:setup:v1'
const GAME_MAX_AGE_MS = 24 * 60 * 60 * 1000

export const DEFAULT_SETUP: SetupDraft = {
  names: ['Jogador 1', 'Jogador 2', 'Jogador 3'],
  theme: THEMES[1],
  rounds: 5,
  scoreConfig: DEFAULT_SCORE_CONFIG,
  guessMode: 'typing',
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Modo privado / armazenamento cheio: o jogo continua funcionando em memória.
  }
}

function removeRaw(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignora indisponibilidade do localStorage.
  }
}

function readJson(key: string): unknown {
  const raw = readRaw(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    removeRaw(key)
    return null
  }
}

export interface LoadedGame {
  game: GameState | null
  /** Indica que havia uma partida salva, mas ela passou das 24 horas. */
  expired: boolean
}

export function loadGame(now: number = Date.now()): LoadedGame {
  const stored = readJson(GAME_KEY)
  if (!stored || typeof stored !== 'object') {
    if (stored !== null) removeRaw(GAME_KEY)
    return { game: null, expired: false }
  }

  const candidate = (stored as { game?: unknown }).game ?? stored
  if (!isGameState(candidate)) {
    removeRaw(GAME_KEY)
    return { game: null, expired: false }
  }

  if (now - candidate.createdAt >= GAME_MAX_AGE_MS) {
    removeRaw(GAME_KEY)
    return { game: null, expired: true }
  }

  return { game: candidate, expired: false }
}

export function persistGame(game: GameState | null): void {
  if (!game) {
    removeRaw(GAME_KEY)
    return
  }
  writeRaw(GAME_KEY, JSON.stringify({ savedAt: Date.now(), game }))
}

export function clearPersistedGame(): void {
  removeRaw(GAME_KEY)
}

/** Indica que existe partida salva ainda em andamento (fora da tela inicial/final). */
export function hasGameInProgress(): boolean {
  const { game } = loadGame()
  if (!game) return false
  return game.phase !== 'FINISHED' && game.phase !== 'SETUP'
}

export function loadVisualTheme(): VisualThemeConfig {
  const stored = readJson(VISUAL_THEME_KEY)
  if (!stored || typeof stored !== 'object') return DEFAULT_VISUAL_THEME

  const candidate = stored as Partial<VisualThemeConfig>
  const mode =
    candidate.mode === 'auto' || candidate.mode === 'light' || candidate.mode === 'dark'
      ? candidate.mode
      : DEFAULT_VISUAL_THEME.mode
  const accent = ACCENTS.some((item) => item.key === candidate.accent)
    ? candidate.accent!
    : DEFAULT_VISUAL_THEME.accent
  const cornerRadius =
    typeof candidate.cornerRadius === 'number'
      ? Math.min(28, Math.max(8, Math.round(candidate.cornerRadius)))
      : DEFAULT_VISUAL_THEME.cornerRadius

  return {
    mode,
    accent,
    cornerRadius,
    smoothAnimations:
      typeof candidate.smoothAnimations === 'boolean'
        ? candidate.smoothAnimations
        : DEFAULT_VISUAL_THEME.smoothAnimations,
  }
}

export function persistVisualTheme(config: VisualThemeConfig): void {
  writeRaw(VISUAL_THEME_KEY, JSON.stringify(config))
}

export function loadSetupDraft(): SetupDraft {
  const stored = readJson(SETUP_KEY)
  if (!stored || typeof stored !== 'object') return DEFAULT_SETUP

  const candidate = stored as Partial<SetupDraft>
  const names =
    Array.isArray(candidate.names) &&
    candidate.names.length >= 3 &&
    candidate.names.length <= 12 &&
    candidate.names.every((name) => typeof name === 'string')
      ? candidate.names
      : DEFAULT_SETUP.names
  const theme =
    typeof candidate.theme === 'string' && THEMES.includes(candidate.theme)
      ? candidate.theme
      : DEFAULT_SETUP.theme
  const rounds =
    typeof candidate.rounds === 'number'
      ? Math.min(20, Math.max(1, Math.round(candidate.rounds)))
      : DEFAULT_SETUP.rounds
  const scoreConfig = { ...DEFAULT_SCORE_CONFIG }
  if (candidate.scoreConfig && typeof candidate.scoreConfig === 'object') {
    for (const key of Object.keys(DEFAULT_SCORE_CONFIG) as (keyof typeof DEFAULT_SCORE_CONFIG)[]) {
      const value = candidate.scoreConfig[key]
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        scoreConfig[key] = Math.round(value)
      }
    }
  }

  return {
    names,
    theme,
    rounds,
    scoreConfig,
    guessMode: candidate.guessMode === 'multiple' ? 'multiple' : 'typing',
  }
}

export function persistSetupDraft(draft: SetupDraft): void {
  writeRaw(SETUP_KEY, JSON.stringify(draft))
}
