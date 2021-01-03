import Sequelize from 'sequelize'

import * as keys from '../../../keys/index.js'

const { DB_HOST, DB_PORT, DB_AUTH, DB_USER_AUTH, DB_PSWD_AUTH } = keys.default

class AuthDB {
  constructor () {
    this.link = new Sequelize(DB_AUTH, DB_USER_AUTH, DB_PSWD_AUTH, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      logging: false
    })
  }

  async init (options) {
    try {
      if (options.isMaster) {
        await this.link.sync(options)
      }
      await this.link.authenticate()
    } catch (err) {
      throw new Error(`Не удаётся подключиться к БД аутентификации: ${err}`)
    }
  }
}

export default new AuthDB()
