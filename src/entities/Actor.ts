import {Entity} from '@entities'
import {RenderOrder} from '@constants'
import {BaseAI} from '@components'

export default class Actor extends Entity {
  ai?: BaseAI
  speed: number

  constructor(
    char,
    color,
    name,
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.ACTOR,
    ai,
    speed?: number,
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)

    this.ai = ai
    this.speed = speed || 10
  }

  getSpeed = () => this.speed

  get isAlive() {
    if (this.ai) return true
    return false
  }
}
