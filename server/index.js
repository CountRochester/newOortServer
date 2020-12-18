// Корневой файл сервера
// ----------------------------------------------
// Подключение модулей
// const path = require('path')
// const { ApolloServer } = require('apollo-server-fastify')
// const { execute, subscribe } = require('graphql')
// const { SubscriptionServer } = require('subscriptions-transport-ws')
// const { makeExecutableSchema } = require('graphql-tools')
// const consola = require('consola')
// // ----------------------------------------------
// const config = require('../nuxt.config.js')
// const schema = require('./graphql/schema')
// const { timeStamp, time, date } = require('./graphql/types')
// const apolloRes = require('./graphql/resolver/apollo-resolver')
// const keys = require('./keys')
import asf from 'apollo-server-fastify'
import path from 'path'
import consola from 'consola'
import stws from 'subscriptions-transport-ws'
import gql from 'graphql'

const { execute, subscribe } = gql
const { ApolloServer } = asf
const { SubscriptionServer } = stws

import config from '../nuxt.config.mjs'
import keys from './keys/index.js'
// Импорт настроек и установка их в Nuxt.js
config.dev = process.env.NODE_ENV !== 'production'
// ----------------------------------------------

// const app = require('./app')
import application from './app.js'
// ----------------------------------------------

const __dirname = path.parse(path.resolve('')).dir

// Функция запуска сервера
async function start (application) {
  await application.app.listen(keys.APP_PORT, (e) => {
    if (e) { console.trace(e) }
    consola.warn('Server started OK')
  })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema: application.Schema,
      execute,
      subscribe
    },
    {
      server: application.app.server,
      path: '/graphql'
    }
  )

  const connections = new Map()
  application.app.server.on('connection', (socket) => {
    const key = `${socket.remoteAddress}:${socket.remotePort} (${socket.remoteFamily})`
    connections.set(key, socket)
    socket.on('close', () => {
      connections.delete(key)
      consola.info(`Соединение ${key} закрыто.`)
    })
  })
}
// ----------------------------------------------

application.init()
  .then(() => {
    console.log(application)
    application.app.register(import('fastify-circuit-breaker'))

    const apolloServer = new ApolloServer({
      schema: application.Schema,
      context: async ({ request, reply }) => {
        await application.app.circuitBreaker()
        return { req: request, res: reply }
      },
      introspection: true,
      playground: true
    })

    application.app.register(apolloServer.createHandler({
      path: '/graphql'
    }))

    application.app.register(import('fastify-vue-plugin'), {
      config,
      attachProperties: ['session'] // Attach properties from the fastify request object to the nuxt request object. Example use case: Attach session store to nuxt context.
    }).after((e) => {
      if (e) { console.trace(e) }
      application.app.nuxt('/')
    })
    const staticDir = path.join(__dirname, '../', 'static')
    application.app.register(import('fastify-static'), {
      root: staticDir,
      prefix: '/'
    })

    start(application)
  })
  .catch(err => {
    consola.error(err)
  })





