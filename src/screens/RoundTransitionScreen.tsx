import { useState } from 'react'
import { Button } from '../components/Button'
import { Badge, Card } from '../components/Primitives'
import { CategoryModal } from '../components/CategoryModal'
import { ChevronDownIcon } from '../components/Icons'
import { PlayerNamesModal } from '../components/PlayerNamesModal'
import type { Player, SetupDraft } from '../domain/types'

interface RoundTransitionScreenProps {
  players: Player[]
  currentRound: number
  totalRounds: number
  currentTheme: string
  onUpdatePlayers: (names: string[]) => void
  onStartNextRound: (theme: string) => void
}

export function RoundTransitionScreen({
  players,
  currentRound,
  totalRounds,
  currentTheme,
  onUpdatePlayers,
  onStartNextRound,
}: RoundTransitionScreenProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [names, setNames] = useState<SetupDraft['names']>(() => players.map((player) => player.name))

  function updateNames(patch: Partial<SetupDraft>) {
    if (patch.names) setNames(patch.names)
  }

  return (
    <div className="screen screen--between">
      <Badge tone="success">TRANSIÇÃO DE RODADA</Badge>

      <div className="transition">
        <h2 className="screen-title">Próxima: Rodada {currentRound + 1} de {totalRounds}</h2>

        <Card className="transition__card">
          <span className="muted">Tema selecionado:</span>
          <span className="transition__theme">{selectedTheme}</span>
          <Button variant="ghost" onClick={() => setCategoryOpen(true)}>
            Trocar de Tema <ChevronDownIcon size={16} />
          </Button>
        </Card>

        <Card className="transition__card">
          <span className="muted">Jogadores:</span>
          <span className="transition__theme">{players.length} participantes</span>
          <Button variant="ghost" onClick={() => setPlayersOpen(true)}>
            Editar jogadores
          </Button>
        </Card>

        <p className="muted transition__help">
          Você pode manter o mesmo tema ou escolher outro para a rodada.
        </p>
      </div>

      <Button block onClick={() => onStartNextRound(selectedTheme)}>
        COMEÇAR RODADA {currentRound + 1}
      </Button>

      {categoryOpen ? (
        <CategoryModal
          selectedTheme={selectedTheme}
          onSelect={setSelectedTheme}
          onClose={() => setCategoryOpen(false)}
        />
      ) : null}

      {playersOpen ? (
        <PlayerNamesModal
          names={names}
          onChange={updateNames}
          onClose={() => setPlayersOpen(false)}
          onSave={() => {
            onUpdatePlayers(names)
            setPlayersOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
