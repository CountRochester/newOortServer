import moment from 'moment'

moment.locale('ru')

export class ServerError extends Error {
  #time = moment.now()
  #calledFunctions = []

  constructor(message, functionName) {
    super(message)
    this.#calledFunctions = [functionName]
  }

  addFunctionName(name) {
    if (typeof name === 'string') {
      this.calledFunctions.push(name)
    }
  }

  getCalledFunctions() {
    return [...this.#calledFunctions]
  }

  getErrorTime() {
    return this.#time.toString()
  }

}