import {cloneDeep} from 'lodash'

import {BLACK} from '../../constants'
import {RenderOrder} from '../../constants'
import LevelMap from '../LevelMap'

export default class Entity {
  char: string
  color: string
  name: string
  x?: number
  y?: number
  parent?: LevelMap
  blocksMovement?: boolean
  renderOrder?: RenderOrder
  faction: string

  constructor(
    char = '?',
    color = BLACK,
    name = '<Unnamed>',
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.CORPSE,
    faction = 'neutral',
  ) {
    this.x = x
    this.y = y
    this.char = char
    this.color = color
    this.name = name
    this.blocksMovement = blocksMovement
    this.renderOrder = renderOrder
    this.faction = faction

    if (parent) {
      this.parent = parent
      parent.addEntity(this)
    }
  }

  get levelMap() {
    return this.parent.levelMap
  }

  get belongsToPlayerFaction() {
    return this.faction === 'player'
  }

  spawn(x: number, y: number, levelMap: LevelMap) {
    const clone = cloneDeep(this)
    clone.x = x
    clone.y = y
    clone.parent = levelMap
    levelMap.addEntity(clone)
    return clone
  }

  place(x: number, y: number, levelMap: LevelMap) {
    this.x = x
    this.y = y
    if (levelMap) {
      if (this.parent && this.parent instanceof LevelMap) {
        this.parent.removeEntity(this) // Remove from old map
      }
      this.parent = levelMap
      levelMap.addEntity(this)
    }
  }

  distance(x: number, y: number) {
    return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2)
  }

  move(dx: number, dy: number) {
    this.x = dx
    this.y = dy
  }

  getClosestPlayerActor() {
    return this.levelMap.getClosestPlayerActor(this.x, this.y)
  }
}
