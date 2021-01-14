/*
  const options = {
    connection,
    nuxt: nuxtInstance,
    app: appInstance
  }
*/
const router = {
  graphql: async (options) => {
    const { connection: { req, res }, app } = options
    await app.apolloHandler(req, res)
  },
  default: async (options) => {
    const { connection: { req, res }, nuxt } = options
    await nuxt.render(req, res)
  }
}

function choseHandler (route) {
  // if (trimmedPath.includes(`${config.STATIC_PATH}`)) {
  //   return router.public
  // }
  // if (trimmedPath.includes(`${config.STORAGE_ALIAS}`)) {
  //   return router.fileStorage
  // }
  return router[route]
    ? router[route]
    : router.default
}

export default async (options) => {
  const { trimmedPath } = options.connection.data
  const handler = choseHandler(trimmedPath)
  await handler(options)
}
