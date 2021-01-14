import { getEntityByRequest } from './common.js'

export function formCurrentPosition (item) {
  const subdivisionIds = []
  const subdivisions = []
  item.Subdivisions.forEach((el) => {
    subdivisionIds.push(el.id)
    subdivisions.push(el.name)
  })
  return {
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    employeeId: item.EmployeeId,
    positionId: item.PositionId,
    departmentId: item.DepartmentId,
    subdivisionIds,
    subdivisions: subdivisions.join('\n'),
    extPrefix: item.extPrefix,
    intPrefix: item.intPrefix,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }
}

export const currentPositionRequest = (model) => ({
  include: [
    {
      model: model.Subdivision,
      attributes: ['id', 'name'],
      through: {
        attributes: []
      }
    }
  ]
})

function afterRequestCurrentPosition (result) {
  return result.map(formCurrentPosition)
}

export default {
  async getAllCurrentPositions (_, args, serverContext) {
    const { documentFlow: { model } } = serverContext
    const request = currentPositionRequest(model)

    const options = {
      check: 'isLoggedCheck',
      entity: 'CurrentPosition',
      request,
      multiple: true,
      afterRequest: afterRequestCurrentPosition
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  },

  async getCurrentPosition (_, args, serverContext) {
    const { documentFlow: { model } } = serverContext
    const request = currentPositionRequest(model)
    request.where = {
      id: args.id
    }
    const options = {
      check: 'isLoggedCheck',
      entity: 'CurrentPosition',
      request,
      afterRequest: formCurrentPosition
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  }
}
