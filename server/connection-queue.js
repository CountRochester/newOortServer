export class ConnectionQueue {
  constructor (maxConnections = 10, timeout = 5000, limit = 30) {
    this.connections = new Map()
    this.maxConnections = maxConnections
    this.timeout = timeout
    this.limit = limit
  }

  get size () {
    return this.connections.size
  }

  addConnection (connection) {
    if (this.size >= this.limit) {
      connection.res.setHeader('Content-Type', 'text/plain')
      connection.res.writeHead(503)
      connection.res.end('Service Unavailable')
      return
    }
    const key = connection.id
    connection.timeStamp = Date.now()
    this.connections.set(key, connection)
    console.info(`Новое соединение ${key}. Всего соединений: ${this.size}`)
    this.setTimeoutConnection(key)
    const handleRequest = (connectionQueue) => {
      const con = connectionQueue.connections.get(key)
      if (con) {
        con.done(con)
      }
    }
    if (this.size > this.maxConnections) {
      setTimeout(handleRequest, this.timeout, this)
    } else {
      setTimeout(handleRequest, 0, this)
    }
  }

  getFirstConnectionInQueue () {
    let first = Infinity
    let firstKey = -1
    this.connections.forEach((connection, key) => {
      if (connection.timeStamp < first) {
        first = connection.timeStamp
        firstKey = connection.id
      }
    })
    if (firstKey !== -1) {
      return this.connections.get(firstKey)
    }
    return undefined
  }

  setTimeoutConnection (key) {
    setTimeout((connectionQueue) => {
      const connection = connectionQueue.connections.get(key)
      if (connection) {
        const { res } = connection
        res.setHeader('Content-Type', 'text/plain')
        res.writeHead(524)
        res.end('Timeout')
        this.deleteConnection(key)
        console.info(`Request id: ${key} is timed out`)
      }
    }, this.timeout, this)
  }

  deleteConnection (key) {
    this.connections.delete(key)
    console.info(`Соединение ${key} закрыто. Всего соединений: ${this.size}`)
    // console.info(`Соединения: ${[...this.connections.keys()]}`)

    const firstConnection = this.getFirstConnectionInQueue()
    if (firstConnection) {
      firstConnection.done(firstConnection)
    }
  }

  destroy () {
    this.connections.forEach((connection) => {
      const { res } = connection
      res.setHeader('Content-Type', 'text/plain')
      res.writeHead(521)
      res.end('Web Server Is Down')
      this.deleteConnection(connection.id)
    })
  }
}

export default ConnectionQueue
