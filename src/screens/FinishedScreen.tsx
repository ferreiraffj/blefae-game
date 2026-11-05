import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { TrophyIcon } from '../components/Icons'
import { SuspensePanel } from '../components/SuspensePanel'
import { topScorers } from '../domain/engine'
import type { GameState } from '../domain/types'
import { shouldAnimateSuspense, useSuspenseReveal } from '../state/useSuspenseReveal'
import { cx } from '../utils'
import { playSound, stopSound } from '../utils/sound'

const SUSPENSE_MS = 3300

interface FinishedScreenProps {
  game: GameState
  onNewGame: () => void
  onStartTiebreaker: () => void
}

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} e ${names[1]}`
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

export function FinishedScreen({ game, onNewGame, onStartTiebreaker }: FinishedScreenProps) {
  const sorted = [...game.players].sort((a, b) => b.points - a.points)
  const winners = topScorers(game.players)
  const winner = winners[0]
  const [tiebreakDeclined, setTiebreakDeclined] = useState(false)
  const revealed = useSuspenseReveal(SUSPENSE_MS)
  const suspenseStarted = useRef(false)

  useEffect(() => {
    if (suspenseStarted.current || !shouldAnimateSuspense()) return
    suspenseStarted.current = true
    playSound('suspense')
  }, [])

  useEffect(() => {
    if (!revealed) return
    stopSound('suspense')
    playSound('vencedor')

    // Ao sair da tela final (nova partida ou desempate), interrompe a fanfarra.
    return () => stopSound('vencedor')
  }, [revealed])

  const canOfferTiebreaker =
    !game.endedEarly && !game.tiebreakerPlayed && winners.length >= 3
  const showTiebreakerOffer = canOfferTiebreaker && !tiebreakDeclined

  if (!revealed) {
    return (
      <div className="screen screen--center finished">
        <SuspensePanel
          icon="🏆"
          title="Quem será o vencedor?"
          hint="A partida terminou e a classificação final está prestes a aparecer."
        />
      </div>
    )
  }

  return (
    <div
      className={cx(
        'screen screen--between finished',
        showTiebreakerOffer && 'finished--tiebreak',
      )}
    >
      <div className="finished__hero">
        <span className="finished__trophy" aria-hidden="true">
          <TrophyIcon size={54} />
        </span>
        <h2 className="finished__title">
          {game.endedEarly ? 'PARTIDA ENCERRADA!' : 'PARTIDA FINALIZADA!'}
        </h2>
        <p className="finished__winner">
          {winner
            ? winners.length > 1
              ? `Empate no topo: ${joinNames(winners.map((player) => player.name))} com ${winner.points} pontos!`
              : `${winner.name} venceu com ${winner.points} pontos!`
            : ''}
        </p>
        {game.endedEarly ? (
          <p className="finished__note">
            {game.round > game.totalRounds
              ? 'Encerrada durante a rodada de desempate. Os pontos da rodada em andamento não foram contabilizados.'
              : `Encerrada na rodada ${game.round} de ${game.totalRounds}. Os pontos da rodada em andamento não foram contabilizados.`}
          </p>
        ) : game.tiebreakerPlayed ? (
          <p className="finished__note">Rodada de desempate realizada.</p>
        ) : null}
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

      {showTiebreakerOffer ? (
        <div className="panel tiebreak-offer">
          <p className="tiebreak-offer__title">
            Empate entre {winners.length} jogadores!
          </p>
          <p className="tiebreak-offer__text">
            Querem disputar uma rodada de desempate? Uma nova palavra e um novo impostor serão
            sorteados. Se o empate continuar, a partida termina empatada.
          </p>
          <div className="tiebreak-offer__actions">
            <Button variant="ghost" onClick={() => setTiebreakDeclined(true)}>
              ENCERRAR COM EMPATE
            </Button>
            <Button onClick={onStartTiebreaker}>JOGAR DESEMPATE</Button>
          </div>
        </div>
      ) : (
        <Button block onClick={onNewGame}>
          NOVA PARTIDA
        </Button>
      )}
    </div>
  )
}
