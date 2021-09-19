export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function getRandomChar() {
  const code = getRandomInt(255)
  return String.fromCharCode(code)
}
