// Корневой файл сервера
// ----------------------------------------------
// Подключение модулей
const path = require('path')
const { ApolloServer } = require('apollo-server-fastify')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('graphql-tools')
const consola = require('consola')
// ----------------------------------------------
const config = require('../nuxt.config.js')
const schema = require('./graphql/schema')
const { timeStamp, time, date } = require('./graphql/types')
const apolloRes = require('./graphql/resolver/apollo-resolver')
const keys = require('./keys')

// Импорт настроек и установка их в Nuxt.js
config.dev = process.env.NODE_ENV !== 'production'
// ----------------------------------------------

const app = require('./app')
// ----------------------------------------------

const Schema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: apolloRes
})
Object.assign(Schema._typeMap.TimeStamp, timeStamp)
Object.assign(Schema._typeMap.Time, time)
Object.assign(Schema._typeMap.Date, date)

app.register(require('fastify-circuit-breaker'))

const apolloServer = new ApolloServer({
  schema: Schema,
  context: async ({ request, reply }) => {
    await app.circuitBreaker()
    return { req: request, res: reply }
  },
  introspection: true,
  playground: true
})
app.register(apolloServer.createHandler({
  path: '/graphql'
}))

app.register(require('fastify-vue-plugin'), {
  config,
  attachProperties: ['session'] // Attach properties from the fastify request object to the nuxt request object. Example use case: Attach session store to nuxt context.
}).after((e) => {
  if (e) { console.trace(e) }
  app.nuxt('/')
})
const staticDir = path.join(__dirname, '../', 'static')
app.register(require('fastify-static'), {
  root: staticDir,
  prefix: '/'
})

// Функция запуска сервера
async function start () {
  await app.listen(keys.APP_PORT, (e) => {
    if (e) { console.trace(e) }
    consola.warn('Server started OK')
  })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema: Schema,
      execute,
      subscribe
    },
    {
      server: app.server,
      path: '/graphql'
    }
  )

  const connections = new Map()
  app.server.on('connection', (socket) => {
    const key = `${socket.remoteAddress}:${socket.remotePort} (${socket.remoteFamily})`
    connections.set(key, socket)
    socket.on('close', () => {
      connections.delete(key)
      consola.info(`Соединение ${key} закрыто.`)
    })
  })
}
// ----------------------------------------------
start()
