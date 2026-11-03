import { Button } from '../components/Button'
import { TrophyIcon } from '../components/Icons'
import type { GameState } from '../domain/types'

interface FinishedScreenProps {
  game: GameState
  onNewGame: () => void
}

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} e ${names[1]}`
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

export function FinishedScreen({ game, onNewGame }: FinishedScreenProps) {
  const sorted = [...game.players].sort((a, b) => b.points - a.points)
  const winner = sorted[0]
  const winners = winner ? sorted.filter((player) => player.points === winner.points) : []

  return (
    <div className="screen screen--between finished">
      <div className="finished__hero">
        <span className="finished__trophy" aria-hidden="true">
          <TrophyIcon size={54} />
        </span>
        <h2 className="finished__title">PARTIDA FINALIZADA!</h2>
        <p className="finished__winner">
          {winner
            ? winners.length > 1
              ? `Empate no topo: ${joinNames(winners.map((player) => player.name))} com ${winner.points} pontos!`
              : `${winner.name} venceu com ${winner.points} pontos!`
            : ''}
        </p>
      </div>

      <div className="panel ranking">
        <p className="ranking__title">Classificação Final:</p>
        <ol className="ranking__list">
          {sorted.map((player) => {
            const rank = sorted.findIndex((other) => other.points === player.points) + 1
            return (
              <li
                key={player.id}
                className={rank === 1 ? 'ranking__row ranking__row--first' : 'ranking__row'}
              >
                <span className="ranking__position">{rank === 1 ? '🏆' : `${rank}º`}</span>
                <span className="ranking__name">{player.name}</span>
                <span className="ranking__points">{player.points} pts</span>
              </li>
            )
          })}
        </ol>
      </div>

      <Button block onClick={onNewGame}>
        NOVA PARTIDA
      </Button>
    </div>
  )
}
