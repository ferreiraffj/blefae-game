import { Button } from '../components/Button'
import type { GameState } from '../domain/types'

interface GuessConfirmationScreenProps {
  game: GameState
  onConfirm: (accepted: boolean) => void
}

export function GuessConfirmationScreen({ game, onConfirm }: GuessConfirmationScreenProps) {
  const impostor = game.players.find((player) => player.id === game.impostorId)

  return (
    <div className="screen screen--center">
      <p className="eyebrow">VALIDAÇÃO DOS CIVIS</p>

      <div className="confirm">
        <p className="confirm__question">O grupo de civis deve validar:</p>

        <div className="panel confirm__card">
          <div className="confirm__row">
            <span className="confirm__label">Palavra Secreta:</span>
            <span className="confirm__word">{game.word}</span>
          </div>
          <div className="divider" />
          <div className="confirm__row">
            <span className="confirm__label">
              Palpite de {impostor?.name ?? 'Impostor'}:
            </span>
            <span className="confirm__guess">{game.impostorGuess}</span>
          </div>
        </div>

        <p className="confirm__help">
          O palpite parece uma resposta parecida ou incompleta. O grupo considera esse palpite
          correto?
        </p>
      </div>

      <div className="row row--2 confirm__actions">
        <Button variant="ghost" onClick={() => onConfirm(false)}>
          ❌ Incorreto
        </Button>
        <Button onClick={() => onConfirm(true)}>✅ Aceitar</Button>
      </div>
    </div>
  )
}
