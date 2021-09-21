import * as ROT from 'rot-js'
import {BLACK, LIGHT_GREEN} from '../constants'
import {DIRECTION_KEY_MAP} from '../constants'
import {Entity, Actor} from './entities'
import {floor, SHROUD, wall} from '../TileTypes'
import {createProcessEnemy} from './factories/enemies'
import {Terminal, terminalTypes, terminalWeights} from './entities'
import {RenderOrder} from '../constants'
import {MovementAction} from './actions'

export default class LevelMap {
  game: any
  player: any
  engine: ROT.Engine
  scheduler: any
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

  constructor(gameStuff: any, levelConfig: any) {
    this.game = gameStuff.game
    this.display = gameStuff.display

    this.entities = levelConfig.entities
    this.width = levelConfig.width
    this.height = levelConfig.height

    this.cameraHeight = levelConfig.cameraHeight || 50
    this.cameraWidth = levelConfig.cameraHeight || 80

    this.scheduler = new ROT.Scheduler.Speed()
    this.engine = new ROT.Engine(this.scheduler)

    this.init()
  }
  get levelMap() {
    return this
  }

  init() {
    this.generate()
  }

  addEntity = (entity: Entity) => {
    this.entities.push(entity)
    // Actors should get added to the scheduler
    if (entity instanceof Actor) {
      this.scheduler.add(entity, true)
    }
  }
  removeEntity = (entity: Entity) => {
    this.entities = this.entities.filter((e) => e !== entity)
    if (entity instanceof Actor) {
      this.scheduler.remove(entity)
    }
  }
  isTransparent = (x, y) => {
    const key = `${x},${y}`
    if (this.tiles && key in this.tiles) {
      return this.tiles[key]['transparent']
    }
  }

  playerTurn = () => {
    this.engine.lock()
    window.addEventListener('keyup', this)
  }

  handleEvent = (e: KeyboardEvent) => {
    try {
      if (typeof this === 'undefined') return
      const code = e.code

      if (!(code in DIRECTION_KEY_MAP)) {
        return
      }

      const diff = ROT.DIRS[4][DIRECTION_KEY_MAP[code]]
      // ts-ignore
      const new_x = this.player.x + diff[0]
      // ts-ignore
      const new_y = this.player.y + diff[1]

      const newKey = new_x + ',' + new_y
      // ts-ignore
      if (!(newKey in this.levelMap)) {
        return
      }
      // ts-ignore
      let a = new MovementAction(this.player, diff[0], diff[1])
      a.perform()
      // If action is successful, start engine again
      this.engine.unlock()
      this.display.clear()
      this.levelMap.render()
      this.game.log.render()
    } catch (error) {
      this.game.errorHandler.handle(error)
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
    // drawFrame(this.display, this.cameraHeight, this.cameraWidth, 0, 0, 'MAP')
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

  /**
   * getClosestPlayerActor - returns the closest actor in the player's faction
   * param x
   * param y
   * returns actor
   */
  getClosestPlayerActor(x, y) {
    const actors = this.actors
    const distances = actors.map((actor) => {
      if (!actor.belongsToPlayerFaction) return
      return {
        actor,
        distance: Math.sqrt(
          Math.pow(actor.x - x, 2) + Math.pow(actor.y - y, 2),
        ),
      }
    })
    const sorted = distances.sort((a, b) => {
      return a.distance - b.distance
    })
    return sorted[0].actor
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

  checkCellForBlocking(x, y) {
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

  setUpMap = () => {
    // this.player = new Player(20, 20, this.levelMap)
    // this.levelMap = new LevelMap(
    //   {
    //     game: this,
    //     display: this.display,
    //   },
    //   {
    //     width: 100,
    //     height: 100,
    //     entities: [this.player],
    //   },
    // )
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
