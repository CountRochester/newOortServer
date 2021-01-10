import { getAllEntitys, getEntity } from './common.js'

export default {
  async getAllTemas (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Tema',
      fieldRenamer: [
        {
          oldName: 'ContractId',
          newName: 'contractId'
        }
      ]
    }
    const result = await getAllEntitys(options, args, serverContext)
    console.log(result)
    return result
  },
  async getTema (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Tema',
      fieldRenamer: [
        {
          oldName: 'ContractId',
          newName: 'contractId'
        }
      ]
    }
    const result = await getEntity(options, args, serverContext)
    return result
  }
}
