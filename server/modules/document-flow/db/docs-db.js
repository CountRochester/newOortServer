import Sequelize from 'sequelize'

import * as keys from '../../../keys/index.js'
const { DB_HOST, DB_PORT, DB_DOCS, DB_USER_DOCS, DB_PSWD_DOCS } = keys.default

class DocsDB {
  constructor() {
    const dbOptions = {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
    this.link = new Sequelize(DB_DOCS, DB_USER_DOCS, DB_PSWD_DOCS, dbOptions)
  }

  async init(options) {
    try {
      await this.link.sync(options)
      await this.link.authenticate()
    } catch (err) {
      throw new Error(`Не удаётся подключиться к БД документооборота: ${err}`)
    }
  }

}

export default new DocsDB()