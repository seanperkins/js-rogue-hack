import * as ROT from 'rot-js'
import {BLACK, GREEN} from './constants/colors'

import Entity, {Actor} from './Entity'
import TileSet from './TileSet'
import chars from './constants/characters'

export default class LevelMap {
  display: ROT.Display
  entities: Entity[]
  width: number
  height: number
  // Camera stuff
  cameraHeight: number
  cameraWidth: number
  cameraOffsetX: number
  cameraOffsetY: number

  constructor(display, width, height, entities: Entity[] = []) {
    this.display = display
    this.entities = entities
    this.width = width
    this.height = height
    this.cameraHeight = 50
    this.cameraWidth = 50
  }
  levelMap() {
    return this
  }
  addEntity(entity: Entity) {
    this.entities.push(entity)
  }
  removeEntity(entity: Entity) {
    this.entities = this.entities.filter((e) => e !== entity)
  }
  render() {
    this.display.clear()
    this.displayFrame()
    this.entities.forEach((actor) => {
      this.display.drawOver(actor.x, actor.y, actor.char, actor.color, BLACK)
    })
  }
  actors = (): Entity[] => this.entities.filter((e) => e instanceof Actor)

  displayFrame() {
    for (let x = 0; x < this.cameraWidth; x++) {
      for (let y = 0; y < this.cameraHeight; y++) {
        let char = ' '

        if (x === 0 || x === this.cameraWidth - 1) {
          char = chars.verticalLine // Vertical
        } else if (y === 0 || y === this.cameraHeight - 1) {
          char = chars.horizontalLine // Horizontal
        }
        if (x === 0 && y === 0) {
          char = chars.upperLeftCorner // Upper left corner
        }
        if (x === this.cameraWidth - 1 && y === 0) {
          char = chars.upperRightCorner // Upper right corner
        }
        if (x === 0 && y === this.cameraHeight - 1) {
          char = chars.lowerLeftCorner // Lower left corner
        }
        if (x === this.cameraWidth - 1 && y === this.cameraHeight - 1) {
          char = chars.lowerRightCorner // Lower right corner
        }

        this.display.draw(x, y, char, GREEN, BLACK) // Side
      }
    }
  }

  centerOn(x, y) {}
}
