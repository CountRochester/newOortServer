export class ConnectionQueue {
  constructor (maxConnections = 10, timeout = 5000) {
    this.connections = new Map()
    this.maxConnections = maxConnections
    this.timeout = timeout
  }

  get size () {
    return this.connections.size
  }

  addConnection ({ request, reply, done }) {
    const key = request.id
    const connection = {
      request,
      reply,
      done,
      timeStamp: Date.now()
    }
    this.connections.set(key, connection)
    // const output = {
    //   id: request.id,
    //   headers: request.headers,
    //   method: request.method,
    //   query: request.query,
    //   params: request.params,
    //   body: request.body
    // }
    // console.dir(output)
    console.info(`Новое соединение ${key}. Всего соединений: ${this.size}`)
    this.setTimeoutConnection(key)
    if (this.size > this.maxConnections) {
      setTimeout(() => {
        done()
      }, this.timeout)
    } else {
      done()
    }
  }

  getFirstConnectionInQueue () {
    let first = Date.now()
    let firstKey = -1
    this.connections.forEach((connection, key) => {
      if (connection.timeStamp < first) {
        first = connection.timeStamp
        firstKey = key
      }
    })
    if (firstKey >= 0) {
      return this.connections.get(firstKey)
    }
    return undefined
  }

  setTimeoutConnection (key) {
    setTimeout(() => {
      const connection = this.connections.get(key)
      if (connection) {
        const { reply } = connection
        if (!reply.sent) {
          reply.header('statusCode', 524)
          reply.header('Content-Type', 'text/plain')
          reply.send('Timeout')
        }
        this.deleteConnection(key)
        console.info(`Request id: ${key} is timed out`)
      }
    }, this.timeout)
  }

  deleteConnection (key) {
    this.connections.delete(key)
    console.info(`Соединение ${key} закрыто. Всего соединений: ${this.size}`)
    console.info(`Соединения: ${[...this.connections.keys()]}`)

    const firstConnection = this.getFirstConnectionInQueue()
    if (firstConnection) {
      firstConnection.done()
    }
  }
}

export default ConnectionQueue
