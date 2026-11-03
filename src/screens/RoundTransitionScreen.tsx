import { useState } from 'react'
import { Button } from '../components/Button'
import { CategoryModal } from '../components/CategoryModal'
import { ChevronDownIcon } from '../components/Icons'

interface RoundTransitionScreenProps {
  currentRound: number
  totalRounds: number
  currentTheme: string
  onStartNextRound: (theme: string) => void
}

export function RoundTransitionScreen({
  currentRound,
  totalRounds,
  currentTheme,
  onStartNextRound,
}: RoundTransitionScreenProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [categoryOpen, setCategoryOpen] = useState(false)

  return (
    <div className="screen screen--between">
      <p className="eyebrow">TRANSIÇÃO DE RODADA</p>

      <div className="transition">
        <h2 className="screen-title">Próxima: Rodada {currentRound + 1} de {totalRounds}</h2>

        <div className="panel transition__card">
          <span className="muted">Tema selecionado:</span>
          <span className="transition__theme">{selectedTheme}</span>
          <Button variant="ghost" onClick={() => setCategoryOpen(true)}>
            Trocar de Tema <ChevronDownIcon size={16} />
          </Button>
        </div>

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
    </div>
  )
}
