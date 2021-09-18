import {createContext, Dispatch, SetStateAction, useState} from 'react'
import {GameState} from '../types'

interface IGameContext {
  game: GameState
  setGame: Dispatch<SetStateAction<GameState>>
}

const GameContext = createContext<IGameContext>({} as IGameContext)

export default GameContext

export function GameContextProvider({children}) {
  const [game, setGame] = useState<GameState>({
    state: 'menu',
  })
  return (
    <GameContext.Provider value={{game, setGame}}>
      {children}
    </GameContext.Provider>
  )
}
