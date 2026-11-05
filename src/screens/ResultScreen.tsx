import { useEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { SuspensePanel } from '../components/SuspensePanel'
import { tallyVotes, verdictLabel, voteVerdict } from '../domain/engine'
import type { GameState } from '../domain/types'
import { useSuspenseReveal } from '../state/useSuspenseReveal'
import { playSound } from '../utils/sound'

interface ResultScreenProps {
  game: GameState
  onContinue: () => void
}

export function ResultScreen({ game, onContinue }: ResultScreenProps) {
  const tally = tallyVotes(game)
  const impostor = game.players.find((player) => player.id === game.impostorId)
  const verdict = verdictLabel(voteVerdict(game))
  const revealed = useSuspenseReveal(2000, `${game.round}-${game.impostorId}`)
  const soundPlayed = useRef(false)

  useEffect(() => {
    if (!revealed || soundPlayed.current) return
    soundPlayed.current = true
    playSound('confirmacao')
  }, [revealed])

  return (
    <div className="screen screen--between">
      <p className="eyebrow">{revealed ? 'REVELAÇÃO DO IMPOSTOR' : 'CONTANDO OS VOTOS'}</p>

      {revealed ? (
        <div className="result">
          <p className="muted">O impostor desta rodada era…</p>
          <p className="result__name result__name--revealed">
            {impostor?.name ?? 'Desconhecido'}
          </p>
          <p className="result__verdict">{verdict}</p>
        </div>
      ) : (
        <SuspensePanel
          variant="danger"
          title="Revelando quem era o impostor…"
          hint="A votação foi encerrada e a verdade está prestes a aparecer."
        />
      )}

      {revealed ? (
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
      ) : null}

      <Button block onClick={onContinue} disabled={!revealed}>
        {revealed ? 'PALPITE DO IMPOSTOR' : 'REVELANDO…'}
      </Button>
    </div>
  )
}
