import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { Button, IconButton } from '../components/Button'
import { ChevronDownIcon, PaletteIcon, SlidersIcon } from '../components/Icons'
import { validatePlayerNames } from '../domain/engine'
import type { SetupDraft } from '../domain/types'
import { cx } from '../utils'

interface SetupScreenProps {
  draft: SetupDraft
  onChange: (patch: Partial<SetupDraft>) => void
  onOpenScoreConfig: () => void
  onOpenVisualTheme: () => void
  onOpenCategory: () => void
  onStart: () => void
}

export function SetupScreen({
  draft,
  onChange,
  onOpenScoreConfig,
  onOpenVisualTheme,
  onOpenCategory,
  onStart,
}: SetupScreenProps) {
  const [shake, setShake] = useState(false)
  const timer = useRef<number | null>(null)

  const summary = useMemo(() => {
    const trimmed = draft.names.map((name) => name.trim())
    const filled = trimmed.filter(Boolean)
    const validation = validatePlayerNames(draft.names)
    return {
      filledCount: filled.length,
      hasDuplicates: filled.length > new Set(filled).size,
      canStart: validation.ok,
    }
  }, [draft.names])

  function updateName(index: number, value: string) {
    const names = draft.names.map((name, currentIndex) => (currentIndex === index ? value : name))
    onChange({ names })
  }

  function handleStart() {
    if (!summary.canStart) {
      setShake(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setShake(false), 500)
      return
    }
    onStart()
  }

  return (
    <div className="screen screen--setup">
      <div className="screen-head">
        <div>
          <h2 className="screen-title">Vamos jogar!</h2>
          <p className="screen-sub">Cadastre de 3 a 12 participantes</p>
        </div>
        <div className="head-actions">
          <IconButton label="Configurações da partida" onClick={onOpenScoreConfig}>
            <SlidersIcon />
          </IconButton>
          <IconButton label="Tema visual" onClick={onOpenVisualTheme}>
            <PaletteIcon />
          </IconButton>
        </div>
      </div>

      <div className="player-list scroll-area">
        {draft.names.map((name, index) => (
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
          disabled={draft.names.length <= 3}
          onClick={() => onChange({ names: draft.names.slice(0, -1) })}
        >
          − Remover
        </Button>
        <Button
          variant="ghost"
          disabled={draft.names.length >= 12}
          onClick={() => onChange({ names: [...draft.names, ''] })}
        >
          ＋ Adicionar
        </Button>
      </div>

      <div className="section">
        <span className="field__label field__label--section">Tema das Palavras</span>
        <button type="button" className="selector" onClick={onOpenCategory}>
          <span className="selector__value">{draft.theme}</span>
          <span className="selector__action">
            Alterar <ChevronDownIcon size={16} />
          </span>
        </button>
      </div>

      <div className="section">
        <div className="row row--between">
          <span className="field__label field__label--section">
            Rodadas completas: {draft.rounds}
          </span>
          <span className="chip">{draft.rounds}x</span>
        </div>
        <input
          className="range"
          type="range"
          min={1}
          max={20}
          step={1}
          value={draft.rounds}
          onChange={(event) => onChange({ rounds: Number(event.target.value) })}
          aria-label="Número de rodadas completas"
          style={
            {
              '--range-progress': `${((draft.rounds - 1) / 19) * 100}%`,
            } as CSSProperties
          }
        />
        <div className="range-scale">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <div className={cx('setup-bottom', shake && 'shake')}>
        <Button block onClick={handleStart}>
          INICIAR PARTIDA
        </Button>

        <p
          className={cx(
            'hint',
            !summary.canStart && 'hint--error',
            summary.canStart && 'hint--ok',
          )}
          aria-live="polite"
        >
          {summary.filledCount < 3
            ? `⚠️ Preencha pelo menos 3 participantes (${summary.filledCount}/3)`
            : summary.hasDuplicates
              ? '⚠️ Não repita nomes de jogadores!'
              : `✓ ${summary.filledCount} participantes prontos`}
        </p>
      </div>
    </div>
  )
}
