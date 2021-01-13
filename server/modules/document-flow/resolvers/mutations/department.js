import { deleteEntitys, addEntity, editEntity } from './common.js'
import {
  getValidValue, defaultErrorHandler, isDepHeadCheck,
  reduceArrayByKey
} from '../../../common.js'

function validateDepartmentInput ({
  department: {
    depName, depNumber, shortName, depPrefix, parentDepartmentId
  }
}) {
  const iDepName = getValidValue(depName, 'name')
  const iShortName = getValidValue(shortName, 'name')
  const iDepPrefix = getValidValue(depPrefix, 'contractNumber')
  if (!iDepName.length) {
    throw new Error('Название отдела не должно быть пустым')
  }
  return {
    depName: iDepName,
    depNumber,
    shortName: iShortName,
    depPrefix: iDepPrefix
  }
}

async function editDepartmentFun (candidate, args) {
  const {
    depName, depNumber, shortName, depPrefix
  } = validateDepartmentInput(args)
  candidate.depName = depName
  candidate.depNumber = depNumber
  candidate.shortName = shortName
  candidate.depPrefix = depPrefix

  await afterCreateDepartment(candidate, args)
}

async function deleteDepDependences (args, serverContext) {
  const { documentFlow: { model }, Op } = serverContext
  const deleteOptions = { where: { DepartmentId: { [Op.in]: args.ids } } }
  await model.ExtIncNote.destroy(deleteOptions)
  await model.IncomingNumber.destroy(deleteOptions)
  await model.ExtIncState.destroy(deleteOptions)
  await model.IntIncomingNumber.destroy(deleteOptions)
  await model.IntIncState.destroy(deleteOptions)
  await model.InternalIncState.destroy(deleteOptions)
  await model.InternalIncomingNumber.destroy(deleteOptions)
  await model.Subdivision.destroy(deleteOptions)
}

async function afterCreateDepartment (newItem, {
  department: { parentDepartmentId }
}) {
  if (parentDepartmentId &&
      parentDepartmentId !== 'undefined' &&
      parentDepartmentId !== 'null') {
    await newItem.setParentDepartment(parentDepartmentId)
  } else {
    await newItem.setParentDepartment(null)
  }
}

async function getDepartmentsByIds (ids, serverContext) {
  const {
    documentFlow: { model: Department },
    Op
  } = serverContext

  const departments = await Department.findAll({
    where: { id: { [Op.in]: ids } }
  })
  const foundIds = reduceArrayByKey(departments, 'id')
  const notFoundIds = ids.filter(id => !foundIds.includes(id))
  if (notFoundIds.length) {
    throw new Error(`Отделов с id: ${notFoundIds} не существует`)
  }

  return departments
}

async function removeParentFromDeps (departments, serverContext) {
  await setParentToDeps(departments, null, serverContext)
}

async function setParentToDeps (departments, parentId, serverContext) {
  const {
    documentFlow: { model: Department }
  } = serverContext

  const setParent = dep => Department.prototype.setParentDepartment
    .call(dep, parentId)

  const promises = departments.map(setParent)
  await Promise.all(promises)
}

async function handleChildDeps (id, childIds, serverContext) {
  const {
    documentFlow: { model: Department }
  } = serverContext
  const childDeps = await Department.findAll({
    where: { parentDepartmentId: id }
  })
  let childDepsToSet = []
  if (childDeps.length) {
    await removeParentFromDeps(childDeps, serverContext)
  }
  if (childIds.length) {
    childDepsToSet = await getDepartmentsByIds(childIds, serverContext)
    await setParentToDeps(childDepsToSet, id, serverContext)
  }
  return { childDeps, childDepsToSet }
}

async function handleParentDep (department, parentId) {
  const parentDepartment = await department.getParentDepartment()
  if (parentId === 'null' || parentId === 'undefined') {
    await department.setParentDepartment(null)
  } else {
    await department.setParentDepartment(parentId)
  }
  if (parentDepartment) {
    return parentDepartment
  }
  return undefined
}

export default {
  async addDepartment (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Department',
      successText: 'Новый отдел успешно добавлен',
      subscriptionTypeName: 'departmentChanged',
      subscriptionKey: 'DEPARTMENT_CHANGED',
      getValidatedInputs: validateDepartmentInput,
      existErrorText: 'Такой отдел уже существует',
      uniqueFields: ['depName'],
      afterCreate: afterCreateDepartment
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editDepartment (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Department',
      entityName: 'Отдел',
      successText: 'Данные отдела успешно изменены',
      subscriptionTypeName: 'departmentChanged',
      subscriptionKey: 'DEPARTMENT_CHANGED',
      editFunction: editDepartmentFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteDepartments (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Department',
      successText: 'Отделы успешно удалены',
      subscriptionTypeName: 'departmentChanged',
      subscriptionKey: 'DEPARTMENT_CHANGED',
      beforeDeleteFunction: deleteDepDependences
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  },

  async editDepartmentChilds (_, { id, parentId, childIds }, serverContext) {
    const {
      authentication: { sessionStorage },
      documentFlow: { model: Department },
      core: { logger }, pubsub
    } = serverContext
    try {
      await isDepHeadCheck(sessionStorage)

      const department = await Department.findByPk(id)
      if (!department) {
        throw new Error(`Отдел с id: ${id} не найден`)
      }

      const {
        childDeps,
        childDepsToSet
      } = await handleChildDeps(id, childIds, serverContext)

      const parentDepartment = await handleParentDep(department, parentId)

      const items = [department, parentDepartment, ...childDeps, ...childDepsToSet]
      const ids = reduceArrayByKey(items, 'id')
      const message = {
        type: 'editDepartmentChilds',
        text: 'Подчинённость отделов успешно изменена',
        messageType: 'success',
        ids,
        item: JSON.stringify(items)
      }
      pubsub.publish('RESOLUTION_CHANGED', {
        resolutionChanged: {
          type: 'edit',
          ids,
          items
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err, logger)
    }
  }
}
