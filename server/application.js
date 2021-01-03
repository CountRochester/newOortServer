// import consola from 'consola'
// import passport from 'passport'

import fastify from 'fastify'
// import fastifySession from 'fastify-session'
// import fastifyCookie from 'fastify-cookie'
// import multer from 'fastify-multer'

import gqlTools from 'graphql-tools'
import gqlMerge from '@graphql-tools/merge'

// import passportStrategy from './middleware/passport-strategy'
import { AuthenticationModule } from './modules/authentication/index.js'
import { DocumentFlowModule } from './modules/document-flow/index.js'
import { CoreModule } from './modules/core/index.js'

// import * as keys from './keys/index.js'
// import fileMiddleware from './middleware/file.js'
// import fileHandler from './routes/upload.js'
// const SessionStore = require('./session-store/session-store')
import { formContext } from './form-context.js'

const { mergeTypeDefs } = gqlMerge
const { makeExecutableSchema } = gqlTools

// ----------------------------------------------
const app = fastify()

// ----------------------------------------------
// Подключение middleware
// app.register(fastifyCookie)
// app.register(fastifySession, {
//   cookieName: 'sessionId',
//   secret: keys.SESSION_KEY + keys.SESSION_KEY,
//   cookie: { secure: false },
//   expires: 4 * 60 * 60 * 1000
// })

// app.use(fileMiddleware.any())

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
    this.app = app
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
  }

  async init (isMaster) {
    const schemas = await initializeModulesAndFormSchemas(this, isMaster)

    this.schema = mergeTypeDefs(schemas)

    this.Schema = makeExecutableSchema({
      typeDefs: this.schema,
      resolvers: this.resolvers
    })
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
