import type { CSSProperties } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import {
  ACCENTS,
  type ThemeMode,
  type VisualThemeConfig,
  accentByKey,
} from '../domain/types'
import { cx } from '../utils'

interface VisualThemeModalProps {
  config: VisualThemeConfig
  onChange: (config: VisualThemeConfig) => void
  onClose: () => void
}

const MODES: Array<{ key: ThemeMode; label: string }> = [
  { key: 'auto', label: 'Auto' },
  { key: 'light', label: 'Claro' },
  { key: 'dark', label: 'Escuro' },
]

export function VisualThemeModal({ config, onChange, onClose }: VisualThemeModalProps) {
  const currentAccent = accentByKey(config.accent)

  return (
    <Modal
      title="Temas"
      subtitle="Personalize o estilo visual do jogo."
      onClose={onClose}
      className="modal--theme"
      footer={
        <Button block onClick={onClose}>
          APLICAR E FECHAR
        </Button>
      }
    >
      <div className="segmented" role="group" aria-label="Modo de tema">
        {MODES.map((mode) => {
          const selected = config.mode === mode.key
          return (
            <button
              key={mode.key}
              type="button"
              className={cx('segmented__item', selected && 'segmented__item--selected')}
              aria-pressed={selected}
              onClick={() => onChange({ ...config, mode: mode.key })}
            >
              {mode.label}
            </button>
          )
        })}
      </div>

      <div className="theme-field">
        <div className="theme-field__head">
          <span className="theme-field__label">Cor de destaque (Accent color)</span>
          <span className="theme-field__value">{currentAccent.label}</span>
        </div>
        <div className="accents">
          {ACCENTS.map((accent) => {
            const selected = config.accent === accent.key
            return (
              <button
                key={accent.key}
                type="button"
                className={cx('swatch', selected && 'swatch--selected')}
                style={{ '--swatch': accent.hex } as CSSProperties}
                aria-label={accent.label}
                aria-pressed={selected}
                title={accent.label}
                onClick={() => onChange({ ...config, accent: accent.key })}
              >
                <span className="swatch__dot" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="theme-field">
        <div className="theme-field__head">
          <span className="theme-field__label">Arredondamento dos cards</span>
          <span className="theme-field__value">{config.cornerRadius} px</span>
        </div>
        <input
          className="range"
          type="range"
          min={8}
          max={28}
          step={2}
          value={config.cornerRadius}
          onChange={(event) => onChange({ ...config, cornerRadius: Number(event.target.value) })}
          aria-label="Arredondamento dos cards"
          style={
            {
              '--range-progress': `${((config.cornerRadius - 8) / 20) * 100}%`,
            } as CSSProperties
          }
        />
      </div>

      <div className="toggle-row">
        <div className="toggle-row__copy">
          <span className="toggle-row__title">Animações fluidas</span>
          <span className="toggle-row__subtitle">Efeitos visuais nas fases e pontuação</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.smoothAnimations}
          aria-label="Animações fluidas"
          className={cx('switch', config.smoothAnimations && 'switch--on')}
          onClick={() => onChange({ ...config, smoothAnimations: !config.smoothAnimations })}
        >
          <span className="switch__thumb" />
        </button>
      </div>
    </Modal>
  )
}
