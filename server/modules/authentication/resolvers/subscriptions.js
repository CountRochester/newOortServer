import { pubsub } from '../../common.js'

export default {
  userChanged: {
    subscribe: () => pubsub.asyncIterator('USER_CHANGED')
  }
}
