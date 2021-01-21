import { getEntityByRequest } from './common.js'

export function formExtCurrentPosition (item) {
  return {
    id: item.id,
    startDate: item.startDate ? item.startDate : '',
    endDate: item.endDate ? item.endDate : '',
    extEmployeeId: item.ExtEmployeeId,
    positionId: item.PositionId,
    position: item.Position.posName,
    organisationId: item.OrganisationId,
    organisation: item.Organisation.orgName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }
}

export function formExtCurrentPositions (result) {
  return result.map(formExtCurrentPosition)
}

export const ExtCurrentPositionRequest = (serverContext) => {
  const { documentFlow: { model } } = serverContext
  const request = {
    include: [
      {
        model: model.Position,
        attributes: ['posName']
      },
      {
        model: model.Organisation,
        attributes: ['orgName']
      }
    ]
  }
  return request
}

export default {
  async getAllExtCurrentPositions (_, args, serverContext) {
    const request = ExtCurrentPositionRequest(serverContext)
    const options = {
      check: 'isLoggedCheck',
      entity: 'ExtCurrentPosition',
      multiple: true,
      request,
      afterRequest: formExtCurrentPositions
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  },

  async getExtCurrentPosition (_, args, serverContext) {
    const request = ExtCurrentPositionRequest(serverContext)
    request.where = { id: args.id }
    const options = {
      check: 'isLoggedCheck',
      entity: 'ExtCurrentPosition',
      multiple: true,
      request,
      afterRequest: formExtCurrentPositions
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result[0]
  }
}
