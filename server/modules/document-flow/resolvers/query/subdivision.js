import { getAllEntitys, getEntity } from './common.js'

const renameOptions = [
  {
    oldName: 'DepartmentId',
    newName: 'departmentId'
  }
]

export default {
  async getAllSubdivisions (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Subdivision',
      fieldRenamer: renameOptions
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getSubdivision (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Subdivision',
      fieldRenamer: renameOptions
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
