import { getEntityByRequest } from './common.js'
import { reduceArrayByKey } from '../../../common.js'

function formExtEmployee (item) {
  const output = {}
  const keys = Object.keys(item.dataValues)
    .filter(key => key !== 'ExtCurrentPositions')
  keys.forEach((key) => {
    output[key] = item.dataValues[key]
  })
  const extCurPos = item.dataValues.ExtCurrentPositions
  output.extCurrentPositionIds = reduceArrayByKey(extCurPos, 'id')
  return output
}

function afterRequestExtEmployee (result) {
  return result.map(formExtEmployee)
}

export async function formExtEmployeeData (item, _, serverContext) {
  const { id } = item
  const { documentFlow: { model: ExtEmployee } } = serverContext
  const request = getExtEmployeeRequest(serverContext)
  const data = await ExtEmployee.findByPk(id, request)
  return formExtEmployee(data)
}

export function getExtEmployeeRequest (serverContext) {
  const { documentFlow: { model } } = serverContext
  const request = {
    include: [
      {
        model: model.ExtCurrentPosition,
        attributes: ['id']
      }
    ]
  }
  return request
}

export default {
  async getAllExtEmployees (_, args, serverContext) {
    const request = getExtEmployeeRequest(serverContext)

    const options = {
      check: 'isLoggedCheck',
      entity: 'ExtCurrentPosition',
      request,
      multiple: true,
      afterRequest: afterRequestExtEmployee
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  },

  async getExtEmployee (_, args, serverContext) {
    const request = getExtEmployeeRequest(serverContext)
    request.where = { id: args.id }

    const options = {
      check: 'isLoggedCheck',
      entity: 'ExtCurrentPosition',
      request,
      multiple: true,
      afterRequest: afterRequestExtEmployee
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result[0]
  }
}
