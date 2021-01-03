import consola from 'consola'

import { ApplicationModule } from '../common.js'
import docsDB from './db/docs-db.js'
import { buildDocsModel } from './model/index.js'

export class DocumentFlowModule extends ApplicationModule {
  static get moduleName() { return 'documentFlow' }
  get moduleName() { return 'documentFlow' }
  
  constructor() {
    super()
    this.schema = ''
  }

  async init (context, options) {
    this.context = context
    
    try {
      await docsDB.init(options)
      this.dBlink = docsDB.link
      consola.success('Подключение к БД документооборота успешно установлено.')

      this.dbModel = buildDocsModel(this.dBlink)
      consola.success('Модель БД документооборота успешно инициализирована.')

      this.publicModuleData = {
        model: this.dbModel
      }
      this.resolvers = {}
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

