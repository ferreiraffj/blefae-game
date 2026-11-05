import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { SuspensePanel } from '../components/SuspensePanel'
import type { GameState } from '../domain/types'
import { shouldAnimateSuspense } from '../state/useSuspenseReveal'
import { cx } from '../utils'
import { playSound } from '../utils/sound'

interface RevealScreenProps {
  game: GameState
  onReveal: (playerId: string) => void
}

type RevealStage = 'curtain' | 'suspense' | 'role'

export function RevealScreen({ game, onReveal }: RevealScreenProps) {
  const player = game.players[game.revealIndex]
  const [stage, setStage] = useState<RevealStage>('curtain')
  const soundPlayedFor = useRef<string | null>(null)
  const isImpostor = player.id === game.impostorId
  const isTiebreaker = game.round > game.totalRounds

  useEffect(() => {
    setStage('curtain')
  }, [player.id])

  useEffect(() => {
    if (stage !== 'role' || soundPlayedFor.current === player.id) return
    soundPlayedFor.current = player.id
    playSound('confirmacao')
  }, [stage, player.id])

  useEffect(() => {
    if (stage !== 'suspense') return
    if (!shouldAnimateSuspense()) {
      setStage('role')
      return
    }

    const timer = window.setTimeout(() => setStage('role'), 1200)
    return () => window.clearTimeout(timer)
  }, [stage])

  return (
    <div className="screen screen--center reveal">
      <p className="eyebrow">
        {isTiebreaker
          ? 'RODADA DE DESEMPATE'
          : `RODADA ${game.round} / ${game.totalRounds}`}{' '}
        · {game.theme}
      </p>

      <div className="reveal__who">
        <p className="muted">Vez de</p>
        <h2 className="reveal__name">{player.name}</h2>
      </div>

      <div className="reveal__stage">
        {stage === 'curtain' ? (
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
        ) : stage === 'suspense' ? (
          <SuspensePanel
            title="Revelando seu papel…"
            hint="Respire fundo e não mostre a tela para ninguém."
            icon="🎭"
          />
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
        {stage === 'curtain' ? (
          <Button block onClick={() => setStage('suspense')}>
            ME CHAMO {player.name.toUpperCase()}
          </Button>
        ) : stage === 'suspense' ? (
          <Button block disabled>
            PREPARANDO…
          </Button>
        ) : (
          <Button
            block
            onClick={() => {
              setStage('curtain')
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
