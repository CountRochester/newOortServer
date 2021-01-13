import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

function validateTypeInput ({ type: { name } }) {
  const typeName = getValidValue(name, 'name')
  if (!typeName.length) {
    throw new Error('Название типа документа не должно быть пустым')
  }
  return {
    name: typeName
  }
}

function editTypeFun (candidate, args) {
  const { name } = validateTypeInput(args)
  candidate.name = name
}

export default {
  async addTema (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Type',
      successText: 'Новый тип документа успешно добавлен',
      subscriptionTypeName: 'typeChanged',
      subscriptionKey: 'TYPE_CHANGED',
      getValidatedInputs: validateTypeInput,
      existErrorText: 'Такой тип документа уже существует',
      uniqueFields: ['name']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editTema (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Type',
      entityName: 'Тип документа',
      successText: 'Данные типа документа успешно изменены',
      subscriptionTypeName: 'typeChanged',
      subscriptionKey: 'TYPE_CHANGED',
      editFunction: editTypeFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteTypes (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Type',
      successText: 'Типы документов успешно удалены',
      subscriptionTypeName: 'typeChanged',
      subscriptionKey: 'TYPE_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
