import { useState } from 'react'
import { AnimalAvatar } from '../components/AnimalAvatar'
import { Button, IconButton } from '../components/Button'
import {
  CategoryIcon,
  CheckIcon,
  HistoryIcon,
  HomeIcon,
  MinusIcon,
  PlusIcon,
  BookIcon,
  MenuIcon,
  PaletteIcon,
  UsersIcon,
} from '../components/Icons'
import { Modal } from '../components/Modal'
import { Badge, Card } from '../components/Primitives'
import type { SetupDraft } from '../domain/types'
import { animalForIndex } from '../domain/animals'
import { themeWordCount } from '../domain/words'
import type { GameHistoryEntry } from '../state/storage'

interface StartScreenProps {
  draft: SetupDraft
  hasSavedGame: boolean
  onChange: (patch: Partial<SetupDraft>) => void
  onOpenPlayers: () => void
  onOpenCategory: () => void
  onPlay: () => void
  history: GameHistoryEntry[]
  onOpenScoreConfig: () => void
  onOpenVisualTheme: () => void
  onOpenAbout: () => void
}

type StartTab = 'home' | 'decks' | 'history' | 'rules'

export function StartScreen({
  draft,
  hasSavedGame,
  onChange,
  onOpenPlayers,
  onOpenCategory,
  onPlay,
  history,
  onOpenScoreConfig,
  onOpenVisualTheme,
  onOpenAbout,
}: StartScreenProps) {
  const [activeTab, setActiveTab] = useState<StartTab>('home')
  const filledCount = draft.names.filter((name) => name.trim()).length
  const [historyOpen, setHistoryOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(tab: StartTab) {
    setActiveTab(tab)
    if (tab === 'decks') onOpenCategory()
    if (tab === 'history') setHistoryOpen(true)
  }

  return (
    <div className="screen start start--lobby">
      <header className="start__header">
        <div className="start__brand">
          <img src="/brand/logo-wordmark.png" alt="" aria-hidden="true" />
          <strong>Blefaê</strong>
        </div>
        <div className="start__menu-label">
          <span>Menu</span>
          <IconButton label="Menu" className="start__menu-button" onClick={() => setMenuOpen(true)}>
            <MenuIcon size={18} />
          </IconButton>
        </div>
      </header>

      <main className="start__lobby-content">
        <Card className="lobby-card lobby-card--players">
          <div className="lobby-card__heading">
            <div className="lobby-card__title">
              <span className="lobby-card__icon lobby-card__icon--purple"><UsersIcon size={18} /></span>
              <div>
                <h1>Jogadores</h1>
                <p>{filledCount} suspeitos prontos</p>
              </div>
            </div>
            <Button variant="ghost" className="lobby-card__add" onClick={onOpenPlayers}>
              <PlusIcon size={15} /> Adicionar
            </Button>
          </div>
          <div className="player-preview">
            {draft.names.map((name, index) => (
              <button type="button" className="player-preview__item" key={`${name}-${index}`} onClick={onOpenPlayers}>
                <span className={`player-preview__avatar player-preview__avatar--${index % 4}`}>
                  <AnimalAvatar animalId={draft.animalIds[index] ?? animalForIndex(index)} size="md" />
                  {index === 0 ? <span className="player-preview__leader">♛</span> : null}
                  <span className="player-preview__ready"><CheckIcon size={10} /></span>
                </span>
                <strong>{name || `Jogador ${index + 1}`}</strong>
                <small>{index === 0 ? 'Líder' : 'Pronto'}</small>
              </button>
            ))}
          </div>
        </Card>

        <Card className="lobby-card lobby-card--deck">
          <div className="lobby-card__heading">
            <div className="lobby-card__title">
              <span className="lobby-card__icon lobby-card__icon--yellow">⚑</span>
              <h2>Baralho Ativo</h2>
            </div>
            <Button variant="ghost" className="lobby-card__add" onClick={onOpenCategory}>
              <PaletteIcon size={14} /> Trocar Tema
            </Button>
          </div>
          <button type="button" className="active-deck" onClick={onOpenCategory}>
            <div>
              <Badge tone="warning">♨ MAIS POPULAR</Badge>
              <strong>{draft.theme}</strong>
              <span>▣ &nbsp;{themeWordCount(draft.theme)} palavras disponíveis</span>
            </div>
            <CategoryIcon size={28} />
          </button>
        </Card>

        <Card className="lobby-card lobby-card--rounds">
          <div className="lobby-card__heading">
            <div className="lobby-card__title">
              <span className="lobby-card__icon lobby-card__icon--coral">◷</span>
              <h2>Número de Rodadas</h2>
            </div>
            <Badge tone="neutral">~ {Math.max(1, draft.rounds * 4)} min</Badge>
          </div>
          <div className="round-control">
            <IconButton label="Diminuir rodadas" onClick={() => onChange({ rounds: Math.max(1, draft.rounds - 1) })}>
              <MinusIcon />
            </IconButton>
            <div><strong>{draft.rounds}</strong><span>rodadas completas</span></div>
            <IconButton label="Aumentar rodadas" onClick={() => onChange({ rounds: Math.min(20, draft.rounds + 1) })}>
              <PlusIcon />
            </IconButton>
          </div>
          <div className="round-presets">
            {[1, 3, 5].map((rounds) => (
              <button
                type="button"
                key={rounds}
                className={draft.rounds === rounds ? 'is-selected' : ''}
                onClick={() => onChange({ rounds })}
              >
                {rounds} {rounds === 1 ? 'Rodada' : 'Rodadas'}
                {rounds === 1 ? ' (Rápida)' : rounds === 3 ? '' : ' (Épica)'}
              </button>
            ))}
          </div>
        </Card>

        <div className="start__ready">
          <Badge tone="success"><CheckIcon size={15} /> Tudo pronto para a diversão!</Badge>
          {hasSavedGame ? <span>Partida salva neste dispositivo</span> : null}
        </div>
        <Button block onClick={onPlay} className="start__play">
          <span aria-hidden="true">▷</span> INICIAR PARTIDA
        </Button>
      </main>

      <nav className="start__bottom-nav" aria-label="Navegação principal">
        <button type="button" className={activeTab === 'home' ? 'is-active' : ''} onClick={() => navigate('home')}>
          <HomeIcon size={18} /><span>Início</span>
        </button>
        <button type="button" className={activeTab === 'decks' ? 'is-active' : ''} onClick={() => navigate('decks')}>
          <CategoryIcon size={18} /><span>Baralhos</span>
        </button>
        <button type="button" className={activeTab === 'history' ? 'is-active' : ''} onClick={() => navigate('history')}>
          <HistoryIcon size={18} /><span>Histórico</span>
        </button>
        <button type="button" className={activeTab === 'rules' ? 'is-active' : ''} onClick={() => navigate('rules')}>
          <BookIcon size={18} /><span>Regras</span>
        </button>
      </nav>

      {activeTab === 'rules' ? (
        <RulesModal onClose={() => setActiveTab('home')} />
      ) : null}
      {historyOpen ? (
        <Modal title="Histórico de partidas" subtitle="Suas partidas ficam neste dispositivo." onClose={() => setHistoryOpen(false)}>
          {history.length === 0 ? (
            <div className="start__empty-history">
              <HistoryIcon size={28} />
              <strong>Nenhuma partida finalizada ainda</strong>
              <p>Depois da sua primeira partida, os resultados aparecerão aqui.</p>
            </div>
          ) : (
            <div className="start__history-list">
              {history.map((entry) => (
                <div className="start__history-item" key={entry.id}>
                  <HistoryIcon size={18} />
                  <div>
                    <strong>{entry.playerNames.join(', ')}</strong>
                    <span>{entry.rounds} rodadas · {new Date(entry.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      ) : null}
      {menuOpen ? (
        <div className="start-menu-layer" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false)
        }}>
          <aside className="start-menu" role="dialog" aria-label="Menu do Blefaê">
            <div className="start-menu__header">
              <strong>Menu</strong>
              <IconButton label="Fechar menu" onClick={() => setMenuOpen(false)}>×</IconButton>
            </div>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenScoreConfig() }}>
              <span>⚙</span><strong>Configuração da partida</strong><small>Pontuação e modo de palpite</small>
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenVisualTheme() }}>
              <span>◉</span><strong>Tema visual</strong><small>Cores e aparência do app</small>
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenAbout() }}>
              <span>ⓘ</span><strong>Sobre</strong><small>Informações e instalação</small>
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  )
}

interface LandingScreenProps {
  onPlay: () => void
}

export function LandingScreen({ onPlay }: LandingScreenProps) {
  return (
    <div className="screen start start--landing">
      <img className="start__landing-logo" src="/brand/logo-wordmark.png" alt="Blefaê" />
      <Badge tone="warning">1 CELULAR · MULTIPLAYER</Badge>
      <div className="start__landing-copy">
        <h1>Descubra quem está blefando!</h1>
        <p>Um jogo de dedução social para jogar em grupo com um único celular.</p>
      </div>
      <Button block onClick={onPlay} className="start__play">
        ▷ JOGAR AGORA
      </Button>
      <p className="start__landing-hint">Passe o celular e descubra o impostor.</p>
    </div>
  )
}

function RulesModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Como funciona?"
      subtitle="Uma rodada rápida, muita desconfiança."
      onClose={onClose}
      footer={<Button block onClick={onClose}>ENTENDI, VAMOS LÁ!</Button>}
    >
      <div className="start__rules">
        <div><Badge tone="accent">1</Badge><p>Passe o celular de mão em mão. Cada jogador vê sua palavra secreta.</p></div>
        <div><Badge tone="danger">2</Badge><p>Um de vocês é o <strong>impostor</strong> e não sabe a palavra, apenas finge.</p></div>
        <div><Badge tone="warning">3</Badge><p>Façam suas dicas e votem no suspeito antes que ele descubra a palavra.</p></div>
      </div>
    </Modal>
  )
}
