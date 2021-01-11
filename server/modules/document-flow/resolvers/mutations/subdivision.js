import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

const renameOptions = [
  {
    oldName: 'DepartmentId',
    newName: 'departmentId'
  }
]

function validateSubdivisionInput ({
  subdivision: { name, fullName, departmentId }
}) {
  const subdivisionName = getValidValue(name, 'name')
  const fullSubdivisionName = getValidValue(fullName, 'name')
  if (!subdivisionName.length) {
    throw new Error('Название подразделения не должно быть пустым')
  }
  return {
    name: subdivisionName,
    fullName: fullSubdivisionName,
    DepartmentId: departmentId
  }
}

async function editSubdivisionFun (candidate, args, serverContext) {
  const { name, fullName, DepartmentId } = validateSubdivisionInput(args)
  if (DepartmentId) {
    await candidate.setDepartment(DepartmentId)
  }
  candidate.name = name
  candidate.fullName = fullName
}

export default {
  async addSubdivision (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Subdivision',
      successText: 'Подразделение успешно добавлено',
      subscriptionTypeName: 'subdivisionChanged',
      subscriptionKey: 'SUBDIVISION_CHANGED',
      getValidatedInputs: validateSubdivisionInput,
      existErrorText: 'Такая тема уже существует',
      uniqueFields: ['name'],
      fieldRenamer: renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editSubdivision (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Subdivision',
      entityName: 'Подразделение',
      successText: 'Данные подразделения успешно изменены',
      subscriptionTypeName: 'subdivisionChanged',
      subscriptionKey: 'SUBDIVISION_CHANGED',
      editFunction: editSubdivisionFun,
      fieldRenamer: renameOptions
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteSubdivisions (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Subdivision',
      successText: 'Подразделения успешно удалены',
      subscriptionTypeName: 'subdivisionChanged',
      subscriptionKey: 'SUBDIVISION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
