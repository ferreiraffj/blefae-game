import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { DEFAULT_SCORE_CONFIG, type GuessMode, type ScoreConfig } from '../domain/types'
import { cx } from '../utils'

interface ScoreConfigModalProps {
  config: ScoreConfig
  guessMode: GuessMode
  onSave: (config: ScoreConfig, guessMode: GuessMode) => void
  onClose: () => void
}

type FieldKey = keyof ScoreConfig

const FIELDS: Array<{ key: FieldKey; label: string }> = [
  { key: 'alone', label: 'Acertar sozinho' },
  { key: 'majority', label: 'Acertar em maioria' },
  { key: 'tie', label: 'Acertar em empate' },
  { key: 'minority', label: 'Acertar em minoria' },
  { key: 'impostorGuess', label: 'Impostor acerta a palavra' },
]

const GUESS_MODES: Array<{
  key: GuessMode
  icon: string
  label: string
  description: string
}> = [
  {
    key: 'typing',
    icon: '✍️',
    label: 'Digitação com Validação',
    description:
      'O impostor digita a palavra. Se houver erro de digitação, o grupo de civis valida a resposta.',
  },
  {
    key: 'multiple',
    icon: '📋',
    label: 'Múltipla Escolha',
    description:
      'O impostor escolhe a palavra correta entre alternativas sorteadas do tema da rodada.',
  },
]

function toStrings(config: ScoreConfig): Record<FieldKey, string> {
  return {
    alone: String(config.alone),
    majority: String(config.majority),
    tie: String(config.tie),
    minority: String(config.minority),
    impostorGuess: String(config.impostorGuess),
  }
}

export function ScoreConfigModal({ config, guessMode, onSave, onClose }: ScoreConfigModalProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>(() => toStrings(config))
  const [mode, setMode] = useState<GuessMode>(guessMode)

  function handleSave() {
    onSave(
      {
        alone: Number.parseInt(values.alone, 10) || DEFAULT_SCORE_CONFIG.alone,
        majority: Number.parseInt(values.majority, 10) || DEFAULT_SCORE_CONFIG.majority,
        tie: Number.parseInt(values.tie, 10) || DEFAULT_SCORE_CONFIG.tie,
        minority: Number.parseInt(values.minority, 10) || DEFAULT_SCORE_CONFIG.minority,
        impostorGuess: Number.parseInt(values.impostorGuess, 10) || DEFAULT_SCORE_CONFIG.impostorGuess,
      },
      mode,
    )
    onClose()
  }

  return (
    <Modal
      title="Configurações da Partida"
      subtitle="Ajuste o modo do impostor e os pontos"
      onClose={onClose}
      footer={
        <div className="modal__actions">
          <Button
            variant="ghost"
            onClick={() => {
              setValues(toStrings(DEFAULT_SCORE_CONFIG))
              setMode('typing')
            }}
          >
            Padrão
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      }
    >
      <div className="form-section">
        <p className="form-section__title">Modo de Palpite do Impostor</p>
        <div className="option-list" role="radiogroup" aria-label="Modo de palpite do impostor">
          {GUESS_MODES.map((item) => {
            const selected = mode === item.key
            return (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={selected}
                className={cx('option-card', selected && 'option-card--selected')}
                onClick={() => setMode(item.key)}
              >
                <span className="option-card__header">
                  <span className="option-card__label">
                    {item.icon} {item.label}
                  </span>
                  <span className={cx('radio-dot', selected && 'radio-dot--selected')} aria-hidden="true" />
                </span>
                <span className="option-card__description">{item.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="divider" />

      <div className="form-section">
        <p className="form-section__title">Valores de Pontuação</p>
        <div className="score-fields">
          {FIELDS.map((field) => (
            <label key={field.key} className="field">
              <span className="field__label">{field.label}</span>
              <input
                className="input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={values[field.key]}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, '')
                  setValues((current) => ({ ...current, [field.key]: digits }))
                }}
              />
            </label>
          ))}
        </div>
      </div>
    </Modal>
  )
}
