// import consola from 'consola'
// import passport from 'passport'

import fastify from 'fastify'
import fastifySession from 'fastify-session'
import fastifyCookie from 'fastify-cookie'
import multer from 'fastify-multer'

import gqlTools from 'graphql-tools'
import gqlMerge from '@graphql-tools/merge'

// import passportStrategy from './middleware/passport-strategy'
import { AuthenticationModule } from './modules/authentication/index.js'
import { DocumentFlowModule } from './modules/document-flow/index.js'
import { CoreModule } from './modules/core/index.js'

import * as keys from './keys/index.js'
import fileMiddleware from './middleware/file.js'
// import fileHandler from './routes/upload.js'
// const SessionStore = require('./session-store/session-store')

const { mergeTypeDefs } = gqlMerge
const { makeExecutableSchema } = gqlTools

// ----------------------------------------------
const app = fastify()

// ----------------------------------------------
// Подключение middleware
app.register(fastifyCookie)
app.register(fastifySession, {
  cookieName: 'sessionId',
  secret: keys.SESSION_KEY + keys.SESSION_KEY,
  cookie: { secure: false },
  expires: 4 * 60 * 60 * 1000
})

// app.use(fileMiddleware.any())

// app.register(passport.initialize())
// passport.use(passportStrategy)
// ----------------------------------------------
// Регистрация роутов
app.register(multer.contentParser)
app.route({
  method: 'POST',
  url: '/upload',
  preHandler: fileMiddleware.any(),
  handler: () => { }//fileHandler
})

// const authModule = new AuthenticationModule()
// const docsModule = new DocumentFlowModule()

// authModule.init()
// docsModule.init()

// const Schema = makeExecutableSchema({
//   typeDefs: schema,
//   resolvers: apolloRes
// })

// const application = {
//   app,
//   schema,
//   modules: {
//     authentication: authModule,
//     documentFlow: docsModule
//   }
// }

class Application  {
  constructor(modules = []) {
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
  }

  async init() {
    const schemas = []
    for (const moduleName in this.modules) {
      const appModule = this.modules[moduleName]
      await appModule.init()

      appModule.schema && schemas.push(appModule.schema)

      for (const key in this.resolvers) {
        this.resolvers[key] = { ...this.resolvers[key], ...appModule.resolvers[key]}
      }
    }
    this.schema = mergeTypeDefs(schemas)

    console.log(this.schema)

    this.Schema = makeExecutableSchema({
      typeDefs: this.schema,
      resolvers: this.resolvers
    })
  }
}

const application = new Application([CoreModule, AuthenticationModule, DocumentFlowModule])

async function test() {
  await application.init()
  console.dir(application)
}

test()

export default application