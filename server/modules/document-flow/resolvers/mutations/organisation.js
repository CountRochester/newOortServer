import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

function validateOrganisationInput ({
  organisation: {
    orgName, postNumber, city, region, street, building, phone, fax, email
  }
}) {
  const iOrgName = getValidValue(orgName, 'name')
  const iPostNumber = getValidValue(postNumber, 'name')
  const iCity = getValidValue(city, 'name')
  const iRegion = getValidValue(region, 'name')
  const iStreet = getValidValue(street, 'name')
  const iBuilding = getValidValue(building, 'name')
  const iPhone = getValidValue(phone, 'name')
  const iFax = getValidValue(fax, 'name')
  const iEmail = getValidValue(email, 'email')
  if (!iOrgName.length) {
    throw new Error('Название организации не должно быть пустым')
  }
  return {
    orgName: iOrgName,
    postNumber: iPostNumber,
    city: iCity,
    region: iRegion,
    street: iStreet,
    building: iBuilding,
    phone: iPhone,
    fax: iFax,
    email: iEmail
  }
}

function editOrganisationFun (candidate, args) {
  const {
    orgName, postNumber, city, region, street, building, phone, fax, email
  } = validateOrganisationInput(args)
  candidate.orgName = orgName
  candidate.postNumber = postNumber
  candidate.city = city
  candidate.region = region
  candidate.street = street
  candidate.building = building
  candidate.phone = phone
  candidate.fax = fax
  candidate.email = email
}

export default {
  async addOrganisation (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Organisation',
      successText: 'Организация успешно добавлена',
      subscriptionTypeName: 'organisationChanged',
      subscriptionKey: 'ORGANISATION_CHANGED',
      getValidatedInputs: validateOrganisationInput,
      existErrorText: 'Такая организация уже существует',
      uniqueFields: ['orgName']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editOrganisation (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Organisation',
      entityName: 'Организация',
      successText: 'Данные организации успешно изменены',
      subscriptionTypeName: 'organisationChanged',
      subscriptionKey: 'ORGANISATION_CHANGED',
      editFunction: editOrganisationFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteOrganisations (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Organisation',
      successText: 'Организации успешно удалены',
      subscriptionTypeName: 'organisationChanged',
      subscriptionKey: 'ORGANISATION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
