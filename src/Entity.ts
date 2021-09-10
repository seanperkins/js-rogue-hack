import {cloneDeep} from 'lodash'

import {BLACK} from './constants/colors'
import RenderOrder from './constants/renderOrder'
import LevelMap from './LevelMap'

export default class Entity {
  char: string
  color: string
  name: string
  x?: number
  y?: number
  parent?: LevelMap
  blocksMovement?: boolean
  renderOrder?: RenderOrder

  constructor(
    char = '?',
    color = BLACK,
    name = '<Unnamed>',
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.CORPSE,
  ) {
    this.x = x
    this.y = y
    this.char = char
    this.color = color
    this.name = name
    this.blocksMovement = blocksMovement
    this.renderOrder = renderOrder

    if (parent) {
      this.parent = parent
      parent.addEntity(this)
    }
  }

  get levelMap() {
    return this.parent.levelMap
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
}

export class Actor extends Entity {
  ai: any

  constructor(
    char,
    color,
    name,
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.ACTOR,
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)
  }

  get isAlive() {
    if (this.ai) return true
    return false
  }
}
