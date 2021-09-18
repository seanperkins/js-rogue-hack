import Entity from './entities/Entity'
import {ImpossibleError, NotImplementedError} from './Errors'

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

  get destXY() {
    return [this.entity.x + this.dx, this.entity.y + this.dy]
  }

  blockingEntity = () => {
    const [x, y] = this.destXY
    return this.entity.levelMap.getBlockingEntityAtLocation(x, y)
  }

  targetActor = () => {
    const [x, y] = this.destXY
    return this.entity.levelMap.getActorAtLocation(x, y)
  }

  perform = (): void => {
    throw new NotImplementedError('Not implemented')
  }
}

export class MovementAction extends ActionWithDirection {
  perform = () => {
    const [x, y] = this.destXY

    // Check if the destination is within the map
    const tile = this.entity.levelMap.tiles[`${x},${y}`]
    if (!tile) {
      throw new ImpossibleError('Impossible to move off the map')
    }
    // Check if the destination is blocked by a tile
    if (!tile.walkable) {
      throw new ImpossibleError('Cannot move to blocked tile')
    }
    // Check if the destination is occupied by an entity that we cannot move through
    if (this.entity.levelMap.getBlockingEntityAtLocation(x, y)) {
      throw new ImpossibleError('Cannot move to occupied tile')
    }

    this.entity.move(x, y)
    // TODO: Use better comparison to figure out if it is player
    if (this.entity.name === 'Player') {
      this.entity.levelMap.centerOn(x, y)
    }
  }
}
