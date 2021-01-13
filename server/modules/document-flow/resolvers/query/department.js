import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllDepartments (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Department',
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getDepartment (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Department',
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
