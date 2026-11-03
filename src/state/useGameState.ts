import { useEffect, useReducer, useState } from 'react'
import { gameReducer } from './gameReducer'
import { loadGame, persistGame } from './storage'

export function useGameState() {
  const [initial] = useState(loadGame)
  const [game, dispatch] = useReducer(gameReducer, initial.game)
  const [recoveryPending, setRecoveryPending] = useState(
    initial.game !== null && initial.game.phase !== 'FINISHED',
  )

  useEffect(() => {
    persistGame(game)
  }, [game])

  return {
    game,
    dispatch,
    recoveryPending,
    /** Mantém a partida carregada e fecha o diálogo de recuperação. */
    keepRecoveredGame: () => setRecoveryPending(false),
    /** Descarta a partida recuperada e volta para a tela inicial. */
    discardRecoveredGame: () => {
      dispatch({ type: 'RESET' })
      setRecoveryPending(false)
    },
    /** A partida anterior expirou (mais de 24h): usada para um aviso discreto. */
    recoveredGameExpired: initial.expired,
  }
}
