import moment from 'moment'
import _ from 'lodash'
import Sequelize from 'sequelize'
import consola from 'consola'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pubsub } from './modules/common.js'

moment.locale('ru')

export function formContext () {
  return {
    moment,
    pubsub,
    _,
    Op: Sequelize.Op,
    consola,
    uuidv4,
    bcrypt,
    jwt
  }
}
export default formContext
