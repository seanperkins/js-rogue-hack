import React, {useState} from 'react'
import {LIGHT_GREEN, BLACK} from '../constants'
import {generateMatrix} from '../utilities/matrix'
import {getRandomInt, randomCharCode} from '../utilities/random'
import useInterval from '../utilities/useInterval'
import withDisplay from './WithDisplay'

function GlitchPanel({x, y, height, width, drawMatrix, children}) {
  const [matrix, setMatrix] = useState(generateMatrix(width, height, {}))
  const [iteration, setIteration] = useState(0)
  useInterval(() => {
    setMatrix(iterateMatrix(matrix, iteration))
    setIteration(iteration + 1)
  }, 500)

  drawMatrix({matrix, x, y})
  return (
    children &&
    React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        iteration, // Causes the child to rerender forcing it above this panel
      })
    })
  )
}

export default withDisplay(GlitchPanel)

function iterateMatrix(matrix: any[][], iteration: number) {
  if (!matrix) return
  const newMatrix = matrix.map((row) => row.map((cell) => cell))
  newMatrix.forEach((row, y) => {
    if (y >= iteration) return
    row.forEach((cell, x) => {
      const chance = getRandomInt(100)
      if (chance < 2) return
      newMatrix[y][x] = {
        char: randomCharCode(),
        fg: LIGHT_GREEN,
        bg: BLACK,
      }
    })
  })
  return newMatrix
}
