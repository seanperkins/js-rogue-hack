export default class TileSet {
  tileSet: HTMLImageElement
  tileMap: {[key: string]: [number, number]}
  tileWidth: number
  tileHeight: number
  constructor(imageId: string) {
    this.tileSet = document.getElementById(imageId) as HTMLImageElement
    this.tileMap = {}
    this.tileWidth = 12
    this.tileHeight = 12
    Object.keys(presetCharMap).forEach((key) => {
      const pos = presetCharMap[key]
      this.tileMap[key] = [pos[0] * this.tileWidth, pos[1] * this.tileHeight]
    })
    for (let i = 0; i < 256; i++) {
      // NOTE: String.fromCharCode gets the codes but dev tools might show a blank key
      // on the object. The key is actually there though.
      this.tileMap[String.fromCharCode(i)] = [
        (i % 16) * this.tileWidth,
        Math.floor(i / 16) * this.tileHeight,
      ]
    }
  }
}

// This mapping just uses placement
const presetCharMap = {
  blank: [0, 0],
  lightTexture: [0, 11],
  mediumTexture: [0, 12],
  darkTexture: [0, 13],
  verticalLine: [11, 11],
  horizontalLine: [5, 13],
}
