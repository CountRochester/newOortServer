import moment from 'moment'
import _ from 'lodash'
import Sequelize from 'sequelize'
import consola from 'consola'

import { pubsub } from './modules/common.js'

moment.locale('ru')

export function formContext () {
  return {
    moment,
    pubsub,
    _,
    Op: Sequelize.Op,
    consola
  }
}
export default formContext
