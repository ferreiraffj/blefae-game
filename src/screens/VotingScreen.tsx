import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { CheckIcon } from '../components/Icons'
import type { GameState } from '../domain/types'
import { cx } from '../utils'

interface VotingScreenProps {
  game: GameState
  onVote: (voterId: string, targetId: string) => void
}

export function VotingScreen({ game, onVote }: VotingScreenProps) {
  const currentVoter = game.players.find((player) => !game.votes[player.id])
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)

  useEffect(() => {
    setSelectedTarget(null)
  }, [currentVoter?.id])

  if (!currentVoter) return null

  const candidates = game.players.filter((player) => player.id !== currentVoter.id)
  const votesCast = Object.keys(game.votes).length

  return (
    <div className="screen">
      <p className="eyebrow">VOTAÇÃO SECRETA</p>
      <h2 className="screen-title">Vez de {currentVoter.name}</h2>
      <p className="screen-sub screen-sub--center">
        Confirme que está com o aparelho e escolha seu suspeito:
      </p>
      <p className="vote-progress">
        Voto {votesCast + 1} de {game.players.length}
      </p>

      <div className="candidate-list scroll-area">
        {candidates.map((candidate) => {
          const selected = selectedTarget === candidate.id
          return (
            <button
              key={candidate.id}
              type="button"
              className={cx('candidate', selected && 'candidate--selected')}
              aria-pressed={selected}
              onClick={() => setSelectedTarget(candidate.id)}
            >
              <span className="candidate__name">{candidate.name}</span>
              {selected ? (
                <span className="candidate__flag">
                  <CheckIcon size={16} /> Suspeito
                </span>
              ) : (
                <span className="radio-dot" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <div className="screen__footer">
        <Button
          block
          disabled={!selectedTarget}
          onClick={() => {
            if (selectedTarget) onVote(currentVoter.id, selectedTarget)
          }}
        >
          CONFIRMAR VOTO
        </Button>
      </div>
    </div>
  )
}
