import consola from 'consola'

import { ApplicationModule } from '../common.js'
import docsDB from './db/docs-db.js'
import { buildDocsModel } from './model/index.js'

export class DocumentFlowModule extends ApplicationModule {
  static get moduleName () { return 'documentFlow' }

  constructor () {
    super()
    this.schema = ''
    this.class = DocumentFlowModule
    this.dBlink = docsDB.link
  }

  get moduleName () { return this.class.moduleName }

  async init (context, options) {
    this.context = context

    try {
      this.dbModel = buildDocsModel(this.dBlink)
      consola.success('Модель БД документооборота успешно инициализирована.')
      await docsDB.init(options)
      consola.success('Подключение к БД документооборота успешно установлено.')

      this.publicModuleData = {
        model: this.dbModel
      }
      this.resolvers = {}
      consola.success('Модуль документооборота успешно инициализирован.')
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

export default DocumentFlowModule
