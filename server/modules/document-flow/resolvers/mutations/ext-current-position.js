import { deleteEntitys, addEntity, editEntity } from './common.js'
import {
  ExtCurrentPositionRequest,
  formExtCurrentPosition
} from '../query/ext-current-position.js'

function validateExtCurPosInput ({
  extCurrentPosition: {
    startDate, endDate, extEmployeeId, positionId, organisationId
  }
}) {
  if (!extEmployeeId.length || !positionId.length || !organisationId.length) {
    throw new Error('Необходимо указать работника, должность и организацию')
  }
  const output = {
    startDate,
    endDate,
    ExtEmployeeId: extEmployeeId,
    PositionId: positionId,
    OrganisationId: organisationId
  }
  return output
}

function getRequest (args) {
  const {
    startDate, endDate, extEmployeeId, positionId, organisationId
  } = args.extCurrentPosition
  const where = {
    ExtEmployeeId: extEmployeeId,
    PositionId: positionId,
    OrganisationId: organisationId
  }
  if (startDate) {
    where.startDate = startDate
  }
  if (endDate) {
    where.endDate = endDate
  }
  return where
}

async function existCheck (args, serverContext) {
  const { documentFlow: { model: ExtCurrentPosition } } = serverContext
  const where = getRequest(args)

  const candidate = await ExtCurrentPosition.findOne({ where })
  if (candidate) {
    // eslint-disable-next-line max-len
    throw new Error('Такая должность в этом интервале времени уже существует для данного сотрудника')
  }
}

async function formExtCurrentPositionItem (candidate, args, serverContext) {
  const { documentFlow: { model } } = serverContext
  const extCurPos = await model.ExtCurrentPosition
    .findByPk(args.id, ExtCurrentPositionRequest(serverContext))
  return formExtCurrentPosition(extCurPos)
}

async function editExtCurrentPositionFun (candidate, args) {
  const {
    startDate,
    endDate,
    ExtEmployeeId,
    PositionId,
    OrganisationId
  } = validateExtCurPosInput(args)

  await Promise.all([
    candidate.setExtEmployee(ExtEmployeeId),
    candidate.setPosition(PositionId),
    candidate.setOrganisation(OrganisationId),
  ])
  candidate.startDate = startDate
  candidate.endDate = endDate
}

export default {
  async addExtCurrentPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtCurrentPosition',
      successText: 'Должность успешно добавлена',
      subscriptionTypeName: 'extCurrentPositionChanged',
      subscriptionKey: 'EXT_CURRENT_POSITION_CHANGED',
      getValidatedInputs: validateExtCurPosInput,
      existValidation: existCheck,
      formOutput: formExtCurrentPositionItem
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editExtCurrentPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtCurrentPosition',
      entityName: 'Должность',
      successText: 'Должность успешно изменена',
      subscriptionTypeName: 'extCurrentPositionChanged',
      subscriptionKey: 'EXT_CURRENT_POSITION_CHANGED',
      editFunction: editExtCurrentPositionFun,
      formOutput: formExtCurrentPositionItem
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteExtCurrentPositions (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'ExtCurrentPosition',
      successText: 'Должности успешно удалены',
      subscriptionTypeName: 'extCurrentPositionChanged',
      subscriptionKey: 'EXT_CURRENT_POSITION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
