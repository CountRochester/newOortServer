import consola from 'consola'

import { ApplicationModule } from '../common.js'
import schema from './schema/index.js'

export class CoreModule extends ApplicationModule {
  static get moduleName() { return 'coreModule' }
  
  constructor() {
    super()
    this.schema = schema
  }

  async init () {
    consola.success('Core module successfully loaded')
  }
}