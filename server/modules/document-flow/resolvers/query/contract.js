import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllContracts (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Contract'
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getContract (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Contract'
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
