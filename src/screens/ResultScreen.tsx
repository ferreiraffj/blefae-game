import { Button } from '../components/Button'
import { tallyVotes, verdictLabel, voteVerdict } from '../domain/engine'
import type { GameState } from '../domain/types'

interface ResultScreenProps {
  game: GameState
  onContinue: () => void
}

export function ResultScreen({ game, onContinue }: ResultScreenProps) {
  const tally = tallyVotes(game)
  const impostor = game.players.find((player) => player.id === game.impostorId)
  const verdict = verdictLabel(voteVerdict(game))

  return (
    <div className="screen screen--between">
      <p className="eyebrow">REVELAÇÃO DO IMPOSTOR</p>

      <div className="result">
        <p className="muted">O impostor desta rodada era…</p>
        <p className="result__name">{impostor?.name ?? 'Desconhecido'}</p>
        <p className="result__verdict">{verdict}</p>
      </div>

      <div className="panel tally">
        <p className="tally__title">Votação final:</p>
        <ul className="tally__list">
          {game.players.map((player) => (
            <li
              className={
                player.id === game.impostorId ? 'tally__row tally__row--impostor' : 'tally__row'
              }
              key={player.id}
            >
              <span className="tally__name">
                {player.name}
                {player.id === game.impostorId ? ' 🕵️' : ''}
              </span>
              <span className="tally__votes">{tally[player.id] ?? 0} voto(s)</span>
            </li>
          ))}
        </ul>
      </div>

      <Button block onClick={onContinue}>
        PALPITE DO IMPOSTOR
      </Button>
    </div>
  )
}
