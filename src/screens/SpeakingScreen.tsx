import { Button } from '../components/Button'
import type { GameState } from '../domain/types'

interface SpeakingScreenProps {
  game: GameState
  onReady: () => void
}

export function SpeakingScreen({ game, onReady }: SpeakingScreenProps) {
  const firstSpeakerId = game.speakerOrder[0] ?? game.players[0]?.id
  const firstSpeaker = game.players.find((player) => player.id === firstSpeakerId)

  return (
    <div className="screen screen--between">
      <p className="eyebrow">HORA DAS DICAS</p>

      <div className="speaker">
        <h2 className="screen-title">Quem começa falando?</h2>
        <p className="speaker__name">{firstSpeaker?.name ?? 'Primeiro jogador'}</p>
      </div>

      <div className="panel rules">
        <p className="rules__title">Regras da rodada de dicas:</p>
        <ul className="rules__list">
          <li>Cada jogador diz apenas UMA palavra relacionada à palavra secreta.</li>
          <li>Realizem 2 voltas completas de dicas em sentido horário.</li>
          <li>O impostor deve tentar se misturar e descobrir a palavra!</li>
        </ul>
      </div>

      <Button block onClick={onReady}>
        PRONTOS PARA VOTAR
      </Button>
    </div>
  )
}
