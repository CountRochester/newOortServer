import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

const renameOptions = [
  {
    oldName: 'ContractId',
    newName: 'contractId'
  }
]

function validateTemaInput ({ tema: { name, contractId } }) {
  const temaName = getValidValue(name, 'name')
  if (!temaName.length) {
    throw new Error('Название темы не должно быть пустым')
  }
  return {
    name: temaName,
    ContractId: contractId
  }
}

async function editTemaFun (candidate, args, serverContext) {
  const { name, ContractId } = validateTemaInput(args)
  if (ContractId) {
    await candidate.setContract(ContractId)
  }
  candidate.name = name
}

export default {
  async addTema (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Tema',
      subscriptionTypeName: 'temaChanged',
      successText: 'Новая тема успешно добавлена',
      subscriptionKey: 'TEMA_CHANGED',
      getValidatedInputs: validateTemaInput,
      existErrorText: 'Такая тема уже существует',
      uniqueFields: ['name'],
      fieldRenamer: renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editTema (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Tema',
      entityName: 'Тема',
      subscriptionTypeName: 'temaChanged',
      successText: 'Данные темы успешно изменены',
      subscriptionKey: 'TEMA_CHANGED',
      editFunction: editTemaFun,
      fieldRenamer: renameOptions
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteTemas (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Tema',
      successText: 'Темы успешно удалены',
      subscriptionTypeName: 'temaChanged',
      subscriptionKey: 'TEMA_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}

// async addTema (_, { tema: { name, contractId } }, {
//   authentication: { sessionStorage },
//   documentFlow: { model: { Tema } },
//   pubsub
// }) {
//   try {
//     await isManagerCheck(sessionStorage)
//     const temaName = getValidValue(name, 'name')
//     const candidate = await Tema.findOne({ where: { name: temaName } })
//     if (candidate) {
//       throw new Error('Такая тема уже существует')
//     }
//     const newItem = await Tema.create({
//       name: temaName,
//       ContractId: contractId
//     })
//     const message = {
//       type: 'addTema',
//       text: 'Новая тема успешно добавлена',
//       messageType: 'success',
//       id: newItem.id,
//       item: JSON.stringify({ tema: { name: temaName, contractId } })
//     }
//     pubsub.publish('TEMA_CHANGED', {
//       typeChanged: {
//         type: 'add',
//         id: newItem.id,
//         item: fieldRenamer([newItem.dataValues], renameOptions)[0]
//       }
//     })
//     return message
//   } catch (err) {
//     return defaultErrorHandler(err)
//   }
// },

// async editTema (_, { id, tema: { name, contractId } }, {
//   authentication: { sessionStorage },
//   documentFlow: { model: { Tema } },
//   pubsub
// }) {
//   try {
//     await isManagerCheck(sessionStorage)
//     const temaName = getValidValue(name, 'name')
//     const candidate = await Tema.findByPk(id)
//     if (!candidate) {
//       throw new Error(`Темы с id: ${id} не существует`)
//     }
//     if (temaName === '') {
//       throw new Error('Название темы не должно быть пустым')
//     }
//     candidate.name = temaName

//     await candidate.save()
//     await candidate.setContract(contractId)
//     const message = {
//       type: 'editTema',
//       text: 'Данные темы успешно изменены',
//       messageType: 'success',
//       id,
//       item: JSON.stringify({ type: { name: temaName, contractId } })
//     }
//     pubsub.publish('TEMA_CHANGED', {
//       typeChanged: {
//         type: 'edit',
//         id: candidate.id,
//         item: fieldRenamer([candidate.dataValues], renameOptions)[0]
//       }
//     })
//     return message
//   } catch (err) {
//     return defaultErrorHandler(err)
//   }
// },
