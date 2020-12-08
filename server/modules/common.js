import gqlSubscriptions from 'graphql-subscriptions'
const { PubSub } = gqlSubscriptions

export const buildModel = (modelName, modelFun) => (dBLink, Sequelize) => dBLink.define(modelName, modelFun(Sequelize))

export const pubsub = (function () {
  let instance
  function init () {
    return new PubSub()
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = init()
      }
      return instance
    }
  }
})()

export class ApplicationModule {
  static get moduleName() { 
    throw new Error('Method not emplemented')
  }
  
  constructor() {
    this.dbModel = null
    this.dBlink = null

    this.schema = ''
    this.resolvers = {
      Query: {},
      Mutation: {},
      Subscription: {}
    }
  }

  async init () {
   throw new Error('Method not emplemented')
  }
}