import cluster from 'cluster'
import startApp from './server-app.js'
import logger from './modules/core/logger.js'

// import { ServerError } from './server-error.js'

const INSTANCES_NUMBER = 1
const WORKER_RESTART_TIMEOUT = 5000
const CHECK_LOGS_INTERVAL = 4 * 60 * 60 * 1000

const killWorker = (id) => {
  if (id === null || Number.isNaN(id) || id === undefined) {
    const workerId = cluster.worker.id
    console.log('\x1B[31m%s\x1B[0m', `Shutting down the worker ${workerId}...`)
    process.exit(1)
  } else {
    console.log('\x1B[31m%s\x1B[0m', `Shutting down the worker ${id}...`)
    cluster.workers[id].send('exit')
  }
}

const startWorker = async () => {
  process.on('SIGINT', () => { })

  process.on('message', (message) => {
    if (message === 'exit') {
      console.log('\x1B[32m%s\x1B[0m', `Worker pid: ${process.pid} is down`)
      process.exit(0)
    }
  })

  const app = await startApp()
  return app
}

const resendPubSubMessage = (worker) => (message) => {
  try {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.pubSub) {
      const workerIds = Object
        .keys(cluster.workers)
        .filter(id => id !== worker.id.toString())
      workerIds.forEach((workerId) => {
        cluster.workers[workerId].send(message)
      })
    }
  } catch (err) {
    logger.writeLog(err)
    console.log(`Message sent to worker ${worker.id} cannot be parsed`)
  }
}

const forkTheWorker = () => {
  const worker = cluster.fork()
  worker.on('message', resendPubSubMessage(worker))
}

const bindRestartTheWorker = (id) => {
  cluster.workers[id].on('message', (message) => {
    if (message === 'restart') {
      const timout = Math.floor(WORKER_RESTART_TIMEOUT / 1000)
      console.log(`Restarting worker ${id} in ${timout} s`)
      setTimeout(forkTheWorker, WORKER_RESTART_TIMEOUT)
    }
  })
}

const errorHandler = (err) => {
  logger.writeLog(err)
  console.error(err)
  console.log('\x1B[32m%s\x1B[0m', 'Restarting worker...')

  process.send('restart')
  killWorker()
}

const workerHandler = (app) => {
  process.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage.pubSub) {
        const { subscription, payload } = parsedMessage.pubSub
        console.log(`Republishing subscriptions of worker ${process.pid}`)
        try {
          app.context.pubsub.publish(subscription, payload, true)
        } catch (err) {
          logger.writeLog(err)
          console.log(`Error publishing the subscribe on worker ${process.pid}:`)
          console.log(err)
        }
      }
    } catch (err) {
      logger.writeLog(err)
      console.log(`Message sent to worker PID: ${process.pid} cannot be parsed`)
      console.log('Message:', message)
    }
  })
}

if (cluster.isMaster) {
  // startApp(cluster.isMaster)
  let needToShutDown = false
  logger.init()
    .then(() => (startApp(cluster.isMaster)))
    .then(() => {
      for (let i = 0; i < INSTANCES_NUMBER; i++) {
        forkTheWorker()
      }
      return logger.handleArchiveLogs()
    })
    .then(() => {
      setInterval(logger.handleArchiveLogs, CHECK_LOGS_INTERVAL)
    })
    .catch((err) => {
      logger.writeLog(err)
      console.error(err)
    })

  cluster.on('exit', (worker) => {
    console.log('\x1B[31m%s\x1B[0m', `Worker ${worker.process.pid} is down`)

    const workerIds = Object.keys(cluster.workers)

    if (!workerIds.length && needToShutDown) {
      console.log('\x1B[32m%s\x1B[0m', 'All workers is down')
      console.log('\x1B[33m%s\x1B[0m', 'Goodbye...')
      process.exit(0)
    }
  })

  cluster.on('online', (worker) => {
    bindRestartTheWorker(worker.id)
  })

  process.on('SIGINT', () => {
    console.log('\x1B[33m%s\x1B[0m', 'Shutting down the application')
    needToShutDown = true

    const workerIds = Object.keys(cluster.workers)
    workerIds.forEach(killWorker)
  })
} else {
  try {
    process.on('uncaughtException', errorHandler)
    startWorker().then(workerHandler)
  } catch (err) {
    errorHandler(err)
  }
}
