import * as ROT from 'rot-js'
import {BLACK, GREEN, LIGHT_GREEN, YELLOW} from './constants/colors'

import {Entity, Actor} from './entities/'
import {floor, SHROUD, wall} from './TileTypes'
import {createProcessEnemy} from './factories/enemies'
import {drawFrame} from './utilities/display'
import {Terminal, terminalTypes, terminalWeights} from '@entities'
import {RenderOrder} from '@constants'

export default class LevelMap {
  display: ROT.Display
  entities: (Actor | Terminal | Entity)[]
  tiles: {[key: string]: typeof wall | typeof floor} = {}
  exploredTiles: {[key: string]: boolean} = {}
  currentlyVisibleTiles: {[key: string]: boolean} = {}
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
  get levelMap() {
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
      return this.tiles[key]['transparent']
    }
  }

  render = () => {
    this.currentlyVisibleTiles = {}
    const fov = new ROT.FOV.PreciseShadowcasting(this.isTransparent)
    Object.keys(this.tilesInFrame).forEach((key) => {
      const [x, y] = key.split(',').map((n) => parseInt(n))
      const tile = this.tiles[key]
      if (!this.exploredTiles[key]) {
        // Tiles that are not explored use the SHROUD style
        this.display.draw(
          x - this.cameraOffsetX,
          y - this.cameraOffsetY,
          SHROUD.ch,
          SHROUD.fg,
          SHROUD.bg,
        )
      } else {
        // If it has been explored we can draw it as the dark version because we are redrawing currently visible next
        this.display.draw(
          x - this.cameraOffsetX,
          y - this.cameraOffsetY,
          tile.dark.ch,
          tile.dark.fg,
          tile.dark.bg,
        )
      }
    })
    // Cacluaate FOV from players position
    fov.compute(this.entities[0].x, this.entities[0].y, 10, (x, y) => {
      this.exploredTiles[`${x},${y}`] = true
      this.currentlyVisibleTiles[`${x},${y}`] = true
      const tile = this.tiles[`${x},${y}`]
      this.display.drawOver(
        x - this.cameraOffsetX,
        y - this.cameraOffsetY,
        tile.light.ch,
        tile.light.fg,
        tile.light.bg,
      )
    })
    // Displays the frame around the map
    drawFrame(this.display, this.cameraHeight, this.cameraWidth, 0, 0, 'MAP')
    // Display all actors that are in visible areas within the current frame
    // TODO: Draw all entities, after sorting them by their order
    this.entities.forEach((actor) => {
      if (
        !this.tilesInFrame[`${actor.x},${actor.y}`] ||
        !this.currentlyVisibleTiles[`${actor.x},${actor.y}`]
      )
        return
      this.display.drawOver(
        actor.x - this.cameraOffsetX,
        actor.y - this.cameraOffsetY,
        actor.char,
        actor.color,
        BLACK,
      )
    })
  }

  get actors(): Entity[] {
    return this.entities.filter((e) => e instanceof Actor)
  }

  get spawnPoints(): Terminal[] {
    return this.entities.filter((e) => {
      if (e instanceof Terminal && e.isNetworked) {
        return e
      }
    }) as Terminal[]
  }

  // Returns the entity if it is there and blocks movement
  getBlockingEntityAtLocation(x, y) {
    const entity = this.entities.find((e) => e.x === x && e.y === y)
    if (entity && entity.blocksMovement) {
      return entity
    } else {
      return null
    }
  }

  getActorAtLocation(x, y) {
    const actor = this.actors.find((e) => e.x === x && e.y === y)
    if (actor) {
      return actor
    } else {
      return null
    }
  }

  getBlockableTileAtLocation(x, y) {
    const key = `${x},${y}`
    if (this.tiles && key in this.tiles) {
      return this.tiles[key]['walkable'] === false
    }
    return false
  }

  get tilesInFrame() {
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
      roomWidth: [5, 15],
      roomHeight: [5, 15],
      roomDugPercentage: 0.5,
    })
    map.create((x, y, value) => {
      this.tiles[`${x},${y}`] = value === 1 ? wall : floor
    })
    const rooms = ROT.RNG.shuffle(map.getRooms())
    const terminals = []

    for (let i = 0; i < 10; i++) {
      const terminalKey = ROT.RNG.getWeightedValue(terminalWeights)
      const terminalType = terminalTypes[terminalKey]
      const terminal = new Terminal(
        'T',
        LIGHT_GREEN,
        terminalType.name,
        0,
        0,
        this,
        true,
        RenderOrder.TERMINALS,
        terminalType.networkSecurity,
      )
      terminals.push(terminal)
    }

    rooms.forEach((room, i) => {
      if (i === rooms.length - 1) {
        return
      }
      const center = room.getCenter()
      if (i < 5) {
        const terminal = terminals[i]
        terminal.x = center[0]
        terminal.y = center[1]
        this.entities.push(terminal)
      } else {
        createProcessEnemy(center[0], center[1], this)
      }
    })
    const center = rooms[rooms.length - 1].getCenter()
    this.entities[0].place(center[0], center[1], this)
    this.centerOn(center[0], center[1])
  }
}
