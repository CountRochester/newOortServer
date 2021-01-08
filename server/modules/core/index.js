/* eslint-disable class-methods-use-this */
import consola from 'consola'
import logger from './logger.js'

import { ApplicationModule } from '../common.js'
import schema from './schema/index.js'

export class CoreModule extends ApplicationModule {
  static get moduleName () { return 'core' }

  constructor () {
    super()
    this.schema = schema
    this.class = CoreModule
  }

  get moduleName () { return this.class.moduleName }

  async init (context) {
    consola.success('Core module successfully loaded')
    await logger.init(context)
    this.publicModuleData = {
      logger
    }
  }
}

export default CoreModule
