import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import type { GameState } from '../domain/types'
import { cx } from '../utils'

interface RevealScreenProps {
  game: GameState
  onReveal: (playerId: string) => void
}

export function RevealScreen({ game, onReveal }: RevealScreenProps) {
  const player = game.players[game.revealIndex]
  const [revealed, setRevealed] = useState(false)
  const isImpostor = player.id === game.impostorId

  useEffect(() => {
    setRevealed(false)
  }, [player.id])

  return (
    <div className="screen screen--center reveal">
      <p className="eyebrow">
        RODADA {game.round} / {game.totalRounds} · {game.theme}
      </p>

      <div className="reveal__who">
        <p className="muted">Vez de</p>
        <h2 className="reveal__name">{player.name}</h2>
      </div>

      <div className="reveal__stage">
        {!revealed ? (
          <div className="curtain panel">
            <span className="curtain__icon" aria-hidden="true">
              🔒
            </span>
            <p className="curtain__text">
              Passe o aparelho discretamente para <strong>{player.name}</strong> e confirme
              abaixo.
            </p>
            <p className="curtain__hint">Ninguém mais deve olhar para a tela.</p>
          </div>
        ) : (
          <div className={cx('role-card', isImpostor ? 'role-card--impostor' : 'role-card--civil')}>
            {isImpostor ? (
              <>
                <span className="role-card__emoji" aria-hidden="true">
                  🕵️
                </span>
                <h3 className="role-card__title">VOCÊ É O IMPOSTOR!</h3>
                <p className="role-card__text">
                  Finja que sabe a palavra secreta, preste atenção nas dicas e tente descobrir!
                </p>
              </>
            ) : (
              <>
                <span className="role-card__emoji" aria-hidden="true">
                  🤫
                </span>
                <p className="eyebrow">PALAVRA SECRETA:</p>
                <p className="role-card__word">{game.word}</p>
                <p className="role-card__theme">Tema: {game.theme}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="reveal__action">
        {!revealed ? (
          <Button block onClick={() => setRevealed(true)}>
            ME CHAMO {player.name.toUpperCase()}
          </Button>
        ) : (
          <Button
            block
            onClick={() => {
              setRevealed(false)
              onReveal(player.id)
            }}
          >
            OCULTAR E PASSAR CELULAR
          </Button>
        )}
      </div>
    </div>
  )
}
