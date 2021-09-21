export class ErrorHandler {
  log: any
  constructor(log, isDebug = false) {
    this.log = log
    if (isDebug) {
      window.onerror = this.handleUnhandledError
    }
  }

  handleUnhandledError = (message, source, lineno, colno) => {
    const errorMessage = `${message} in ${source} at line ${lineno}, column ${colno}`
    this.log.add(errorMessage, 'error')
    this.log.render()
  }

  handle = (error) => {
    this.log.add(error.message, 'error')
    this.log.render()
  }
}

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
