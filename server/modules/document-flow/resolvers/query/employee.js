import { getEntityByRequest } from './common.js'
import { reduceArrayByKey } from '../../../common.js'

function formEmployee (item) {
  const positionIds = []
  let subdivisionIds = []
  if (item.CurrentPositions.length) {
    item.CurrentPositions.forEach((el) => {
      positionIds.push(el.id)
      if (el.Subdivisions.length) {
        const currentSubs = reduceArrayByKey(el.Subdivisions, 'id')
        subdivisionIds = [...subdivisionIds, ...currentSubs]
      }
    })
  }
  return {
    id: item.id,
    firstName: item.firstName,
    secondName: item.secondName || '',
    secondNameDat: item.secondNameDat || '',
    middleName: item.middleName || '',
    tabelNumber: item.tabelNumber,
    phone1: item.phone1,
    phone2: item.phone2,
    phone3: item.phone3,
    email1: item.email1,
    email2: item.email2,
    positionIds,
    subdivisionIds,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }
}

function afterRequestEmployee (result) {
  return result.map(formEmployee)
}

export default {
  async getAllEmployees (_, args, serverContext) {
    const { documentFlow: { model } } = serverContext
    const request = {
      include: [
        {
          model: model.CurrentPosition,
          attributes: ['id'],
          include: [
            {
              model: model.Subdivision,
              attributes: ['id']
            }
          ]
        }
      ]
    }

    const options = {
      check: 'isLoggedCheck',
      entity: 'Employee',
      request,
      multiple: true,
      afterRequest: afterRequestEmployee
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  },

  async getEmployee (_, args, serverContext) {
    const { documentFlow: { model } } = serverContext
    const request = {
      where: {
        id: args.id
      },
      include: [
        {
          model: model.CurrentPosition,
          attributes: ['id'],
          include: [
            {
              model: model.Subdivision,
              attributes: ['id']
            }
          ]
        }
      ]
    }

    const options = {
      check: 'isLoggedCheck',
      entity: 'Employee',
      request,
      afterRequest: formEmployee
    }
    const result = await getEntityByRequest(options, args, serverContext)
    return result
  }
}
