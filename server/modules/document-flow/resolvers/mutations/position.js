import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

function validatePositionInput ({
  position: { posName, posNameDat, canSignExtDocs, canSignIntDocs }
}) {
  const positionName = getValidValue(posName, 'name')
  const positionNameDat = getValidValue(posNameDat, 'name')
  if (!positionName.length) {
    throw new Error('Название должности не должно быть пустым')
  }
  return {
    posName: positionName,
    posNameDat: positionNameDat,
    canSignExtDocs: !!canSignExtDocs,
    canSignIntDocs: !!canSignIntDocs
  }
}

function editPositionFun (candidate, args) {
  const {
    posName, posNameDat, canSignExtDocs, canSignIntDocs
  } = validatePositionInput(args)
  candidate.posName = posName
  candidate.posNameDat = posNameDat
  candidate.canSignExtDocs = !!canSignExtDocs
  candidate.canSignIntDocs = !!canSignIntDocs
}

export default {
  async addPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Position',
      successText: 'Новая должность успешно добавлена',
      subscriptionTypeName: 'positionChanged',
      subscriptionKey: 'POSITION_CHANGED',
      getValidatedInputs: validatePositionInput,
      existErrorText: 'Такая должность уже существует',
      uniqueFields: ['posName']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Position',
      entityName: 'Должность',
      successText: 'Должность успешно изменена',
      subscriptionTypeName: 'positionChanged',
      subscriptionKey: 'POSITION_CHANGED',
      editFunction: editPositionFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deletePositions (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Position',
      successText: 'Должности успешно удалены',
      subscriptionTypeName: 'positionChanged',
      subscriptionKey: 'POSITION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
