import { Modal } from './Modal'
import { CheckIcon } from './Icons'
import { Button } from './Button'
import { THEMES, themeWordCount } from '../domain/words'
import { cx } from '../utils'

interface CategoryModalProps {
  selectedTheme: string
  onSelect: (theme: string) => void
  onClose: () => void
}

export function CategoryModal({ selectedTheme, onSelect, onClose }: CategoryModalProps) {
  return (
    <Modal
      title="Categorias de Palavras"
      subtitle="Escolha o tema das palavras da partida"
      onClose={onClose}
      className="modal--tall"
      bodyClassName="modal__body--flush"
      footer={
        <Button block onClick={onClose}>
          FECHAR
        </Button>
      }
    >
      <div className="category-list">
        {THEMES.map((theme) => {
          const selected = selectedTheme === theme
          return (
            <button
              key={theme}
              type="button"
              className={cx('category-item', selected && 'category-item--selected')}
              onClick={() => {
                onSelect(theme)
                onClose()
              }}
              aria-pressed={selected}
            >
              <span className="category-item__copy">
                <span className="category-item__name">{theme}</span>
                <span className="category-item__count">{themeWordCount(theme)} palavras</span>
              </span>
              {selected ? (
                <span className="category-item__check" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
