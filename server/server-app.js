import asf from 'apollo-server-fastify'
import path from 'path'
import consola from 'consola'
import stws from 'subscriptions-transport-ws'
import gql from 'graphql'

import application from './application.js'
import { ConnectionQueue } from './connection-queue.js'

import config from '../nuxt.config.mjs'
import keys from './keys/index.js'

// ----------------------------------------------
const { execute, subscribe } = gql
const { ApolloServer } = asf
const { SubscriptionServer } = stws

config.dev = process.env.NODE_ENV !== 'production'
// ----------------------------------------------

const __dirname = path.parse(path.resolve('')).dir

// Функция запуска сервера
async function start (app) {
  await app.app.listen(keys.APP_PORT, (e) => {
    if (e) { console.trace(e) }
    consola.warn('Server started OK')
  })

  SubscriptionServer.create(
    {
      schema: app.Schema,
      execute,
      subscribe
    },
    {
      server: app.app.server,
      path: '/graphql'
    }
  )
}
// ----------------------------------------------

const MAX_REQUESTS = 10
const QUEUE_TIMEOUT = 5000

const onRequest = (connectionQueue) => (request, reply, done) => {
  connectionQueue.addConnection({ request, reply, done })
}

const onResponse = (connectionQueue) => (req, reply, done) => {
  connectionQueue.deleteConnection(req.id)
  done()
}

export default async function startApp (isMaster) {
  try {
    await application.init(isMaster)

    const connectionQueue = new ConnectionQueue(MAX_REQUESTS, QUEUE_TIMEOUT)

    const apolloServer = new ApolloServer({
      schema: application.Schema,
      context: ({ request, reply }) => ({
        req: request.raw,
        res: reply.raw,
        ...application.context
      }),
      introspection: true,
      playground: true
    })

    application.app.register(apolloServer.createHandler({
      path: '/graphql'
    }))

    application.app.addHook('onRequest', onRequest(connectionQueue))

    application.app.addHook('onResponse', onResponse)

    application.app.register(import('fastify-vue-plugin'), {
      config,
      attachProperties: ['session']
      // Attach properties from the fastify request
      // object to the nuxt request object.
      // Example use case: Attach session store to nuxt context.
    }).after((e) => {
      if (e) { console.trace(e) }
      application.app.nuxt('/')
    })
    const staticDir = path.join(__dirname, '../', 'static')
    application.app.register(import('fastify-static'), {
      root: staticDir,
      prefix: '/'
    })
    if (!isMaster) {
      await start(application)
    }
    return application
  } catch (err) {
    consola.error(err)
    return undefined
  }
}
