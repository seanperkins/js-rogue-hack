import {GREEN} from './constants/colors'
import {Actor} from './Entity'
import LevelMap from './LevelMap'

export default class Player extends Actor {
  constructor(x: number, y: number, parent: LevelMap) {
    super('@', GREEN, 'Player', x, y, parent)
  }
}
