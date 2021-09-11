import {LIGHT_GREEN} from './constants/colors'
import {Actor} from './Entity'
import LevelMap from './LevelMap'

export default class Player extends Actor {
  constructor(x: number, y: number, parent: LevelMap) {
    super('@', LIGHT_GREEN, 'Player', x, y, parent)
  }
}
