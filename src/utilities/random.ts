export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function randomCharCode() {
  const code = getRandomInt(255)
  return String.fromCharCode(code)
}
