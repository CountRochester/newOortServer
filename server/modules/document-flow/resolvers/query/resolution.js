import { getAllEntitys, getEntity, getEntityByRequest } from './common.js'
import { reduceArrayByKey } from '../../../common.js'

const renameOptions = [
  {
    oldName: 'ExtIncomingId',
    newName: 'extIncomingId'
  },
  {
    oldName: 'IntIncomingId',
    newName: 'intIncomingId'
  },
  {
    oldName: 'InternalId',
    newName: 'internalId'
  }
]

async function getParentDepartmentId (id, serverContext) {
  const { documentFlow: { model: Department } } = serverContext
  const department = await Department.findByPk(id, {
    attributes: [
      'id',
      'parentDepartmentId'
    ],
    raw: true
  })
  return department.parentDepartmentId
}

async function getCurrentPositionsIdsInDeps (departmentIds, serverContext) {
  const { documentFlow: { model: CurrentPosition }, Op } = serverContext

  const currentPositions = await CurrentPosition.findAll({
    attributes: ['id'],
    where: {
      DepartmentId: { [Op.in]: departmentIds }
    },
    raw: true
  })

  return reduceArrayByKey(currentPositions, 'id')
}

async function getCurrentPositionIdsInDepAndParents (
  { departmentId }, serverContext
) {
  if (!departmentId) { return [] }

  const allParentDeps = [departmentId]
  let parentDepartmentId = await getParentDepartmentId(departmentId, serverContext)
  while (parentDepartmentId) {
    allParentDeps.push(parentDepartmentId)
    // eslint-disable-next-line no-await-in-loop
    parentDepartmentId = await getParentDepartmentId(
      parentDepartmentId, serverContext
    )
  }

  const currentPositionIds = await getCurrentPositionsIdsInDeps(
    allParentDeps, serverContext
  )

  return currentPositionIds
}

function formResolutionWithExecutants (resolution) {
  const output = { ...resolution }
  output.executants = reduceArrayByKey(output.executants, 'id')
  return output
}

export default {
  async getAllResolutions (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Resolution',
      fieldRenamer: renameOptions
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },

  async getResolution (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'Resolution',
      fieldRenamer: renameOptions
    }
    const result = await getEntity(options, args, serverContext)
    return result
  },

  async getAllResolutionsInDep (_, args, serverContext) {
    const { Op } = serverContext
    let options = {}
    const request = (beforeRequestResult) => ({
      where: {
        authorId: { [Op.in]: beforeRequestResult }
      }
    })

    options = {
      check: 'isLoggedCheck',
      entity: 'Resolution',
      request,
      beforeRequest: getCurrentPositionIdsInDepAndParents,
      multiple: true,
      fieldRenamer: renameOptions
    }

    const result = await getEntityByRequest(options, args, serverContext)
    return result
  },

  async getAllResolutionsInDepE (_, args, serverContext) {
    const { documentFlow: { model: CurrentPosition }, Op } = serverContext
    const request = (beforeRequestResult) => ({
      where: {
        authorId: { [Op.in]: beforeRequestResult }
      },
      include: [
        {
          model: CurrentPosition,
          as: 'executant',
          attributes: ['id']
        }
      ]
    })

    const options = {
      check: 'isLoggedCheck',
      entity: 'Resolution',
      request,
      beforeRequest: getCurrentPositionIdsInDepAndParents,
      multiple: true,
      fieldRenamer: renameOptions
    }

    const resolutions = await getEntityByRequest(options, args, serverContext)
    const result = resolutions.map(formResolutionWithExecutants)
    return result
  },

  async getResolutionsByIds (_, args, serverContext) {
    const { documentFlow: { model: CurrentPosition }, Op } = serverContext
    const request = {
      where: {
        authorId: { [Op.in]: args.ids }
      },
      include: [
        {
          model: CurrentPosition,
          as: 'executant',
          attributes: ['id']
        }
      ]
    }

    const options = {
      check: 'isLoggedCheck',
      entity: 'Resolution',
      request,
      multiple: true,
      fieldRenamer: renameOptions
    }

    const resolutions = await getEntityByRequest(options, args, serverContext)
    const result = resolutions.map(formResolutionWithExecutants)
    return result
  }
}
