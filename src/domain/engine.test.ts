import { describe, expect, it } from 'vitest'
import {
  calculateRoundPoints,
  evaluateGuess,
  normalize,
  verdictLabel,
  voteVerdict,
  weightedSpeakerOrder,
} from './engine'
import type { GameState, Player, ScoreConfig } from './types'

function player(id: string, name = id): Player {
  return { id, name, points: 0 }
}

function game(overrides: Partial<GameState> & Pick<GameState, 'players' | 'impostorId' | 'votes'>): GameState {
  return {
    createdAt: 0,
    theme: '🦁 Animais & Criaturas',
    totalRounds: 5,
    round: 1,
    word: 'Gato',
    phase: 'RESULT',
    revealIndex: 0,
    speakerOrder: [],
    impostorGuess: '',
    guessCorrect: false,
    lastRoundPoints: {},
    usedWords: [],
    scoreConfig: {} as ScoreConfig,
    guessMode: 'typing',
    guessOptions: [],
    ...overrides,
  }
}

describe('normalização de texto', () => {
  it('remove acentos, pontuação e diferenças de caixa', () => {
    expect(normalize('  MAÇÃ  ')).toBe('maca')
    expect(normalize('Pão de Queijo')).toBe('paodequeijo')
    expect(normalize('violão!')).toBe('violao')
  })
})

describe('avaliação do palpite do impostor', () => {
  it('considera exato após normalização', () => {
    expect(evaluateGuess('café', 'Cafe').isExact).toBe(true)
    expect(evaluateGuess('  MAÇÃ  ', 'maca').isExact).toBe(true)
    expect(evaluateGuess('violão!', 'Violao').isExact).toBe(true)
    expect(evaluateGuess('computador', 'celular').isExact).toBe(false)
  })

  it('detecta erros pequenos de digitação', () => {
    expect(evaluateGuess('elefante', 'Elefante').isLikelyTypo).toBe(false)
    expect(evaluateGuess('elefant', 'Elefante').isLikelyTypo).toBe(true)
    expect(evaluateGuess('piza', 'Pizza').isLikelyTypo).toBe(true)
    expect(evaluateGuess('carro', 'Gato').isLikelyTypo).toBe(false)
  })

  it('não aceita palpite vazio', () => {
    const result = evaluateGuess('   ', 'Gato')
    expect(result.isExact).toBe(false)
    expect(result.isLikelyTypo).toBe(false)
  })
})

describe('ordem de fala', () => {
  const players = [player('1', 'A'), player('2', 'B'), player('3', 'Impostor'), player('4', 'D')]

  it('sorteia todos os jogadores sem repetir', () => {
    const order = weightedSpeakerOrder(players, '3')
    expect(order).toHaveLength(4)
    expect(new Set(order).size).toBe(4)
  })

  it('respeita os 20% de chance do impostor começar', () => {
    expect(weightedSpeakerOrder(players, '3', () => 0.1)[0]).toBe('3')
  })

  it('escolhe um civil nos outros 80%', () => {
    const first = weightedSpeakerOrder(players, '3', () => 0.5)[0]
    expect(first).not.toBe('3')
  })
})

describe('pontuação da rodada', () => {
  it('dá 150 pontos a quem acerta sozinho', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')
    const p4 = player('4', 'Dan')

    const points = calculateRoundPoints(
      game({
        players: [p1, p2, p3, p4],
        impostorId: p3.id,
        votes: { '1': '3', '2': '1', '3': '2', '4': '2' },
        scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
      }),
    )

    expect(points['1']).toBe(150)
    expect(points['2']).toBe(0)
    expect(points['3']).toBe(0)
    expect(points['4']).toBe(0)
  })

  it('dá 100 pontos quando o impostor empata no topo', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')
    const p4 = player('4', 'Dan')

    const result = game({
      players: [p1, p2, p3, p4],
      impostorId: p3.id,
      votes: { '1': '3', '2': '3', '3': '1', '4': '1' },
      scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
    })

    expect(voteVerdict(result)).toBe('tie')
    expect(verdictLabel(voteVerdict(result))).toBe('Empate na Votação')
    const points = calculateRoundPoints(result)
    expect(points['1']).toBe(100)
    expect(points['2']).toBe(100)
  })

  it('dá 100 pontos no empate com três jogadores, mesmo com um voto em cada', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')

    const result = game({
      players: [p1, p2, p3],
      impostorId: p3.id,
      votes: { '1': '2', '2': '3', '3': '1' },
      scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
    })

    expect(voteVerdict(result)).toBe('tie')
    const points = calculateRoundPoints(result)
    expect(points['1']).toBe(0)
    expect(points['2']).toBe(100)
    expect(points['3']).toBe(0)
  })

  it('dá 50 pontos quando o impostor é minoria', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')
    const p4 = player('4', 'Dan')
    const p5 = player('5', 'Eve')

    const result = game({
      players: [p1, p2, p3, p4, p5],
      impostorId: p3.id,
      votes: { '1': '3', '2': '3', '3': '1', '4': '1', '5': '1' },
      scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
    })

    expect(voteVerdict(result)).toBe('minority')
    const points = calculateRoundPoints(result)
    expect(points['1']).toBe(50)
    expect(points['2']).toBe(50)
    expect(points['3']).toBe(0)
  })

  it('premia o impostor quando acerta a palavra', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')

    const points = calculateRoundPoints(
      game({
        players: [p1, p2, p3],
        impostorId: p3.id,
        votes: { '1': '3', '2': '3' },
        guessCorrect: true,
        scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
      }),
    )

    expect(points['3']).toBe(125)
    expect(points['1']).toBe(125)
    expect(points['2']).toBe(125)
  })

  it('não pontua ninguém quando o impostor passa despercebido', () => {
    const p1 = player('1', 'Alice')
    const p2 = player('2', 'Bob')
    const p3 = player('3', 'Impostor')

    const result = game({
      players: [p1, p2, p3],
      impostorId: p3.id,
      votes: { '1': '2', '2': '1', '3': '1' },
      scoreConfig: { alone: 150, majority: 125, tie: 100, minority: 50, impostorGuess: 125 },
    })

    expect(voteVerdict(result)).toBe('unnoticed')
    const points = calculateRoundPoints(result)
    expect(Object.values(points).every((value) => value === 0)).toBe(true)
  })
})
