import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllOrganisations (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Organisation',
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getOrganisation (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Organisation',
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
