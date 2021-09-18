import {CharacterProps, ShapeProps} from '../types'
import withDisplay from './WithDisplay'

type FillProps = ShapeProps & Partial<CharacterProps> & {fillDisplay: any}

function Fill({x, y, height, width, fg, bg, char, fillDisplay}: FillProps) {
  fillDisplay({x, y, width, height, fg, bg, char})
  return null
}
export default withDisplay(Fill)
