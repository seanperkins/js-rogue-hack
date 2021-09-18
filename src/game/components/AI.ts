import * as ROT from 'rot-js'

import {Actor} from 'entities/'
import {Action, MovementAction} from '../actions'
import {NotImplementedError} from '../Errors'

export class BaseAI extends Action {
  perform = (): void => {
    throw new NotImplementedError('Perform is not defined in this AI')
  }

  getPathTo(destX, destY) {
    const {x, y} = this.entity
    const path = []
    const pathfinder = new ROT.Path.Dijkstra(
      destX,
      destY,
      this.entity.levelMap.checkCellForBlocking,
      {
        topology: 4, // We may want to change this to 8 to give enemies an advantage
      },
    )
    pathfinder.compute(x, y, function (x, y) {
      path.push([x, y])
    })
    return path
  }
}

export class HostileEnemy extends BaseAI {
  constructor(entity: Actor) {
    super(entity)
  }

  perform = () => {
    const {x, y} = this.entity
    const target = this.entity.levelMap.getClosestPlayerActor(x, y)

    if (target) {
      const {x: targetX, y: targetY} = target

      const dx = targetX - x
      const dy = targetY - y
      const distance = Math.max(Math.abs(dx), Math.abs(dy))

      if (distance <= 1) {
        // TODO: Add melee attack
      }

      const path = this.getPathTo(targetX, targetY)

      if (path.length > 0) {
        const [nextX, nextY] = path[0]
        return new MovementAction(this.entity, nextX, nextY).perform()
      }

      // TODO: Add wait action
    }
  }
}
