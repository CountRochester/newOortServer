export { default as pubsub } from './pub-sub.js'

// eslint-disable-next-line max-len
export const buildModel = (modelName, modelFun) => (dBLink, Sequelize) => dBLink.define(modelName, modelFun(Sequelize))

export class ApplicationModule {
  // eslint-disable-next-line class-methods-use-this
  get moduleName () {
    throw new Error('Method not emplemented')
  }

  constructor () {
    this.dbModel = null
    this.dBlink = null
    this.context = {}
    this.publicModuleData = {}

    this.schema = ''
    this.resolvers = {
      Query: {},
      Mutation: {},
      Subscription: {}
    }
  }

  // eslint-disable-next-line class-methods-use-this, require-await
  async init () {
    throw new Error('Method not emplemented')
  }
}

export function reduceArrayByKey (arr, key, toSting) {
  if (toSting) {
    return arr.reduce((acc, item) => [...acc, item[key].toString()], [])
  }
  return arr.reduce((acc, item) => [...acc, item[key]], [])
}

export function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

export function checkPermission (permission, decodedToken) {
  return permission <= decodedToken.permission
}
