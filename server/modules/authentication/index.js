import consola from 'consola'
// import moment from 'moment'
import bcrypt from 'bcrypt'

import { ApplicationModule } from '../common.js'
import authDB from './db/auth-db.js'
import { buildAuthModel } from './model/index.js'

import schema from './schema/index.js'
import Resolvers from './resolvers/index.js'

// moment.locale('ru')

export class AuthenticationModule extends ApplicationModule {
  constructor () {
    super()
    this.schema = schema
    this.class = AuthenticationModule
  }

  static get moduleName () { return 'authentication' }

  get moduleName () { return this.class.moduleName }

  async init (context, options) {
    this.context = context

    try {
      await authDB.init(options)
      this.dBlink = authDB.link
      consola.success('Подключение к БД аутентификации успешно установлено.')

      this.dbModel = buildAuthModel(this.dBlink)
      consola.success('Модель БД аутентификации успешно инициализирована.')

      if (options.isMaster) {
        await this.userInit()
      }

      this.resolvers = Resolvers(this.context, this.dbModel)

      this.publicModuleData = {
        model: this.dbModel
      }
    } catch (err) {
      consola.error(err)
      throw err
    }
  }

  async userInit () {
    try {
      const users = await this.dbModel.User.findAll() || {}
      if (!users.length) {
        const salt = await bcrypt.genSalt(10)
        const initGroup = await this.dbModel.Group.create({
          name: 'Администратор',
          permissions: 255
        })
        const initUser = await this.dbModel.User.create({
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

export default AuthenticationModule
