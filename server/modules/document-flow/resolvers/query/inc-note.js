import { getEntity } from './common.js'

export default {
  async getExtIncNote (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'ExtIncNote'
    }
    const result = await getEntity(options, args, serverContext)
    return result
  },

  async getIntIncNote (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'IntIncNote'
    }
    const result = await getEntity(options, args, serverContext)
    return result
  },

  async getInternalNote (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'InternalNote'
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
