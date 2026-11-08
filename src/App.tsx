import { useEffect, useState } from 'react'
import { AboutModal } from './components/AboutModal'
import { CategoryModal } from './components/CategoryModal'
import { EndGameDialog } from './components/EndGameDialog'
import { XIcon } from './components/Icons'
import { InstallHelpModal } from './components/InstallHelpModal'
import { PlayerNamesModal } from './components/PlayerNamesModal'
import { RecoveryDialog } from './components/RecoveryDialog'
import { ScoreConfigModal } from './components/ScoreConfigModal'
import { VisualThemeModal } from './components/VisualThemeModal'
import { validatePlayerNames } from './domain/engine'
import { shuffledAnimals } from './domain/animals'
import type { GameState, GuessMode, ScoreConfig, SetupDraft } from './domain/types'
import { FinishedScreen } from './screens/FinishedScreen'
import { GuessConfirmationScreen } from './screens/GuessConfirmationScreen'
import { GuessScreen } from './screens/GuessScreen'
import { ResultScreen } from './screens/ResultScreen'
import { RevealScreen } from './screens/RevealScreen'
import { RoundTransitionScreen } from './screens/RoundTransitionScreen'
import { ScoreScreen } from './screens/ScoreScreen'
import { SpeakingScreen } from './screens/SpeakingScreen'
import { LandingScreen, StartScreen } from './screens/StartScreen'
import { VotingScreen } from './screens/VotingScreen'
import { useGameState } from './state/useGameState'
import { useInstallPrompt } from './state/useInstallPrompt'
import { useSetupDraft } from './state/useSetupDraft'
import { loadGameHistory, recordGameHistory, type GameHistoryEntry } from './state/storage'
import { useVisualTheme } from './state/useVisualTheme'
import { useSeasonalTheme } from './state/useSeasonalTheme'
import { preloadSounds, playSound } from './utils/sound'

export default function App() {
  const { config: visualTheme, setConfig: setVisualTheme } = useVisualTheme()
  const seasonalTheme = useSeasonalTheme()
  const [draft, setDraft] = useSetupDraft()
  const {
    game,
    dispatch,
    recoveryPending,
    keepRecoveredGame,
    discardRecoveredGame,
    recoveredGameExpired,
  } = useGameState()
  const { isIos, installed, promptInstall } = useInstallPrompt()

  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const [scoreConfigOpen, setScoreConfigOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [installHelpOpen, setInstallHelpOpen] = useState(false)
  const [expiredNotice, setExpiredNotice] = useState(recoveredGameExpired)
  const [entered, setEntered] = useState(false)
  const [endGameOpen, setEndGameOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [history, setHistory] = useState<GameHistoryEntry[]>(loadGameHistory)

  useEffect(() => {
    preloadSounds()
  }, [])

  // Efeito de clique para todos os botões do app.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      if (!target.closest('button')) return
      playSound('clique')
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function updateDraft(patch: Partial<SetupDraft>) {
    setDraft((current) => {
      if (!patch.names) return { ...current, ...patch }
      const previousAnimals = new Map(current.names.map((name, index) => [name, current.animalIds[index]]))
      const usedAnimals = new Set<string>()
      const fallbackAnimals = shuffledAnimals(patch.names.length)
      const animalIds = patch.names.map((name, index) => {
        const existing = previousAnimals.get(name)
        if (existing && !usedAnimals.has(existing)) {
          usedAnimals.add(existing)
          return existing
        }
        const fallback = fallbackAnimals.find((animal) => !usedAnimals.has(animal)) ?? fallbackAnimals[index]
        usedAnimals.add(fallback)
        return fallback
      })
      return { ...current, ...patch, animalIds }
    })
  }

  function startGame(): boolean {
    const validation = validatePlayerNames(draft.names)
    if (!validation.ok) return false
    dispatch({
      type: 'START',
      names: validation.names,
      animalIds: draft.animalIds,
      theme: draft.theme,
      totalRounds: draft.rounds,
      scoreConfig: draft.scoreConfig,
      guessMode: draft.guessMode,
    })
    return true
  }

  function saveScoreConfig(scoreConfig: ScoreConfig, guessMode: GuessMode) {
    updateDraft({ scoreConfig, guessMode })
  }

  async function handleInstall() {
    if (isIos) {
      setInstallHelpOpen(true)
      return
    }
    const result = await promptInstall()
    if (result === 'unavailable') setInstallHelpOpen(true)
  }

  async function handleAboutInstall() {
    setAboutOpen(false)
    await handleInstall()
  }

  const activeGame = game !== null && game.phase !== 'FINISHED'

  const setupScreen = (
    <StartScreen
      draft={draft}
      hasSavedGame={activeGame}
      history={history}
      onChange={updateDraft}
      onOpenPlayers={() => setPlayersOpen(true)}
      onOpenCategory={() => setCategoryOpen(true)}
      onPlay={startGame}
      onOpenScoreConfig={() => setScoreConfigOpen(true)}
      onOpenVisualTheme={() => setThemeModalOpen(true)}
      onOpenAbout={() => setAboutOpen(true)}
    />
  )

  function renderScreen() {
    if (!game) return setupScreen

    switch (game.phase) {
      case 'REVEAL':
        return (
          <RevealScreen
            game={game}
            onReveal={(playerId) => dispatch({ type: 'REVEAL_PLAYER', playerId })}
            onEndGame={() => setEndGameOpen(true)}
          />
        )
      case 'SPEAKING':
        return <SpeakingScreen game={game} onReady={() => dispatch({ type: 'START_VOTING' })} />
      case 'VOTING':
        return (
          <VotingScreen
            game={game}
            onVote={(voterId, targetId) => dispatch({ type: 'CAST_VOTE', voterId, targetId })}
          />
        )
      case 'RESULT':
        return <ResultScreen game={game} onContinue={() => dispatch({ type: 'OPEN_GUESS' })} />
      case 'GUESS':
        return <GuessScreen game={game} onSubmit={(guess) => dispatch({ type: 'SUBMIT_GUESS', guess })} />
      case 'GUESS_CONFIRMATION':
        return (
          <GuessConfirmationScreen
            game={game}
            onConfirm={(accepted) => dispatch({ type: 'CONFIRM_GUESS', accepted })}
          />
        )
      case 'SCORE':
        return <ScoreScreen game={game} onNext={() => dispatch({ type: 'ADVANCE_FROM_SCORE' })} />
      case 'ROUND_TRANSITION':
        return (
          <RoundTransitionScreen
            players={game.players}
            currentRound={game.round}
            totalRounds={game.totalRounds}
            currentTheme={game.theme}
            onUpdatePlayers={(names) => dispatch({ type: 'UPDATE_PLAYERS', names })}
            onStartNextRound={(theme) => dispatch({ type: 'START_NEXT_ROUND', theme })}
          />
        )
      case 'FINISHED':
        return (
          <FinishedScreen
            game={game}
            onNewGame={() => {
              recordGameHistory(game)
              setHistory(loadGameHistory())
              dispatch({ type: 'RESET' })
              setEntered(false)
            }}
            onStartTiebreaker={() => dispatch({ type: 'START_TIEBREAKER' })}
          />
        )
      case 'SETUP':
      default:
        return setupScreen
    }
  }

  const screenKey = screenKeyFor(game)
  return (
    <div className="app" data-playing={entered && game ? 'true' : 'false'}>
      <div className="ambient" aria-hidden="true">
        <span className="ambient__orb ambient__orb--one" />
        <span className="ambient__orb ambient__orb--two" />
      </div>
      {seasonalTheme?.key === 'halloween' ? (
        <div className="seasonal-effects" aria-hidden="true">
          <span className="seasonal-effects__bat seasonal-effects__bat--one">🦇</span>
          <span className="seasonal-effects__bat seasonal-effects__bat--two">🦇</span>
          <span className="seasonal-effects__pumpkin">🎃</span>
        </div>
      ) : null}

      <div className="app-frame">
        {entered && expiredNotice ? (
          <div className="notice" role="status">
            <span>A partida anterior expirou após 24 horas.</span>
            <button
              type="button"
              className="notice__close"
              aria-label="Fechar aviso"
              onClick={() => setExpiredNotice(false)}
            >
              <XIcon size={16} />
            </button>
          </div>
        ) : null}

        <main className="app-card">
          <div className="screen-wrap" key={entered ? screenKey : 'start'}>
            {entered ? (
              renderScreen()
            ) : (
              <LandingScreen onPlay={() => setEntered(true)} />
            )}
          </div>
        </main>

      </div>

      {themeModalOpen ? (
        <VisualThemeModal
          config={visualTheme}
          onChange={setVisualTheme}
          onClose={() => setThemeModalOpen(false)}
        />
      ) : null}

      {scoreConfigOpen ? (
        <ScoreConfigModal
          config={draft.scoreConfig}
          guessMode={draft.guessMode}
          onSave={saveScoreConfig}
          onClose={() => setScoreConfigOpen(false)}
        />
      ) : null}

      {categoryOpen ? (
        <CategoryModal
          selectedTheme={draft.theme}
          onSelect={(theme) => updateDraft({ theme })}
          onClose={() => setCategoryOpen(false)}
        />
      ) : null}

      {installHelpOpen ? (
        <InstallHelpModal isIos={isIos} onClose={() => setInstallHelpOpen(false)} />
      ) : null}

      {aboutOpen ? (
        <AboutModal
          installed={installed}
          isIos={isIos}
          onInstall={handleAboutInstall}
          onClose={() => setAboutOpen(false)}
        />
      ) : null}

      {playersOpen ? (
        <PlayerNamesModal
          names={draft.names}
          onChange={updateDraft}
          onClose={() => setPlayersOpen(false)}
        />
      ) : null}

      {recoveryPending && entered && game ? (
        <RecoveryDialog onContinue={keepRecoveredGame} onDiscard={discardRecoveredGame} />
      ) : null}

      {endGameOpen ? (
        <EndGameDialog
          onClose={() => setEndGameOpen(false)}
          onConfirm={() => {
            setEndGameOpen(false)
            dispatch({ type: 'END_GAME' })
          }}
        />
      ) : null}
    </div>
  )
}

function screenKeyFor(game: GameState | null): string {
  if (!game) return 'setup'
  if (game.phase === 'REVEAL') return `reveal-${game.round}-${game.revealIndex}`
  if (game.phase === 'VOTING') {
    const votesCast = Object.keys(game.votes).length
    return `voting-${game.round}-${votesCast}`
  }
  return `${game.phase}-${game.round}`
}
