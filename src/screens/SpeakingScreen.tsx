import { Button } from '../components/Button'
import { Card, PlayerChip } from '../components/Primitives'
import type { GameState } from '../domain/types'

interface SpeakingScreenProps {
  game: GameState
  onReady: () => void
}

export function SpeakingScreen({ game, onReady }: SpeakingScreenProps) {
  const firstSpeakerId = game.speakerOrder[0] ?? game.players[0]?.id
  const firstSpeaker = game.players.find((player) => player.id === firstSpeakerId)

  return (
    <div className="screen speaking-screen">
      <div className="speaking-screen__content scroll-area">
        <p className="eyebrow">HORA DAS DICAS</p>

        <div className="speaker">
          <h2 className="screen-title">Ordem das dicas</h2>
          <p className="speaker__name">{firstSpeaker?.name ?? 'Primeiro jogador'}</p>
        </div>

        <Card className="panel speaker-order">
          <p className="rules__title">Ordem de fala:</p>
          <ol className="speaker-order__list">
            {game.speakerOrder.map((playerId, index) => {
              const player = game.players.find((item) => item.id === playerId)
              if (!player) return null

              return (
                <li key={player.id} className="speaker-order__item">
                  <PlayerChip
                    position={index + 1}
                    animalId={player.animalId}
                    active={index === 0}
                  >
                    {player.name}
                  </PlayerChip>
                  {index === 0 ? <span className="speaker-order__first">começa</span> : null}
                </li>
              )
            })}
          </ol>
        </Card>

        <div className="panel rules">
          <p className="rules__title">Regras da rodada de dicas:</p>
          <ul className="rules__list">
            <li>Cada jogador diz apenas UMA palavra relacionada à palavra secreta.</li>
            <li>Realizem 2 voltas completas de dicas em sentido horário.</li>
            <li>O impostor deve tentar se misturar e descobrir a palavra!</li>
          </ul>
        </div>
      </div>

      <div className="speaking-screen__action">
        <Button block onClick={onReady}>
          PRONTOS PARA VOTAR
        </Button>
      </div>
    </div>
  )
}
