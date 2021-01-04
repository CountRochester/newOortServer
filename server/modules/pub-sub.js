import gqlSubscriptions from 'graphql-subscriptions'

const { PubSub } = gqlSubscriptions

class ClusterPubSub {
  constructor () {
    this.pubSub = new PubSub()
  }

  publish (subscription, payload, resend) {
    if (!resend) {
      const workerMessage = {
        pubSub: {
          subscription,
          payload
        }
      }
      process.send(JSON.stringify(workerMessage))
    }
    this.pubSub.publish(subscription, payload)
  }

  asyncIterator (...args) {
    return this.pubSub.asyncIterator(...args)
  }
}
const pubSub = new ClusterPubSub()
export default pubSub
