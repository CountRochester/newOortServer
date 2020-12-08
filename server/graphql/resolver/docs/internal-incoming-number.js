/* eslint-disable no-useless-escape */
const _ = require('lodash')
const { Op } = require('sequelize')
const moment = require('moment')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addInternalIncomingNumber (root, { internalIncomingNumber: { incNumber, incDate, prefix, DepartmentId, InternalId } }) {
    try {
      // const candidate = await Docs.InternalIncomingNumber.findOne({ where: { incNumber, DepartmentId } })
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      const year = moment(incDate).get('year').toString()
      const start = `${year}-01-01T00:00:00.000Z`
      const end = `${year}-12-31T23:59:59.999Z`
      const candidate = await Docs.InternalIncomingNumber.findOne({
        where: {
          incNumber,
          prefix,
          incDate: { [Op.gte]: start, [Op.lt]: end }
        }
      })
      if (candidate) {
        const message = {
          type: 'addInternalIncomingNumber',
          text: 'Такой входящий номер уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.InternalIncomingNumber.create({
          incNumber,
          incDate,
          prefix: iPrefix,
          DepartmentId,
          InternalId
        })
        const message = {
          type: 'addInternalIncomingNumber',
          text: 'Входящий номер успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ internalIncomingNumber: { incNumber, incDate, prefix, DepartmentId, InternalId } })
        }
        pubsub.publish('INTERNAL_INCOMING_NUMBER_CHANGED', {
          internalIncomingNumberChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addInternalIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editInternalIncomingNumber (root, { id, internalIncomingNumber: { incNumber, incDate, prefix, DepartmentId, InternalId } }) {
    try {
      const candidate = await Docs.InternalIncomingNumber.findByPk(id)
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      if (!candidate) {
        const message = {
          type: 'editInternalIncomingNumber',
          text: 'Входящий номер с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (!incNumber || !incDate || !DepartmentId) {
          const message = {
            type: 'editInternalIncomingNumber',
            text: 'Входящий номер, дата и отдел должны быть указаны',
            messageType: 'error'
          }
          return message
        } else {
          const year = moment(incDate).get('year').toString()
          const start = `${year}-01-01T00:00:00.000Z`
          const end = `${year}-12-31T23:59:59.999Z`
          const double = await Docs.InternalIncomingNumber.findOne({
            where: {
              id: { [Op.ne]: id },
              incNumber,
              prefix,
              incDate: { [Op.gte]: start, [Op.lt]: end }
            }
          })
          if (double) {
            const message = {
              type: 'editInternalIncomingNumber',
              text: 'Входящий номер уже занят',
              messageType: 'error'
            }
            return message
          } else {
            candidate.incNumber = incNumber
            candidate.incDate = incDate
            candidate.prefix = iPrefix
            candidate.DepartmentId = DepartmentId
            candidate.InternalId = InternalId
          }
        }
        await candidate.save()
        const message = {
          type: 'editInternalIncomingNumber',
          text: 'Входящий номер успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ internalIncomingNumber: { incNumber, incDate, prefix, DepartmentId, InternalId } })
        }
        pubsub.publish('INTERNAL_INCOMING_NUMBER_CHANGED', {
          internalIncomingNumberChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editInternalIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteInternalIncomingNumber (root, { id }) {
    try {
      const candidate = await Docs.InternalIncomingNumber.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteInternalIncomingNumber',
        text: `Входящий номер успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('INTERNAL_INCOMING_NUMBER_CHANGED', {
        internalIncomingNumberChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteInternalIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllInternalIncomingNumber () {
    try {
      return await Docs.InternalIncomingNumber.findAll()
    } catch (err) {
      throw err
    }
  },

  async getInternalIncomingNumber (root, { id }) {
    try {
      return await Docs.InternalIncomingNumber.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getInternalIncomingNumbers (root, { ids }) {
    try {
      return await Docs.InternalIncomingNumber.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  }
}
