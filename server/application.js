// import passport from 'passport'
import http from 'http'
import Nuxt from 'nuxt'
import apollo from 'apollo-server-native'
import { v4 as uuidv4 } from 'uuid'

import gqlTools from 'graphql-tools'
import gqlMerge from '@graphql-tools/merge'
import consolaGlobalInstance from 'consola'
import keys from './keys/index.js'
import { ConnectionQueue } from './connection-queue.js'

// import passportStrategy from './middleware/passport-strategy'
import { AuthenticationModule } from './modules/authentication/index.js'
import { DocumentFlowModule } from './modules/document-flow/index.js'
import { CoreModule } from './modules/core/index.js'

// import fileMiddleware from './middleware/file.js'
// import fileHandler from './routes/upload.js'
import { formContext } from './form-context.js'
import router from './router/index.js'

const { mergeTypeDefs } = gqlMerge
const { makeExecutableSchema } = gqlTools
const { loadNuxt, build } = Nuxt
const { ApolloServer } = apollo

// ----------------------------------------------
const isDev = process.env.NODE_ENV !== 'production'
const MAX_REQUESTS = 10
const QUEUE_TIMEOUT = 15000

// ----------------------------------------------
// app.register(passport.initialize())
// passport.use(passportStrategy)
// ----------------------------------------------
// Регистрация роутов
// app.register(multer.contentParser)
// app.route({
//   method: 'POST',
//   url: '/upload',
//   preHandler: fileMiddleware.any(),
//   handler: () => { }//fileHandler
// })
function getTrimmedPath (parsedUrl) {
  return parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
}

const serverHandler = (nuxtInstance, appInstance) => (req, res) => {
  const parsedUrl = new URL(req.url, `http://${keys.APOLLO_HOST}:${keys.APP_PORT}`)
  const trimmedPath = getTrimmedPath(parsedUrl)
  const method = req.method.toLowerCase()
  const contentLength = +req.headers['content-length']
  const connectionId = uuidv4()

  const { token } = req.headers

  const data = {
    trimmedPath,
    queryStringObject: parsedUrl.query,
    method,
    headers: req.headers,
    contentLength,
    token
  }

  const done = async (connection) => {
    const options = {
      connection,
      nuxt: nuxtInstance,
      app: appInstance
    }
    await router(options)
    appInstance.connectionQueue.deleteConnection(connection.id)
  }

  const connection = {
    id: connectionId,
    req,
    res,
    done,
    data
  }

  appInstance.connectionQueue.addConnection(connection)
}

async function initializeModulesAndFormSchemas (appInstance, isMaster) {
  const schemas = []
  const moduleNames = Object.keys(appInstance.modules)
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleName of moduleNames) {
    const appModule = appInstance.modules[moduleName]
    // eslint-disable-next-line no-await-in-loop
    await appModule.init(appInstance.context, { isMaster })
    appInstance.context[appModule.moduleName] = appModule.publicModuleData

    appModule.schema && schemas.push(appModule.schema)

    const resolverNames = Object.keys(appInstance.resolvers)
    resolverNames.forEach((key) => {
      appInstance.resolvers[key] = {
        ...appInstance.resolvers[key],
        ...appModule.resolvers[key]
      }
    })
  }

  return schemas
}

class Application {
  constructor (modules = []) {
    this.schema = ''
    this.resolvers = {
      Query: {},
      Mutation: {},
      Subscription: {}
    }
    this.modules = {}
    modules.forEach((AppModule) => {
      this.modules[AppModule.moduleName] = new AppModule()
    })
    this.context = formContext()
    this.connectionQueue = new ConnectionQueue(MAX_REQUESTS, QUEUE_TIMEOUT)
  }

  async init (isMaster) {
    const schemas = await initializeModulesAndFormSchemas(this, isMaster)

    this.schema = mergeTypeDefs(schemas)

    this.Schema = makeExecutableSchema({
      typeDefs: this.schema,
      resolvers: this.resolvers
    })

    const nuxt = await loadNuxt(isDev ? 'dev' : 'start')
    if (isDev) {
      build(nuxt)
    }

    this.apolloServer = new ApolloServer({
      schema: this.Schema,
      stopOnTerminationSignals: false,
      context: ({ req, res }) => {
        application.context.req = req
        application.context.res = res
        return application.context
      }
    })

    this.apolloHandler = this.apolloServer.createHandler()
    this.server = http.createServer(serverHandler(nuxt, this))

    this.server.on('error', (err) => {
      console.log(err)
    })
  }

  async close (callback) {
    try {
      this.connectionQueue.destroy()
      await this.apolloServer.stop()
      if (this.subscriptionServer) {
        await this.subscriptionServer.close()
      }
      this.server.close()
      callback()
    } catch (err) {
      callback(err)
    }
  }
}

const application = new Application(
  [
    CoreModule,
    AuthenticationModule,
    DocumentFlowModule
  ]
)

export default application
