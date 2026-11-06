import { describe, expect, it } from 'vitest'
import type { GameState } from '../domain/types'
import { gameReducer } from './gameReducer'

const baseGame: GameState = {
  createdAt: 0,
  players: [
    { id: '1', name: 'Alice', points: 120 },
    { id: '2', name: 'Bob', points: 80 },
    { id: '3', name: 'Carla', points: 40 },
  ],
  theme: 'Teste',
  totalRounds: 5,
  round: 2,
  word: 'Celular',
  impostorId: '3',
  phase: 'VOTING',
  endedEarly: false,
  revealIndex: 0,
  votes: {},
  speakerOrder: ['1', '2', '3'],
  impostorGuess: '',
  guessCorrect: false,
  lastRoundPoints: {},
  usedWords: ['Celular'],
  scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
  guessMode: 'typing',
  guessOptions: [],
}

describe('encerrar partida antecipadamente', () => {
  it('finaliza a partida mantendo a pontuação atual', () => {
    const ended = gameReducer(baseGame, { type: 'END_GAME' })

    expect(ended?.phase).toBe('FINISHED')
    expect(ended?.endedEarly).toBe(true)
    expect(ended?.players).toEqual(baseGame.players)
  })

  it('não altera uma partida que já foi finalizada', () => {
    const finished: GameState = { ...baseGame, phase: 'FINISHED' }

    expect(gameReducer(finished, { type: 'END_GAME' })).toBe(finished)
  })
})

describe('rodada de desempate', () => {
  function finishedGame(overrides: Partial<GameState> = {}): GameState {
    return {
      ...baseGame,
      phase: 'FINISHED',
      round: baseGame.totalRounds,
      players: baseGame.players.map((player) => ({ ...player, points: 100 })),
      ...overrides,
    }
  }

  it('inicia uma rodada extra quando há empate entre 3 ou mais no topo', () => {
    const finished = finishedGame()
    const tiebreak = gameReducer(finished, { type: 'START_TIEBREAKER' })

    expect(tiebreak?.phase).toBe('REVEAL')
    expect(tiebreak?.round).toBe(finished.round + 1)
    expect(tiebreak?.tiebreakerPlayed).toBe(true)
    expect(tiebreak?.votes).toEqual({})
    expect(tiebreak?.players).toEqual(finished.players)
  })

  describe('edição de jogadores entre rodadas', () => {
    it('preserva pontos dos jogadores mantidos e inicia novos jogadores com zero', () => {
      const transition: GameState = { ...baseGame, phase: 'ROUND_TRANSITION' }
      const updated = gameReducer(transition, {
        type: 'UPDATE_PLAYERS',
        names: ['Alice', 'Carla', 'Davi'],
      })

      expect(updated?.players).toEqual([
        { id: '1', name: 'Alice', points: 120 },
        { id: '3', name: 'Carla', points: 40 },
        expect.objectContaining({ name: 'Davi', points: 0 }),
      ])
    })

    it('ignora edição inválida ou fora da transição', () => {
      expect(
        gameReducer(baseGame, { type: 'UPDATE_PLAYERS', names: ['Alice', 'Bob'] }),
      ).toBe(baseGame)

      const transition: GameState = { ...baseGame, phase: 'ROUND_TRANSITION' }
      expect(
        gameReducer(transition, { type: 'UPDATE_PLAYERS', names: ['Alice', 'Alice', 'Carla'] }),
      ).toBe(transition)
    })
  })

  it('não oferece desempate quando o empate é apenas entre dois jogadores', () => {
    const finished = finishedGame({
      players: [
        { id: '1', name: 'Alice', points: 120 },
        { id: '2', name: 'Bob', points: 120 },
        { id: '3', name: 'Carla', points: 40 },
      ],
    })

    expect(gameReducer(finished, { type: 'START_TIEBREAKER' })).toBe(finished)
  })

  it('não permite uma segunda rodada de desempate', () => {
    const finished = finishedGame({ tiebreakerPlayed: true })

    expect(gameReducer(finished, { type: 'START_TIEBREAKER' })).toBe(finished)
  })

  it('não oferece desempate quando a partida foi encerrada antecipadamente', () => {
    const finished = finishedGame({ endedEarly: true })

    expect(gameReducer(finished, { type: 'START_TIEBREAKER' })).toBe(finished)
  })
})
