import { pubsub } from '../../common.js'

// const pubSub = pubsub.getInstance()

export default {
  userChanged: {
    subscribe: () => pubsub.asyncIterator('USER_CHANGED')
  }
}
