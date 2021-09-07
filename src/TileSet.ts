export default class TileSet {
  tileSet: HTMLImageElement;
  tileMap: {[key: string]: [number, number]};
  tileWidth: number;
  tileHeight: number;
  constructor(imageId: string) {
      this.tileSet = document.getElementById(imageId) as HTMLImageElement;
      this.tileMap = {};
      this.tileWidth = 12;
      this.tileHeight = 12;
      for(let i=0; i<256; i++) {
          this.tileMap[String.fromCharCode(i)] =
              [(i % 16) * this.tileWidth, Math.floor(i / 16) * this.tileHeight];
      }
  }
}