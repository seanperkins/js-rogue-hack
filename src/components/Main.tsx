import {useContext} from 'react'
import GameContext from '../contexts/GameContext'
import Menu from '../screens/Menu'
import Terminal from '../screens/Terminal'
import withDisplay from './WithDisplay'

function Main({display}) {
  const {game} = useContext(GameContext)
  if (!display) return null
  switch (game.state) {
    case 'menu': {
      return <Menu />
    }
    case 'terminal': {
      return <Terminal />
    }
    default:
      return null
  }
}

export default withDisplay(Main)
