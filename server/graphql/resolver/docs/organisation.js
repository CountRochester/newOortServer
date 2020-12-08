/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addOrganisation (root, { organisation: { orgName, postNumber, city, region, street, building, phone, fax, email } }) {
    try {
      const iOrgName = _.trim(_.replace(orgName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPostNumber = _.trim(_.replace(postNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iCity = _.trim(_.replace(city, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iRegion = _.trim(_.replace(region, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iStreet = _.trim(_.replace(street, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iBuilding = _.trim(_.replace(building, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone = _.trim(_.replace(phone, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iFax = _.trim(_.replace(fax, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail = _.trim(_.replace(email, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.Organisation.findOne({ where: { orgName: iOrgName } })
      if (candidate) {
        const message = {
          type: 'addOrganisation',
          text: 'Такая организация уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.Organisation.create({
          orgName: iOrgName,
          postNumber: iPostNumber,
          city: iCity,
          region: iRegion,
          street: iStreet,
          building: iBuilding,
          phone: iPhone,
          fax: iFax,
          email: iEmail
        })
        const message = {
          type: 'addOrganisation',
          text: 'Организация успешно добавлена',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ organisation: { orgName, postNumber, city, region, street, building, phone, fax, email } })
        }
        pubsub.publish('ORGANISATION_CHANGED', {
          organisationChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addOrganisation',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editOrganisation (root, { id, organisation: { orgName, postNumber, city, region, street, building, phone, fax, email } }) {
    try {
      const iOrgName = _.trim(_.replace(orgName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPostNumber = _.trim(_.replace(postNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iCity = _.trim(_.replace(city, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iRegion = _.trim(_.replace(region, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iStreet = _.trim(_.replace(street, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iBuilding = _.trim(_.replace(building, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone = _.trim(_.replace(phone, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iFax = _.trim(_.replace(fax, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail = _.trim(_.replace(email, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.Organisation.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editOrganisation',
          text: 'Организация с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iOrgName === '') {
          const message = {
            type: 'editOrganisation',
            text: 'Название организации не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.orgName = iOrgName
          candidate.postNumber = iPostNumber
          candidate.city = iCity
          candidate.region = iRegion
          candidate.street = iStreet
          candidate.building = iBuilding
          candidate.phone = iPhone
          candidate.fax = iFax
          candidate.email = iEmail
        }
        await candidate.save()
        const message = {
          type: 'editOrganisation',
          text: 'Данные организации успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ organisation: { orgName, postNumber, city, region, street, building, phone, fax, email } })
        }
        pubsub.publish('ORGANISATION_CHANGED', {
          organisationChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editOrganisation',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteOrganisation (root, { id }) {
    try {
      const candidate = await Docs.Organisation.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteOrganisation',
        text: `Организация успешно удалена`,
        messageType: 'success',
        id
      }
      pubsub.publish('ORGANISATION_CHANGED', {
        organisationChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteOrganisation',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllOrganisation () {
    try {
      return await Docs.Organisation.findAll()
    } catch (err) {
      throw err
    }
  },
  async getOrganisation (root, { id }) {
    try {
      return await Docs.Organisation.findByPk(id)
    } catch (err) {
      throw err
    }
  },
  async getOrganisationExtEmployees (root, { id }) {
    try {
      const organisation = await Docs.Organisation.findByPk(id)
      return organisation.getExtEmployees()
    } catch (err) {
      throw err
    }
  }
}
