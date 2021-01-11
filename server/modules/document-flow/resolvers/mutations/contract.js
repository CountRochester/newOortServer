import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue, formatDate } from '../../../common.js'

function validateContractInput ({ contract: { number, date } }) {
  const contractNumber = getValidValue(number, 'contractNumber')
  if (!contractNumber) {
    throw new Error('Номер контракта не должен быть пустым')
  }
  let iDate
  if (date) {
    iDate = formatDate(date)
  }
  return {
    number: contractNumber,
    date: iDate
  }
}

function editContractFun (candidate, args) {
  const { number, date } = validateContractInput(args)
  if (date) {
    candidate.date = date
  }
  candidate.number = number
}

export default {
  async addContract (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Contract',
      subscriptionTypeName: 'contractChanged',
      successText: 'Контракт успешно добавлен',
      subscriptionKey: 'CONTRACT_CHANGED',
      getValidatedInputs: validateContractInput,
      existErrorText: 'Такой контракт уже существует',
      uniqueFields: ['number']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editContract (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Contract',
      entityName: 'Контракт',
      subscriptionTypeName: 'contractChanged',
      successText: 'Контракт успешно изменён',
      subscriptionKey: 'CONTRACT_CHANGED',
      editFunction: editContractFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteContracts (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Contract',
      successText: 'Контракты успешно удалены',
      subscriptionTypeName: 'contractChanged',
      subscriptionKey: 'CONTRACT_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
