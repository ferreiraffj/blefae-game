import {
  calculateRoundPoints,
  createId,
  evaluateGuess,
  topScorers,
  weightedSpeakerOrder,
} from '../domain/engine'
import { getMultipleChoiceOptions, randomWord } from '../domain/words'
import type { GameState, GuessMode, Player, ScoreConfig } from '../domain/types'

export type GameAction =
  | {
      type: 'START'
      names: string[]
      theme: string
      totalRounds: number
      scoreConfig: ScoreConfig
      guessMode: GuessMode
    }
  | { type: 'REVEAL_PLAYER'; playerId: string }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; voterId: string; targetId: string }
  | { type: 'OPEN_GUESS' }
  | { type: 'SUBMIT_GUESS'; guess: string }
  | { type: 'CONFIRM_GUESS'; accepted: boolean }
  | { type: 'ADVANCE_FROM_SCORE' }
  | { type: 'START_NEXT_ROUND'; theme: string }
  | { type: 'START_TIEBREAKER' }
  | { type: 'END_GAME' }
  | { type: 'RESET' }

function createPlayers(names: readonly string[]): Player[] {
  return names.map((name) => ({ id: createId(), name, points: 0 }))
}

export function gameReducer(game: GameState | null, action: GameAction): GameState | null {
  switch (action.type) {
    case 'RESET':
      return null

    case 'START': {
      const players = createPlayers(action.names)
      if (players.length < 3) return game

      const impostorId = players[Math.floor(Math.random() * players.length)].id
      const word = randomWord(action.theme, [])

      return {
        createdAt: Date.now(),
        players,
        theme: action.theme,
        totalRounds: action.totalRounds,
        round: 1,
        word,
        impostorId,
        phase: 'REVEAL',
        endedEarly: false,
        tiebreakerPlayed: false,
        revealIndex: 0,
        votes: {},
        speakerOrder: weightedSpeakerOrder(players, impostorId),
        impostorGuess: '',
        guessCorrect: false,
        lastRoundPoints: {},
        usedWords: [word],
        scoreConfig: action.scoreConfig,
        guessMode: action.guessMode,
        guessOptions: [],
      }
    }

    case 'REVEAL_PLAYER': {
      if (!game || game.phase !== 'REVEAL') return game
      const current = game.players[game.revealIndex]
      if (!current || current.id !== action.playerId) return game

      if (game.revealIndex + 1 >= game.players.length) {
        return { ...game, phase: 'SPEAKING', revealIndex: 0 }
      }
      return { ...game, revealIndex: game.revealIndex + 1 }
    }

    case 'START_VOTING': {
      if (!game || game.phase !== 'SPEAKING') return game
      return { ...game, phase: 'VOTING', votes: {}, revealIndex: 0 }
    }

    case 'CAST_VOTE': {
      if (!game || game.phase !== 'VOTING') return game
      if (action.voterId === action.targetId) return game
      if (game.votes[action.voterId]) return game
      if (!game.players.some((player) => player.id === action.targetId)) return game

      const votes = { ...game.votes, [action.voterId]: action.targetId }
      const everyoneVoted = Object.keys(votes).length === game.players.length
      return { ...game, votes, phase: everyoneVoted ? 'RESULT' : 'VOTING' }
    }

    case 'OPEN_GUESS': {
      if (!game || game.phase !== 'RESULT') return game
      const guessOptions =
        game.guessMode === 'multiple'
          ? getMultipleChoiceOptions(game.theme, game.word)
          : []
      return { ...game, phase: 'GUESS', impostorGuess: '', guessOptions }
    }

    case 'SUBMIT_GUESS': {
      if (!game || game.phase !== 'GUESS') return game
      const guess = action.guess.trim()
      if (!guess) return game

      const evaluation = evaluateGuess(guess, game.word)
      const needsValidation = game.guessMode === 'typing' && evaluation.isLikelyTypo

      return {
        ...game,
        impostorGuess: guess,
        guessCorrect: needsValidation ? game.guessCorrect : evaluation.isExact,
        phase: needsValidation ? 'GUESS_CONFIRMATION' : 'SCORE',
      }
    }

    case 'CONFIRM_GUESS': {
      if (!game || game.phase !== 'GUESS_CONFIRMATION') return game
      return { ...game, guessCorrect: action.accepted, phase: 'SCORE' }
    }

    case 'ADVANCE_FROM_SCORE': {
      if (!game || game.phase !== 'SCORE') return game

      const earned = calculateRoundPoints(game)
      const players = game.players.map((player) => ({
        ...player,
        points: player.points + (earned[player.id] ?? 0),
      }))
      const isLastRound = game.round >= game.totalRounds

      return {
        ...game,
        players,
        lastRoundPoints: earned,
        phase: isLastRound ? 'FINISHED' : 'ROUND_TRANSITION',
      }
    }

    case 'START_NEXT_ROUND': {
      if (!game || game.phase !== 'ROUND_TRANSITION') return game

      const word = randomWord(action.theme, game.usedWords)
      const impostorId = game.players[Math.floor(Math.random() * game.players.length)].id

      return {
        ...game,
        round: game.round + 1,
        theme: action.theme,
        word,
        impostorId,
        phase: 'REVEAL',
        revealIndex: 0,
        votes: {},
        speakerOrder: weightedSpeakerOrder(game.players, impostorId),
        impostorGuess: '',
        guessCorrect: false,
        guessOptions: [],
        usedWords: [...game.usedWords, word],
      }
    }

    case 'START_TIEBREAKER': {
      if (!game || game.phase !== 'FINISHED' || game.tiebreakerPlayed || game.endedEarly) {
        return game
      }
      if (topScorers(game.players).length < 3) return game

      const word = randomWord(game.theme, game.usedWords)
      const impostorId = game.players[Math.floor(Math.random() * game.players.length)].id

      return {
        ...game,
        round: game.round + 1,
        word,
        impostorId,
        phase: 'REVEAL',
        revealIndex: 0,
        votes: {},
        speakerOrder: weightedSpeakerOrder(game.players, impostorId),
        impostorGuess: '',
        guessCorrect: false,
        lastRoundPoints: {},
        guessOptions: [],
        usedWords: [...game.usedWords, word],
        tiebreakerPlayed: true,
      }
    }

    case 'END_GAME': {
      if (!game || game.phase === 'FINISHED') return game
      return { ...game, phase: 'FINISHED', endedEarly: true }
    }

    default:
      return game
  }
}
