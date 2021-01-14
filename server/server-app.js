import consola from 'consola'
import stws from 'subscriptions-transport-ws'
import gql from 'graphql'

import application from './application.js'

import config from '../nuxt.config.mjs'
import keys from './keys/index.js'

// ----------------------------------------------
const { execute, subscribe } = gql
const { SubscriptionServer } = stws

config.dev = process.env.NODE_ENV !== 'production'
// ----------------------------------------------

function start (app) {
  app.server.listen(keys.APP_PORT, (err) => {
    if (err) { console.trace(err) }

    app.subscriptionServer = SubscriptionServer.create(
      {
        schema: app.Schema,
        execute,
        subscribe
      },
      {
        server: app.server,
        path: '/graphql'
      }
    )
    consola.warn('Server started OK')
  })
}
// ----------------------------------------------

export default async function startApp (isMaster) {
  try {
    await application.init(isMaster)
    if (!isMaster) {
      start(application)
    }
    return application
  } catch (err) {
    consola.error(err)
    return undefined
  }
}
