/* eslint-disable class-methods-use-this */
import consola from 'consola'

import { ApplicationModule } from '../common.js'
import schema from './schema/index.js'

export class CoreModule extends ApplicationModule {
  static get moduleName () { return 'coreModule' }
  get moduleName () { return 'coreModule' }

  constructor () {
    super()
    this.schema = schema
  }

  init () {
    consola.success('Core module successfully loaded')
  }
}

export default CoreModule
