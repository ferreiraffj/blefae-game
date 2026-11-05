import type { GameState, Player, SavedGameLike } from './types'

export interface GuessEvaluation {
  isExact: boolean
  isLikelyTypo: boolean
  editDistance: number
  cleanGuess: string
  cleanTarget: string
  reviewReason?: GuessReviewReason
}

export type GuessReviewReason = 'typo' | 'partial' | 'missing-word' | 'token-order'

/**
 * Normaliza uma string para comparação justa:
 * remove acentos, pontuação e espaços, e converte para minúsculas.
 */
export function normalize(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0))

  for (let i = 0; i <= m; i += 1) dp[i][0] = i
  for (let j = 0; j <= n; j += 1) dp[0][j] = j

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // remoção
        dp[i][j - 1] + 1, // inserção
        dp[i - 1][j - 1] + cost, // substituição
      )
    }
  }

  return dp[m][n]
}

const IGNORED_GUESS_TOKENS = new Set(['a', 'o', 'as', 'os', 'e', 'de', 'da', 'do', 'das', 'dos'])

function tokenize(value: string): string[] {
  return value
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function typoThreshold(word: string): number {
  return word.length <= 4 ? 1 : 2
}

function hasCloseToken(token: string, targetTokens: readonly string[]): boolean {
  return targetTokens.some(
    (targetToken) =>
      token === targetToken ||
      levenshteinDistance(token, targetToken) <= typoThreshold(targetToken),
  )
}

/**
 * Avalia o palpite do impostor.
 * Erros pequenos e palpites incompletos de palavras compostas acionam a validação
 * pelos civis, em vez de serem marcados automaticamente como incorretos.
 */
export function evaluateGuess(guess: string, targetWord: string): GuessEvaluation {
  const cleanGuess = normalize(guess)
  const cleanTarget = normalize(targetWord)

  if (cleanGuess.length === 0) {
    return {
      isExact: false,
      isLikelyTypo: false,
      editDistance: cleanTarget.length,
      cleanGuess,
      cleanTarget,
    }
  }

  const exact = cleanGuess === cleanTarget
  const distance = levenshteinDistance(cleanGuess, cleanTarget)
  const allTargetTokens = tokenize(targetWord)
  const allGuessTokens = tokenize(guess)
  const targetTokens = tokenize(targetWord).filter((token) => !IGNORED_GUESS_TOKENS.has(token))
  const guessTokens = tokenize(guess).filter((token) => !IGNORED_GUESS_TOKENS.has(token))

  if (exact) {
    return {
      isExact: true,
      isLikelyTypo: false,
      editDistance: distance,
      cleanGuess,
      cleanTarget,
    }
  }

  if (targetTokens.length > 1 && guessTokens.length > 0) {
    const allGuessTokensMatch = guessTokens.every((token) => hasCloseToken(token, targetTokens))
    const matchedTargetTokens = targetTokens.filter((token) =>
      guessTokens.some((guessToken) => hasCloseToken(guessToken, [token])),
    )

    if (allGuessTokensMatch && matchedTargetTokens.length > 0) {
      const isPartial =
        matchedTargetTokens.length < targetTokens.length ||
        allGuessTokens.length < allTargetTokens.length
      return {
        isExact: false,
        isLikelyTypo: true,
        editDistance: distance,
        cleanGuess,
        cleanTarget,
        reviewReason: isPartial ? 'partial' : 'typo',
      }
    }
  }

  return {
    isExact: exact,
    isLikelyTypo: !exact && distance <= typoThreshold(cleanTarget),
    editDistance: distance,
    cleanGuess,
    cleanTarget,
    reviewReason: !exact && distance <= typoThreshold(cleanTarget) ? 'typo' : undefined,
  }
}

export function checkImpostorGuess(guess: string, targetWord: string): boolean {
  return evaluateGuess(guess, targetWord).isExact
}

/**
 * Sorteia a ordem de fala:
 * - O impostor tem 20% de chance total de ser o primeiro orador.
 * - Os demais dividem igualmente os 80% restantes.
 */
export function weightedSpeakerOrder(
  players: readonly Player[],
  impostorId: string,
  rng: () => number = Math.random,
): string[] {
  if (players.length === 0) return []

  const others = players.filter((player) => player.id !== impostorId)
  const firstId =
    others.length === 0 || rng() < 0.2
      ? impostorId
      : others[Math.floor(rng() * others.length)].id

  const remaining = shuffle(
    players.map((player) => player.id).filter((id) => id !== firstId),
    rng,
  )

  return [firstId, ...remaining]
}

export function tallyVotes(game: SavedGameLike): Record<string, number> {
  const tally: Record<string, number> = {}
  for (const player of game.players) tally[player.id] = 0
  for (const targetId of Object.values(game.votes)) {
    if (targetId in tally) tally[targetId] += 1
  }
  return tally
}

/**
 * Calcula os pontos da rodada conforme a configuração e o palpite do impostor.
 * A pontuação ainda não é somada ao total dos jogadores neste passo.
 */
export function calculateRoundPoints(game: SavedGameLike): Record<string, number> {
  const tally = tallyVotes(game)
  const impostorVotes = tally[game.impostorId] ?? 0
  const maxVotes = Math.max(...Object.values(tally), 0)
  const maxCount = Object.values(tally).filter((votes) => votes === maxVotes).length
  const correctVoters = new Set(
    game.players.filter((player) => game.votes[player.id] === game.impostorId).map((player) => player.id),
  )
  const config = game.scoreConfig

  let pointsForCorrect = 0
  if (impostorVotes === maxVotes && maxCount > 1) pointsForCorrect = config.tie
  else if (impostorVotes === 1) pointsForCorrect = config.alone
  else if (impostorVotes === maxVotes) pointsForCorrect = config.majority
  else if (impostorVotes > 0) pointsForCorrect = config.minority

  const result: Record<string, number> = {}
  for (const player of game.players) {
    if (player.id === game.impostorId) {
      result[player.id] = game.guessCorrect ? config.impostorGuess : 0
    } else {
      result[player.id] = correctVoters.has(player.id) ? pointsForCorrect : 0
    }
  }
  return result
}

/** Jogadores com a maior pontuação (usado para detectar empates no topo). */
export function topScorers(players: readonly Player[]): Player[] {
  if (players.length === 0) return []
  const highest = Math.max(...players.map((player) => player.points))
  return players.filter((player) => player.points === highest)
}

export type Verdict = 'tie' | 'majority' | 'minority' | 'unnoticed'
export function voteVerdict(game: SavedGameLike): Verdict {
  const tally = tallyVotes(game)
  const impostorVotes = tally[game.impostorId] ?? 0
  const maxVotes = Math.max(...Object.values(tally), 0)
  const maxCount = Object.values(tally).filter((votes) => votes === maxVotes).length

  if (impostorVotes === maxVotes && maxCount > 1) return 'tie'
  if (impostorVotes === maxVotes) return 'majority'
  if (impostorVotes > 0) return 'minority'
  return 'unnoticed'
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case 'tie':
      return 'Empate na Votação'
    case 'majority':
      return 'Impostor Identificado pela Maioria!'
    case 'minority':
      return 'Identificado por Minoria'
    case 'unnoticed':
      return 'Impostor Passou Despercebido!'
  }
}

/** Valida os nomes vindos da tela de configuração. */
export function validatePlayerNames(names: readonly string[]):
  | { ok: true; names: string[] }
  | { ok: false; reason: 'too-few' | 'duplicated' } {
  const trimmed = names.map((name) => name.trim()).filter((name) => name.length > 0)
  if (trimmed.length < 3) return { ok: false, reason: 'too-few' }
  if (new Set(trimmed).size !== trimmed.length) return { ok: false, reason: 'duplicated' }
  return { ok: true, names: trimmed }
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Verifica o formato mínimo de uma partida salva antes de restaurá-la. */
export function isGameState(value: unknown): value is GameState {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<GameState>
  return (
    typeof candidate.createdAt === 'number' &&
    typeof candidate.word === 'string' &&
    typeof candidate.impostorId === 'string' &&
    typeof candidate.round === 'number' &&
    typeof candidate.totalRounds === 'number' &&
    Array.isArray(candidate.players) &&
    candidate.players.length >= 3 &&
    typeof candidate.votes === 'object' &&
    candidate.votes !== null &&
    Array.isArray(candidate.speakerOrder)
  )
}
