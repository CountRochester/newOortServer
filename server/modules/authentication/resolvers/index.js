import Query from './query.js'
import Mutations from './mutations.js'
import Subscription from './subscriptions.js'

export default (context, dbModel) => ({
  Query: Query(context, dbModel),
  Mutation: Mutations(context, dbModel),
  Subscription
})
