export type Phase =
  | 'SETUP'
  | 'REVEAL'
  | 'SPEAKING'
  | 'VOTING'
  | 'RESULT'
  | 'GUESS'
  | 'GUESS_CONFIRMATION'
  | 'SCORE'
  | 'ROUND_TRANSITION'
  | 'FINISHED'

export type GuessMode = 'typing' | 'multiple'

export interface Player {
  id: string
  name: string
  points: number
}

export interface ScoreConfig {
  /** Acertar o impostor sozinho (apenas 1 voto no impostor). */
  alone: number
  /** Impostor mais votado, de forma isolada. */
  majority: number
  /** Impostor empatado no topo da votação. */
  tie: number
  /** Impostor recebeu votos, mas não foi o mais votado. */
  minority: number
  /** Impostor acerta a palavra secreta no palpite final. */
  impostorGuess: number
}

export const DEFAULT_SCORE_CONFIG: ScoreConfig = {
  alone: 150,
  majority: 125,
  tie: 100,
  minority: 50,
  impostorGuess: 125,
}

export interface GameState {
  /** Momento de criação da partida (usado para expirar o autosave em 24h). */
  createdAt: number
  players: Player[]
  theme: string
  totalRounds: number
  round: number
  word: string
  impostorId: string
  phase: Phase
  /** A partida foi encerrada pelos jogadores antes da última rodada. */
  endedEarly?: boolean
  /** Indica que a rodada de desempate já foi disputada (só pode acontecer uma vez). */
  tiebreakerPlayed?: boolean
  revealIndex: number
  votes: Record<string, string>
  speakerOrder: string[]
  impostorGuess: string
  guessCorrect: boolean
  lastRoundPoints: Record<string, number>
  usedWords: string[]
  scoreConfig: ScoreConfig
  guessMode: GuessMode
  guessOptions: string[]
}

/** Parte do estado necessária para os cálculos de votação e pontuação. */
export type SavedGameLike = Pick<
  GameState,
  'players' | 'votes' | 'impostorId' | 'guessCorrect' | 'scoreConfig'
>

export interface SetupDraft {
  names: string[]
  theme: string
  rounds: number
  scoreConfig: ScoreConfig
  guessMode: GuessMode
}

export type ThemeMode = 'auto' | 'light' | 'dark'

export type AccentKey =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'purple'
  | 'cyan'
  | 'coral'

export interface AccentDefinition {
  key: AccentKey
  label: string
  hex: string
}

export interface VisualThemeConfig {
  mode: ThemeMode
  accent: AccentKey
  smoothAnimations: boolean
  cornerRadius: number
}

export const ACCENTS: readonly AccentDefinition[] = [
  { key: 'blue', label: 'Azul', hex: '#3B82F6' },
  { key: 'green', label: 'Verde', hex: '#22C55E' },
  { key: 'yellow', label: 'Amarelo', hex: '#EAB308' },
  { key: 'orange', label: 'Laranja', hex: '#F97316' },
  { key: 'red', label: 'Vermelho', hex: '#EF4444' },
  { key: 'magenta', label: 'Magenta', hex: '#EC4899' },
  { key: 'purple', label: 'Roxo', hex: '#8B5CF6' },
  { key: 'cyan', label: 'Ciano', hex: '#06B6D4' },
  { key: 'coral', label: 'Coral', hex: '#FF6B6B' },
]

export const DEFAULT_VISUAL_THEME: VisualThemeConfig = {
  mode: 'dark',
  accent: 'coral',
  smoothAnimations: true,
  cornerRadius: 18,
}

export function accentByKey(key: AccentKey): AccentDefinition {
  return ACCENTS.find((accent) => accent.key === key) ?? ACCENTS[ACCENTS.length - 1]
}

/** Converte "#RRGGBB" em "r, g, b" para uso em rgba(). */
export function hexToRgb(hex: string): string {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
