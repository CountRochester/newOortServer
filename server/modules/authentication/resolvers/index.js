/* eslint-disable no-useless-escape */
// const fs = require('fs')
// const path = require('path')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const _ = require('lodash')
// const moment = require('moment')
// const Sequelize = require('sequelize')
// const Op = Sequelize.Op
// const pubsub = require('../../../graphql/pubsub').getInstance()

// const Auth = require('../../models/auth')
// const Docs = require('../../models/docs')
// const keys = require('../../../keys')
// const employee = require('./docs/employee')

import Query from './query.js'
import Mutations from './mutations.js'
import Subscription from './subscriptions.js'


export default (context, dbModel) => ({
  Query: Query(context, dbModel),
  Mutation: Mutations(context, dbModel),
  Subscription
})

