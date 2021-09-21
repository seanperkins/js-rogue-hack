import {useEffect, useState} from 'react'
import {RNG} from 'rot-js'
import FallingCharacters from '../components/FallingCharacters'
import GlitchText from '../components/GlitchText'
import withDisplay from '../components/WithDisplay'
import {GREEN} from '../constants'
import {getRandomInt} from '../utilities/random'

function Terminal({display, clearDisplay, getCenter, getHalfSize}) {
  const [fallingLines, setFallingLines] = useState([])

  useEffect(() => {
    const fLines = []
    for (let index = 0; index < display.getOptions().width; index++) {
      const chance = RNG.getPercentage()
      if (chance >= 80) {
        fLines.push(
          <FallingCharacters
            key={index}
            x={index}
            y={0}
            fg={GREEN}
            maxHeight={display.getOptions().height}
            speed={getRandomInt(10) || 1}
          />,
        )
      }
    }

    setFallingLines(fLines)
  }, [])

  const text =
    'Welcome to the jungle. This should also work with longer strings.'
  const {width, height} = getHalfSize()
  const [x, y] = getCenter({width, height})
  const [textX, textY] = getCenter({
    width: text.length > width ? width - 2 : text.length,
    height: 1,
  })

  clearDisplay()
  return (
    <>
      {fallingLines}
      <GlitchText
        x={textX}
        y={textY}
        text={text}
        fg={'red'}
        maxWidth={width - 2}
      />
    </>
  )
}

export default withDisplay(Terminal)
