import {useContext} from 'react'
import Button from '../components/Button'
import Window from '../components/DisplayWindow'
import withDisplay from '../components/WithDisplay'
import GameContext from '../contexts/GameContext'

const height = 20
const width = 20

function Menu({getCenter, clearDisplay}) {
  const {game, setGame} = useContext(GameContext)
  clearDisplay()

  const buttons = [
    {
      label: 'New Game',
      onClick: () => {
        setGame({...game, state: 'terminal'})
      },
    },
    {
      label: 'Load Game',
      onClick: () => {
        console.log('Load Game')
      },
    },
  ]

  const [x, y] = getCenter({width, height})

  return (
    <Window
      x={x}
      y={y}
      width={width}
      height={height}
      title="Main Menu"
      shadow={true}
    >
      {buttons.map((button, i) => (
        <Button
          key={button.label}
          text={button.label}
          x={1}
          y={i * 2 + 1}
          onClick={button.onClick}
        />
      ))}
    </Window>
  )
}

export default withDisplay(Menu)
