import Mutations from './mutations/index.js'
import Query from './query/index.js'
// import Subscription from './subscriptions.js'

export default (context, dbModel) => ({
  Query: Query(context, dbModel),
  Mutation: Mutations(context, dbModel),
  // Subscription
})
