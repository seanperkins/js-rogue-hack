import {useContext} from 'react'
import GameContext from '../contexts/GameContext'
import Menu from './Menu'
import withDisplay from './WithDisplay'

function Main({display}) {
  const {game} = useContext(GameContext)
  if (!display) return null
  switch (game.state) {
    case 'menu': {
      return <Menu />
    }

    default:
      return null
  }
}

export default withDisplay(Main)
