import * as ROT from 'rot-js'
import {BLACK} from './constants/colors'

import Entity, {Actor} from './Entity'

export default class LevelMap {
  display: ROT.Display
  entities: Entity[]
  width: number
  height: number

  constructor(display, entities: Entity[] = []) {
    this.display = display
    this.entities = entities
  }
  addEntity(entity: Entity) {
    this.entities.push(entity)
  }
  removeEntity(entity: Entity) {
    this.entities = this.entities.filter((e) => e !== entity)
  }
  render() {
    this.display.clear()
    this.entities.forEach((actor) => {
      this.display.draw(actor.x, actor.y, actor.char, actor.color, BLACK)
    })
  }
  actors = (): Entity[] => this.entities.filter((e) => e instanceof Actor)
}
