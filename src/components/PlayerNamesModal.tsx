import { Modal } from './Modal'
import { Button } from './Button'
import { validatePlayerNames } from '../domain/engine'
import type { SetupDraft } from '../domain/types'
import { cx } from '../utils'

interface PlayerNamesModalProps {
  names: SetupDraft['names']
  onChange: (patch: Partial<SetupDraft>) => void
  onClose: () => void
}

export function PlayerNamesModal({ names, onChange, onClose }: PlayerNamesModalProps) {
  const validation = validatePlayerNames(names)
  const filledCount = names.filter((name) => name.trim()).length
  const hasDuplicates =
    filledCount > new Set(names.map((name) => name.trim()).filter(Boolean)).size

  function updateName(index: number, value: string) {
    onChange({
      names: names.map((name, currentIndex) => (currentIndex === index ? value : name)),
    })
  }

  return (
    <Modal
      title="Cadastrar jogadores"
      subtitle="Adicione de 3 a 12 participantes"
      onClose={onClose}
      className="modal--players"
      footer={
        <Button block onClick={onClose}>
          CONCLUIR
        </Button>
      }
    >
      <div className="player-modal__list scroll-area">
        {names.map((name, index) => (
          <label className="player-field" key={index}>
            <span className="player-field__index" aria-hidden="true">
              {index + 1}
            </span>
            <span className="player-field__body">
              <span className="field__label">Jogador {index + 1}</span>
              <input
                className="input"
                value={name}
                onChange={(event) => updateName(index, event.target.value)}
                placeholder={`Nome do jogador ${index + 1}`}
                maxLength={24}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
              />
            </span>
          </label>
        ))}
      </div>

      <div className="row row--2">
        <Button
          variant="ghost"
          disabled={names.length <= 3}
          onClick={() => onChange({ names: names.slice(0, -1) })}
        >
          − Remover
        </Button>
        <Button
          variant="ghost"
          disabled={names.length >= 12}
          onClick={() => onChange({ names: [...names, ''] })}
        >
          ＋ Adicionar
        </Button>
      </div>

      <p
        className={cx(
          'hint',
          !validation.ok && 'hint--error',
          validation.ok && 'hint--ok',
        )}
        aria-live="polite"
      >
        {filledCount < 3
          ? `⚠️ Preencha pelo menos 3 participantes (${filledCount}/3)`
          : hasDuplicates
            ? '⚠️ Não repita nomes de jogadores!'
            : `✓ ${filledCount} participantes prontos`}
      </p>
    </Modal>
  )
}
