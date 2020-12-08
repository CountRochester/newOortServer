const { PubSub } = require('graphql-subscriptions')

const pubsub = (function () {
  let instance
  function init () {
    // приватная часть
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

module.exports = pubsub
