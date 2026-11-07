import { useState } from 'react'
import { Button } from '../components/Button'
import { AnimalAvatar } from '../components/AnimalAvatar'
import { Badge, Card } from '../components/Primitives'
import type { GameState } from '../domain/types'
import { cx } from '../utils'

interface GuessScreenProps {
  game: GameState
  onSubmit: (guess: string) => void
}

export function GuessScreen({ game, onSubmit }: GuessScreenProps) {
  const [guess, setGuess] = useState('')
  const impostor = game.players.find((player) => player.id === game.impostorId)
  const isMultipleChoice = game.guessMode === 'multiple'
  const canSubmit = guess.trim().length > 0

  return (
    <form
      className="screen screen--between guess"
      onSubmit={(event) => {
        event.preventDefault()
        if (canSubmit) onSubmit(guess)
      }}
    >
      <Badge tone="danger">ÚLTIMA CHANCE</Badge>

      <div className="guess__head">
        <p className="muted guess__player">
          <AnimalAvatar animalId={impostor?.animalId} size="sm" />
          Vez de {impostor?.name ?? 'Impostor'}
        </p>
        <h2 className="screen-title">Qual era a palavra secreta?</h2>
        <p className="accent-text">Tema da rodada: {game.theme}</p>
        {isMultipleChoice ? (
          <p className="muted guess__instruction">Escolha uma das alternativas:</p>
        ) : null}
      </div>

      <div className="guess__body scroll-area">
        {isMultipleChoice ? (
          <Card className="guess-options">
            <p className="guess-options__title">Escolha a palavra secreta</p>
            <div className="option-list" role="radiogroup" aria-label="Alternativas de palavra">
            {game.guessOptions.map((option) => {
              const selected = guess === option
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cx('choice', selected && 'choice--selected')}
                  onClick={() => setGuess(option)}
                >
                  <span className={cx('radio-dot', selected && 'radio-dot--selected')} aria-hidden="true" />
                  <span>{option}</span>
                </button>
              )
            })}
            </div>
          </Card>
        ) : (
          <Card className="guess-input-card">
            <label className="field">
            <span className="field__label">Seu palpite de palavra</span>
            <input
              className="input input--lg"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Digite a palavra secreta"
              autoComplete="off"
              autoCapitalize="none"
              autoFocus
              maxLength={60}
              enterKeyHint="done"
            />
            </label>
          </Card>
        )}
      </div>

      <Button type="submit" block disabled={!canSubmit}>
        CONFIRMAR PALPITE
      </Button>
    </form>
  )
}
