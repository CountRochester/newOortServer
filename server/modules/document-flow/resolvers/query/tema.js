import { getAllEntitys, getEntity } from './common.js'

const renameOptions = [
  {
    oldName: 'ContractId',
    newName: 'contractId'
  }
]

export default {
  async getAllTemas (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Tema',
      fieldRenamer: renameOptions
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },
  async getTema (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Tema',
      fieldRenamer: renameOptions
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
