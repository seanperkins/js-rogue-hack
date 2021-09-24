// TODO: Look into other storage mechanisms
export function clearStorage() {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export function keyExists(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null
  } catch (error) {
    console.log(error)
    return false
  }
}

export function saveToStorage(key: string, data: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export function loadFromStorage(key: string): any | null {
  try {
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.log(error)
    return false
  }
}

export function asyncSaveToStorage(key: string, data: any): Promise<true> {
  return new Promise((resolve, reject) => {
    const success = saveToStorage(key, data)
    if (success) {
      resolve(true)
    } else {
      reject(false)
    }
  })
}

export function asyncLoadFromStorage(key: string): Promise<any | null> {
  return new Promise((resolve, reject) => {
    const data = loadFromStorage(key)
    if (data === false) {
      reject(data)
    } else {
      resolve(data)
    }
  })
}
