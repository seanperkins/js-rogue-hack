import {useEffect, useState} from 'react'
import {RNG} from 'rot-js'
import FallingCharacters from '../components/FallingCharacters'
import withDisplay from '../components/WithDisplay'
import {GREEN} from '../constants'
import {getRandomInt} from '../utilities/random'

function MatrixEffect({display}) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return fallingLines
}

export default withDisplay(MatrixEffect)
