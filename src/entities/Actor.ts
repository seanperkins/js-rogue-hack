import {Entity} from '@entities'
import {RenderOrder} from '@constants'
import {BaseAI} from '@components'

export default class Actor extends Entity {
  ai?: BaseAI

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
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)

    this.ai = ai
  }

  get isAlive() {
    if (this.ai) return true
    return false
  }
}
