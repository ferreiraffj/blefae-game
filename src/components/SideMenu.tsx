import type { ReactNode } from 'react'
import { cx } from '../utils'
import { InfoIcon, MenuIcon, PaletteIcon, SlidersIcon, XIcon } from './Icons'

interface SideMenuProps {
  expanded: boolean
  onToggle: () => void
  onOpenTheme: () => void
  onOpenScoreConfig: () => void
  onOpenAbout: () => void
}

interface MenuItemProps {
  label: string
  description: string
  icon: ReactNode
  onClick: () => void
}

function MenuItem({ label, description, icon, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      className="side-menu__item"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <span className="side-menu__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="side-menu__copy">
        <span className="side-menu__label">{label}</span>
        <span className="side-menu__description">{description}</span>
      </span>
    </button>
  )
}

/**
 * Menu lateral do app. Recolhido mostra só os ícones; expandido mostra a
 * descrição de cada item e desfoca o restante da tela.
 */
export function SideMenu({
  expanded,
  onToggle,
  onOpenTheme,
  onOpenScoreConfig,
  onOpenAbout,
}: SideMenuProps) {
  return (
    <nav
      id="side-menu"
      className={cx('side-menu', expanded && 'side-menu--expanded')}
      aria-label="Menu do app"
    >
      <button
        type="button"
        className="side-menu__toggle"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls="side-menu"
        aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
        title={expanded ? 'Recolher menu' : 'Expandir menu'}
      >
        <span className="side-menu__icon" aria-hidden="true">
          {expanded ? <XIcon size={19} /> : <MenuIcon size={19} />}
        </span>
        <span className="side-menu__copy">
          <span className="side-menu__label">Fechar</span>
        </span>
      </button>

      <span className="side-menu__divider" aria-hidden="true" />

      <MenuItem
        label="Tema"
        description="Cores e animações"
        icon={<PaletteIcon size={19} />}
        onClick={onOpenTheme}
      />
      <MenuItem
        label="Partida"
        description="Regras e pontuação"
        icon={<SlidersIcon size={19} />}
        onClick={onOpenScoreConfig}
      />
      <MenuItem
        label="Sobre"
        description="Versão e instalação"
        icon={<InfoIcon size={19} />}
        onClick={onOpenAbout}
      />
    </nav>
  )
}
