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

// async addType (_, { type: { name } }, {
//   authentication: { sessionStorage },
//   documentFlow: { model: { Type } },
//   pubsub
// }) {
//   try {
//     await isManagerCheck(sessionStorage)
//     const typeName = getValidValue(name, 'name')
//     const candidate = await Type.findOne({ where: { name: typeName } })
//     if (candidate) {
//       throw new Error('Такой тип документа уже существует')
//     }
//     const newItem = await Type.create({
//       name: typeName
//     })
//     const message = {
//       type: 'addType',
//       text: 'Новый тип документа успешно добавлен',
//       messageType: 'success',
//       id: newItem.id,
//       item: JSON.stringify({ type: { name: typeName } })
//     }
//     pubsub.publish('TYPE_CHANGED', {
//       typeChanged: {
//         type: 'add',
//         id: newItem.id,
//         item: newItem
//       }
//     })
//     return message
//   } catch (err) {
//     return defaultErrorHandler(err)
//   }
// },

// async editType (_, { id, type: { name } }, {
//   authentication: { sessionStorage },
//   documentFlow: { model: { Type } },
//   pubsub
// }) {
//   try {
//     await isManagerCheck(sessionStorage)
//     const typeName = getValidValue(name, 'name')
//     const candidate = await Type.findByPk(id)
//     if (!candidate) {
//       throw new Error(`Тип документа с id: ${id} не существует`)
//     }
//     if (typeName === '') {
//       throw new Error('Название типа документа не должно быть пустым')
//     }
//     candidate.name = typeName

//     await candidate.save()
//     const message = {
//       type: 'editType',
//       text: 'Данные типа документа успешно изменены',
//       messageType: 'success',
//       id,
//       item: JSON.stringify({ type: { name: typeName } })
//     }
//     pubsub.publish('TYPE_CHANGED', {
//       typeChanged: {
//         type: 'edit',
//         id: candidate.id,
//         item: candidate
//       }
//     })
//     return message
//   } catch (err) {
//     return defaultErrorHandler(err)
//   }
// },
