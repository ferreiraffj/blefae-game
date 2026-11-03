import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { calculateRoundPoints } from '../domain/engine'
import type { GameState } from '../domain/types'

interface ScoreScreenProps {
  game: GameState
  onNext: () => void
}

export function ScoreScreen({ game, onNext }: ScoreScreenProps) {
  const points = calculateRoundPoints(game)
  const sorted = [...game.players].sort(
    (a, b) => b.points + (points[b.id] ?? 0) - (a.points + (points[a.id] ?? 0)),
  )
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAnimate(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="screen">
      <p className="eyebrow">
        PONTUAÇÃO DA RODADA {game.round} / {game.totalRounds}
      </p>
      <p className="score__word">Palavra: {game.word}</p>
      <p className={game.guessCorrect ? 'score__guess score__guess--right' : 'score__guess score__guess--wrong'}>
        {game.guessCorrect
          ? `🎯 O impostor acertou o palpite (+${game.scoreConfig.impostorGuess} pts)!`
          : '❌ O impostor errou o palpite.'}
      </p>

      <div className="score-list scroll-area">
        {sorted.map((player) => {
          const added = points[player.id] ?? 0
          return (
            <div className="score-row" key={player.id}>
              <div className="score-row__top">
                <span className="score-row__name">
                  {player.name}
                  {player.id === game.impostorId ? ' (Impostor)' : ''}
                </span>
                <span className="score-row__numbers">
                  <span className="muted">{player.points}</span>
                  <span className="score-row__plus">+{added}</span>
                  <span className="score-row__eq">=</span>
                  <span className="score-row__total">{player.points + added}</span>
                </span>
              </div>
              <div className="score-bar">
                <span
                  className="score-bar__fill"
                  style={{ width: animate && added > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="screen__footer">
        <Button block onClick={onNext}>
          {game.round >= game.totalRounds ? 'VER RESULTADO FINAL' : 'AVANÇAR RODADA'}
        </Button>
      </div>
    </div>
  )
}
