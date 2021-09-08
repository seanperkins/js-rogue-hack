import Entity from './Entity'
import {NotImplementedError} from './Errors'

export class Action {
  entity: Entity
  constructor(entity) {
    this.entity = entity
  }

  perform = (): void => {
    throw new NotImplementedError('Not implemented')
  }
}

export class ActionWithDirection extends Action {
  dx: number
  dy: number

  constructor(entity, dx, dy) {
    super(entity)
    this.dx = dx
    this.dy = dy
  }

  destXY = () => [this.entity.x + this.dx, this.entity.y + this.dy]

  blockingEntity = () => {}

  targetActor = () => {}

  perform = (): void => {
    throw new NotImplementedError('Not implemented')
  }
}

export class MovementAction extends ActionWithDirection {
  constructor(entity, dx, dy) {
    super(entity, dx, dy)
  }

  perform = () => {
    const [x, y] = this.destXY()

    // TODO: check if the destination is within the map
    // TODO: check if the destination is blocked
    // TODO: check if the destination is occupied by an actor

    this.entity.move(x, y)
    // TODO: Use better comparison to figure out if it is player
    if (this.entity.char === '@') {
      this.entity.levelMap().centerOn(x, y)
    }
  }
}
