import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import consola from 'consola'

import * as keys from '../../../keys/index.js'
const { DB_HOST, DB_PORT, DB_AUTH, DB_USER_AUTH, DB_PSWD_AUTH } = keys.default

class AuthDB {
  constructor() {
    this.link = new Sequelize(DB_AUTH, DB_USER_AUTH, DB_PSWD_AUTH, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      logging: false
    })
  }

  async init(options) {
    try {
      await this.link.sync(options)
      await this.link.authenticate()
    } catch (err) {
      throw new Error(`Не удаётся подключиться к БД аутентификации: ${err}`)
    }
  }

  async userInit (dBmodel) {
    try {
      const users = await dBmodel.User.findAll() || {}
      if (!users.length) {
        const salt = await bcrypt.genSalt(10)
        const initGroup = await dBmodel.Group.create({
          name: 'Администратор',
          permissions: 255
        })
        const initUser = await dBmodel.User.create({
          name: 'administrator',
          password: await bcrypt.hash('administrator', salt)
        })
        await initUser.setGroups([initGroup])
        consola.info('Инициирующий пользователь успешно создан')
      } else {
        consola.info('Пользователи уже существуют')
      }
    } catch (err) {
      throw new Error(`Ошибка создания инициирующего пользователя: ${err}`)
    }
  }
}

export default new AuthDB()