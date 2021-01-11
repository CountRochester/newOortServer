import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

async function validateStateInput ({ state: { name, type, parentStateId } },
  { documentFlow: { model: { State } } }) {
  const stateName = getValidValue(name, 'name')
  const stateType = getValidValue(type, 'name')
  if (!stateName.length) {
    throw new Error('Название состояния не должно быть пустым')
  }
  const output = {
    name: stateName,
    type: stateType,
  }
  if (parentStateId) {
    const existedParentState = await State.findOne({ where: { parentStateId } })
    if (existedParentState) {
      throw new Error('Предшествующее состояние уже назначено')
    }
    output.parentStateId = parentStateId
  }
  return output
}

async function editStateFun (candidate, args) {
  const { name, type, parentStateId } = await validateStateInput(args)
  if (parentStateId === '0') {
    await candidate.setParentState(null)
  } else if (parentStateId && parentStateId !== '0') {
    await candidate.setParentState(parentStateId)
  }
  candidate.name = name
  candidate.type = type
}

async function deleteIncStates (args, serverContext) {
  const { documentFlow: { model }, Op } = serverContext
  const deleteOptions = { where: { StateId: { [Op.in]: args.ids } } }
  await model.ExtIncState.destroy(deleteOptions)
  await model.IntIncState.destroy(deleteOptions)
  await model.InternalIncState.destroy(deleteOptions)
}

export default {
  async addState (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'State',
      successText: 'Состояние успешно добавлено',
      subscriptionTypeName: 'stateChanged',
      subscriptionKey: 'STATE_CHANGED',
      getValidatedInputs: validateStateInput,
      existErrorText: 'Такое состояние уже существует',
      uniqueFields: ['name', 'type']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editState (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'State',
      entityName: 'Состояние',
      successText: 'Данные состояния успешно изменены',
      subscriptionTypeName: 'stateChanged',
      subscriptionKey: 'STATE_CHANGED',
      editFunction: editStateFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteStates (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'State',
      successText: 'Состояния успешно удалены',
      subscriptionTypeName: 'stateChanged',
      subscriptionKey: 'STATE_CHANGED',
      preDeleteFunction: deleteIncStates
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
