import { type CSSProperties } from 'react'
import { Button, IconButton } from '../components/Button'
import { ChevronDownIcon, InfoIcon, PaletteIcon, SlidersIcon } from '../components/Icons'
import type { SetupDraft } from '../domain/types'

interface SetupScreenProps {
  draft: SetupDraft
  onChange: (patch: Partial<SetupDraft>) => void
  onOpenScoreConfig: () => void
  onOpenVisualTheme: () => void
  onOpenAbout: () => void
  onOpenPlayers: () => void
  onOpenCategory: () => void
  onStart: () => void
}

export function SetupScreen({
  draft,
  onChange,
  onOpenScoreConfig,
  onOpenVisualTheme,
  onOpenAbout,
  onOpenPlayers,
  onOpenCategory,
  onStart,
}: SetupScreenProps) {
  function handleStart() {
    onStart()
  }

  const filledCount = draft.names.filter((name) => name.trim()).length

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
          <IconButton label="Sobre" onClick={onOpenAbout}>
            <InfoIcon />
          </IconButton>
        </div>
      </div>

      <div className="setup-section">
        <div className="row row--between">
          <div>
            <span className="field__label field__label--section">Jogadores</span>
            <p className="setup-section__summary">
              {filledCount} de {draft.names.length} participantes cadastrados
            </p>
          </div>
          <Button variant="ghost" onClick={onOpenPlayers}>
            EDITAR
          </Button>
        </div>
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

      <div className="setup-bottom">
        <Button block onClick={handleStart}>
          INICIAR PARTIDA
        </Button>

        <p className="hint hint--ok" aria-live="polite">
          {filledCount >= 3 ? `✓ ${filledCount} participantes prontos` : '⚠️ Cadastre pelo menos 3 participantes'}
        </p>
      </div>
    </div>
  )
}
