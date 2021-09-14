import {LIGHT_GREEN, RenderOrder} from '@constants'
import {Actor} from './'
import LevelMap from '../screens/LevelMap'
import {HostileEnemy} from '@components'

export default class Player extends Actor {
  constructor(x: number, y: number, parent: LevelMap) {
    super(
      '@',
      LIGHT_GREEN,
      'Player',
      x,
      y,
      parent,
      true,
      RenderOrder.ACTOR,
      HostileEnemy,
    )
  }
}
