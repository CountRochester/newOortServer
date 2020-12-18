import consola from 'consola'
// import moment from 'moment'

import { ApplicationModule } from '../common.js'
import authDB from './db/auth-db.js'
import { buildAuthModel } from './model/index.js'

import schema from './schema/index.js'
import Resolvers from './resolvers/index.js'

// moment.locale('ru')

export class AuthenticationModule extends ApplicationModule{
  
  static get moduleName() { return 'authentication' }
  
  constructor() {
    super()
    this.schema = schema
  }

  async init (context, options) {
    this.context = context

    try {
      await authDB.init(options)
      this.dBlink = authDB.link
      consola.success('Подключение к БД аутентификации успешно установлено.')

      this.dbModel = buildAuthModel(this.dBlink)
      consola.success('Модель БД аутентификации успешно инициализирована.')

      await authDB.userInit(this.dbModel)

      this.resolvers = Resolvers(this.context, this.dbModel)

      this.publicModuleData = {
        model: this.dbModel
      }

    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

