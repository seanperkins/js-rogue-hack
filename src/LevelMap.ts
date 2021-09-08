import * as ROT from 'rot-js'
import {BLACK, GREEN, YELLOW} from './constants/colors'

import Entity, {Actor} from './Entity'
import TileSet from './TileSet'
import chars from './constants/characters'

export default class LevelMap {
  display: ROT.Display
  entities: Entity[]
  tiles: {[key: string]: number} = {}
  // Size of level
  width: number
  height: number
  // Camera stuff
  cameraHeight: number
  cameraWidth: number
  cameraOffsetX: number = 0
  cameraOffsetY: number = 0

  constructor(display, width, height, entities: Entity[] = []) {
    this.display = display
    this.entities = entities
    this.width = width
    this.height = height
    this.cameraHeight = 50
    this.cameraWidth = 80

    this.generate()
  }
  levelMap() {
    return this
  }
  addEntity = (entity: Entity) => {
    this.entities.push(entity)
  }
  removeEntity = (entity: Entity) => {
    this.entities = this.entities.filter((e) => e !== entity)
  }
  isTransparent = (x, y) => {
    const key = `${x},${y}`
    if (this.tiles && key in this.tiles) {
      return this.tiles[key] === 0
    }
    return false
  }
  render = () => {
    this.display.clear()
    const fov = new ROT.FOV.PreciseShadowcasting(this.isTransparent)
    const visbileTiles = this.visbileTiles()
    Object.keys(visbileTiles).forEach((key) => {
      const [x, y] = key.split(',').map((n) => parseInt(n))
      const tile = this.tiles[key]
      this.display.draw(
        x - this.cameraOffsetX,
        y - this.cameraOffsetY,
        tile === 1 ? '#' : 'ù',
        GREEN,
        BLACK,
      )
    })
    fov.compute(
      this.entities[0].x,
      this.entities[0].y,
      12,
      (x, y, r, visibility) => {
        this.display.drawOver(
          x - this.cameraOffsetX,
          y - this.cameraOffsetY,
          null,
          YELLOW,
          null,
        )
      },
    )
    this.displayFrame()
    this.entities.forEach((actor) => {
      this.display.drawOver(
        actor.x - this.cameraOffsetX,
        actor.y - this.cameraOffsetY,
        actor.char,
        actor.color,
        BLACK,
      )
    })
  }
  actors = (): Entity[] => this.entities.filter((e) => e instanceof Actor)

  visbileTiles() {
    const tiles = {}
    for (
      let x = this.cameraOffsetX;
      x < this.cameraOffsetX + this.cameraWidth;
      x++
    ) {
      for (
        let y = this.cameraOffsetY;
        y < this.cameraOffsetY + this.cameraHeight;
        y++
      ) {
        tiles[`${x},${y}`] = this.tiles[`${x},${y}`]
      }
    }
    return tiles
  }

  displayFrame() {
    for (let x = 0; x < this.cameraWidth; x++) {
      for (let y = 0; y < this.cameraHeight; y++) {
        let char = ' '

        if (x === 0 && y === 0) {
          char = chars.upperLeftCorner // Upper left corner
        } else if (x === this.cameraWidth - 1 && y === 0) {
          char = chars.upperRightCorner // Upper right corner
        } else if (x === 0 && y === this.cameraHeight - 1) {
          char = chars.lowerLeftCorner // Lower left corner
        } else if (x === this.cameraWidth - 1 && y === this.cameraHeight - 1) {
          char = chars.lowerRightCorner // Lower right corner
        } else if (x === 0 || x === this.cameraWidth - 1) {
          char = chars.verticalLine // Vertical
        } else if (y === 0 || y === this.cameraHeight - 1) {
          char = chars.horizontalLine // Horizontal
        }
        if (char !== ' ') {
          this.display.draw(x, y, char, GREEN, BLACK) // Side
        }
      }
    }
  }

  centerOn(x, y) {
    const newX = x - this.cameraWidth / 2
    if (newX > 0 && newX < this.width - this.cameraWidth) {
      this.cameraOffsetX = newX
    } else if (newX < 0) {
      this.cameraOffsetX = 0
    } else if (newX + this.cameraWidth > this.width) {
      this.cameraOffsetX = this.width - this.cameraWidth
    }
    const newY = y - this.cameraHeight / 2
    if (newY > 0 && newY < this.height - this.cameraHeight) {
      this.cameraOffsetY = newY
    } else if (newY < 0) {
      this.cameraOffsetY = 0
    } else if (newY + this.cameraHeight > this.height) {
      this.cameraOffsetY = this.height - this.cameraHeight
    }
  }

  generate() {
    const map = new ROT.Map.Uniform(this.width, this.height, {
      roomDugPercentage: 0.5,
    })
    map.create((x, y, value) => {
      this.tiles[`${x},${y}`] = value
    })
  }
}
