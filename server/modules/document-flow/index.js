import consola from 'consola'

import { ApplicationModule } from '../common.js'
import docsDB from './db/docs-db.js'
import { buildDocsModel } from './model/index.js'

export class DocumentFlowModule extends ApplicationModule {
  static get moduleName() { return 'documentFlow' }
  
  constructor() {
    super()
  }

  async init (options) {
    try {
      await docsDB.init(options)
      this.dBlink = docsDB.link
      consola.success('Подключение к БД аутентификации успешно установлено.')

      this.dbModel = buildDocsModel(this.dBlink)
      consola.success('Модель БД аутентификации успешно инициализирована.')

    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

