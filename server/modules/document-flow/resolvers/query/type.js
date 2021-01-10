import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllTypes (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Type'
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getType (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Type'
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
