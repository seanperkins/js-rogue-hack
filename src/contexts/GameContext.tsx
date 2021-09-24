import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {GameState} from '../types'
import {
  clearStorage,
  loadFromStorage,
  saveToStorage,
} from '../utilities/storage'

interface IGameContext {
  game: GameState
  setGame: Dispatch<SetStateAction<GameState>>
  newGame: () => void
  continueGame: () => void
}

const GameContext = createContext<IGameContext>({} as IGameContext)

export default GameContext

export function GameContextProvider({children}) {
  const [game, setGame] = useState<GameState>({
    state: 'menu',
  })

  function continueGame() {
    const gameData = loadFromStorage('game')
    setGame({...game, ...gameData})
  }

  function newGame() {
    clearStorage()
    setGame({...game, state: 'terminal'})
  }

  useEffect(() => {
    if (game.state !== 'menu') {
      saveToStorage('game', game)
    }
  }, [game])

  return (
    <GameContext.Provider value={{game, setGame, continueGame, newGame}}>
      {children}
    </GameContext.Provider>
  )
}
