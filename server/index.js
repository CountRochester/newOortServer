import cluster from 'cluster'
import startApp from './server-app.js'

// import { ServerError } from './server-error.js'

const INSTANCES_NUMBER = 4
const WORKER_RESTART_TIMEOUT = 5000

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

const startWorker = () => {
  process.on('SIGINT', () => { })

  process.on('message', (message) => {
    if (message === 'exit') {
      console.log('\x1B[32m%s\x1B[0m', `Worker pid: ${process.pid} is down`)
      process.exit(0)
    }
  })

  startApp()
}

const forkTheWorker = () => {
  cluster.fork()
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
  console.error(err)
  console.log('\x1B[32m%s\x1B[0m', 'Restarting worker...')

  process.send('restart')
  killWorker()
}

if (cluster.isMaster) {
  let needToShutDown = false

  startApp(cluster.isMaster)
    .then(() => {
      for (let i = 0; i < INSTANCES_NUMBER; i++) {
        forkTheWorker()
      }
    })
    .catch((err) => {
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
    startWorker()
    process.on('uncaughtException', errorHandler)
  } catch (err) {
    errorHandler(err)
  }
}
