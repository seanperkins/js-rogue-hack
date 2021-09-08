export class NotImplementedError extends Error {
  constructor(...params) {
    super(...params)
    this.name = 'NotImplementedError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError)
    }
  }
}

export class ImpossibleError extends Error {
  constructor(...params) {
    super(...params)
    this.name = 'ImpossibleError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImpossibleError)
    }
  }
}
