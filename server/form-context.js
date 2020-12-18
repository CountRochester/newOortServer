import moment from 'moment'
import gqlSubscriptions from 'graphql-subscriptions'
import _ from 'lodash'
import Sequelize from 'sequelize'

const { PubSub } = gqlSubscriptions

moment.locale('ru')

export function formContext() {
  return {
    moment,
    pubsub: new PubSub(),
    _,
    Op: Sequelize.Op
  }
}