import Button from './Button'
import Window from './DisplayWindow'
import withDisplay from './WithDisplay'

const height = 20
const width = 20

const buttons = [
  {
    label: 'New Game',
    onClick: () => {
      console.log('New Game')
    },
  },
  {
    label: 'Load Game',
    onClick: () => {
      console.log('Load Game')
    },
  },
]

function Menu({getCenter, clearDisplay}) {
  clearDisplay()
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
