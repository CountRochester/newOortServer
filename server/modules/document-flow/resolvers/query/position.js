import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllPositions (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Position',
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getPosition (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Position',
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
