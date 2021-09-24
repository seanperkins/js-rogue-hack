export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

/**
 * I am getting an error with the tile-gl.js file at line 59. It is saying that
 * we are trying to draw a character not in the tileMap. The character in question
 * is "Μ", charCode 924. We should not be trying to draw that character. I have not
 * been able to pin it down so I am not allowing a bunch of characters in the random
 * chars to help with this. I don't think it is actually fixing it though.
 */
function getAcceptableCharCode() {
  let code = getRandomInt(255)
  // Get rid of control characters and any chars that might be problematic
  if (
    code < 33 ||
    [
      35, 67, 103, 121, 127, 131, 137, 143, 152, 156, 157, 182, 196, 199, 207,
      213, 223, 226, 230,
    ].includes(code)
  ) {
    code = getAcceptableCharCode()
  }
  return code
}

export function getRandomChar() {
  const code = getAcceptableCharCode()
  return String.fromCharCode(code)
}
