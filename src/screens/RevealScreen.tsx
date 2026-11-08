import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { AnimalAvatar } from '../components/AnimalAvatar'
import { EyeOffIcon, FlagIcon, LockIcon } from '../components/Icons'
import { Badge, Card } from '../components/Primitives'
import { SuspensePanel } from '../components/SuspensePanel'
import { wordVisual } from '../domain/wordVisuals'
import type { GameState } from '../domain/types'
import { shouldAnimateSuspense } from '../state/useSuspenseReveal'
import { cx } from '../utils'
import { playSound } from '../utils/sound'

interface RevealScreenProps {
  game: GameState
  onReveal: (playerId: string) => void
  onEndGame: () => void
}

type RevealStage = 'curtain' | 'suspense' | 'role'

export function RevealScreen({ game, onReveal, onEndGame }: RevealScreenProps) {
  const player = game.players[game.revealIndex]
  const [stage, setStage] = useState<RevealStage>('curtain')
  const soundPlayedFor = useRef<string | null>(null)
  const isImpostor = player.id === game.impostorId
  const isTiebreaker = game.round > game.totalRounds
  const secretWordVisual = wordVisual(game.word)

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
      <div className="reveal__header">
        <div className="reveal__round">
          <span className="reveal__round-dot" />
          {isTiebreaker
            ? 'RODADA DE DESEMPATE'
            : `RODADA ${game.round} DE ${game.totalRounds}`}
        </div>
        <div className="reveal__turn">
          <AnimalAvatar animalId={player.animalId} size="sm" />
          <span>Vez de <strong>{player.name}</strong></span>
        </div>
      </div>

      <div className="reveal__stage">
        {stage === 'curtain' ? (
          <Card className="curtain">
            <span className="curtain__icon" aria-hidden="true">
              🔒
            </span>
            <p className="curtain__text">
              Passe o aparelho discretamente para <strong>{player.name}</strong> e confirme
              abaixo.
            </p>
            <p className="curtain__hint">Ninguém mais deve olhar para a tela.</p>
          </Card>
        ) : stage === 'suspense' ? (
          <SuspensePanel
            title="Revelando seu papel…"
            hint="Respire fundo e não mostre a tela para ninguém."
            icon="🎭"
          />
        ) : (
          <Card
            className={cx('role-card', isImpostor ? 'role-card--impostor' : 'role-card--civil')}
          >
            {isImpostor ? (
              <>
                <Badge tone="danger"><LockIcon size={24} /> SECRETO · APENAS VOCÊ DEVE VER</Badge>
                <img
                  className="role-card__impostor-image"
                  src="/impostor.png"
                  alt="Ilustração do impostor"
                />
                <h3 className="role-card__title">VOCÊ É O IMPOSTOR!</h3>
                <p className="role-card__subtitle">Shhh... Ninguém pode desconfiar! 🤫</p>
                <div className="role-card__theme-row">
                  <strong>Tema da rodada:</strong>
                  <strong>{game.theme}</strong>
                </div>
                <div className="role-card__mission">
                  <strong>Sua Missão:</strong> Você NÃO sabe a palavra secreta!
                  <span>Finja que sabe, pesque pistas no ar e tente adivinhar o objeto antes que descubram seu blefe.</span>
                </div>
              </>
            ) : (
              <>
                {/* <Badge tone="warning"><EyeOffIcon size={17} /> CONFIDENCIAL</Badge> */}
                <div className="role-card__civil-visual" aria-label={`Ilustração de ${game.word}`}>
                  {secretWordVisual.imageSrc ? (
                    <img src={secretWordVisual.imageSrc} alt="" />
                  ) : (
                    <span aria-hidden="true">{secretWordVisual.emoji}</span>
                  )}
                </div>
                {/* <Badge tone="accent">🛡 VOCÊ É INOCENTE</Badge> */}
                <p className="role-card__word-label">SUA PALAVRA SECRETA É:</p>
                <p className="role-card__word">{game.word}</p>
                <p className="role-card__instruction">
                  Você conhece o segredo! Na sua vez, dê uma <strong>dica sutil</strong> que os
                  inocentes entendam, sem entregar a palavra ao <strong>impostor</strong>.
                </p>
              </>
            )}
          </Card>
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
            className={isImpostor ? 'reveal__pass reveal__pass--impostor' : 'reveal__pass'}
            onClick={() => {
              setStage('curtain')
              onReveal(player.id)
            }}
          >
            <>OCULTAR E PASSAR CELULAR</>
          </Button>
        )}
        <button type="button" className="reveal__end" onClick={onEndGame}>
          <FlagIcon size={13} />
          ENCERRAR PARTIDA
        </button>
      </div>
    </div>
  )
}
