import { deleteEntitys, addEntity, editEntity } from './common.js'
import {
  formCurrentPosition,
  currentPositionRequest
} from '../query/current-position.js'
import { getValidValue } from '../../../common.js'

function validateCurrentPositionInput (args) {
  const {
    startDate, endDate, employeeId, positionId, departmentId,
    extPrefix, intPrefix
  } = args.currentPosition
  const iExtPrefix = getValidValue(extPrefix, 'name')
  const iIntPrefix = getValidValue(intPrefix, 'name')

  if (!employeeId.length || !positionId.length || !departmentId.length) {
    throw new Error('Необходимо указать работника, должность и отдел')
  }
  const output = {
    startDate,
    endDate,
    EmployeeId: employeeId,
    PositionId: positionId,
    DepartmentId: departmentId,
    extPrefix: iExtPrefix,
    intPrefix: iIntPrefix
  }
  return output
}

function getRequest (args) {
  const {
    startDate, endDate, employeeId, positionId, departmentId
  } = args.currentPosition
  const where = {
    EmployeeId: employeeId,
    PositionId: positionId,
    DepartmentId: departmentId
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
  const { documentFlow: { model: CurrentPosition } } = serverContext
  const where = getRequest(args)

  const candidate = await CurrentPosition.findOne({ where })
  if (candidate) {
    // eslint-disable-next-line max-len
    throw new Error('Такая должность в этом интервале времени уже существует для данного сотрудника')
  }
}

async function afterCreateCurrentPosition (newItem, args) {
  const { subdivisionIds } = args.currentPosition
  if (subdivisionIds && subdivisionIds.length) {
    await newItem.setCurrentPositions(subdivisionIds)
  }
}

async function formCurrentPositionItem (candidate, args, serverContext) {
  const { documentFlow: { model } } = serverContext
  const curPos = await model.CurrentPosition
    .findByPk(args.id, currentPositionRequest(model))
  return formCurrentPosition(curPos)
}

async function editCurrentPositionFun (candidate, args) {
  const {
    startDate,
    endDate,
    EmployeeId,
    PositionId,
    DepartmentId,
    extPrefix,
    intPrefix
  } = validateCurrentPositionInput(args)
  const { subdivisionIds } = args.currentPosition

  await Promise.all([
    candidate.setEmployee(EmployeeId),
    candidate.setPosition(PositionId),
    candidate.setDepartment(DepartmentId),
    candidate.setSubdivisions(subdivisionIds)
  ])
  candidate.startDate = startDate
  candidate.endDate = endDate
  candidate.extPrefix = extPrefix
  candidate.intPrefix = intPrefix
}

export default {
  async addCurrentPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'CurrentPosition',
      successText: 'Новый работник успешно добавлен',
      subscriptionTypeName: 'employeeChanged',
      subscriptionKey: 'EMPLOYEE_CHANGED',
      getValidatedInputs: validateCurrentPositionInput,
      afterCreate: afterCreateCurrentPosition,
      existValidation: existCheck,
      formOutput: formCurrentPositionItem
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editCurrentPosition (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'CurrentPosition',
      entityName: 'Должность',
      successText: 'Должность успешно изменена',
      subscriptionTypeName: 'currentPositionChanged',
      subscriptionKey: 'CURRENT_POSITION_CHANGED',
      editFunction: editCurrentPositionFun,
      formOutput: formCurrentPositionItem
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteCurrentPositions (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'CurrentPosition',
      successText: 'Должности успешно удалены',
      subscriptionTypeName: 'currentPositionChanged',
      subscriptionKey: 'CURRENT_POSITION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
