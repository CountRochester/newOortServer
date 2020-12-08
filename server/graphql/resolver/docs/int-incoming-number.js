/* eslint-disable no-useless-escape */
const _ = require('lodash')
const { Op } = require('sequelize')
const moment = require('moment')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIntIncomingNumber (root, { intIncomingNumber: { incNumber, incDate, prefix, DepartmentId, IntIncomingId } }) {
    try {
      // const candidate = await Docs.IntIncomingNumber.findOne({ where: { incNumber, DepartmentId } })
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      const year = moment(incDate).get('year').toString()
      const start = `${year}-01-01T00:00:00.000Z`
      const end = `${year}-12-31T23:59:59.999Z`
      const candidate = await Docs.IntIncomingNumber.findOne({
        where: {
          incNumber,
          prefix,
          incDate: { [Op.gte]: start, [Op.lt]: end }
        }
      })
      if (candidate) {
        const message = {
          type: 'addIntIncomingNumber',
          text: 'Такой входящий номер уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.IntIncomingNumber.create({
          incNumber,
          incDate,
          prefix: iPrefix,
          DepartmentId,
          IntIncomingId
        })
        const message = {
          type: 'addIntIncomingNumber',
          text: 'Входящий номер успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ intIncomingNumber: { incNumber, incDate, prefix, DepartmentId, IntIncomingId } })
        }
        pubsub.publish('INT_INCOMING_NUMBER_CHANGED', {
          intIncomingNumberChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addIntIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntIncomingNumber (root, { id, intIncomingNumber: { incNumber, incDate, prefix, DepartmentId, IntIncomingId } }) {
    try {
      const candidate = await Docs.IntIncomingNumber.findByPk(id)
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      if (!candidate) {
        const message = {
          type: 'editIntIncomingNumber',
          text: 'Входящий номер с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (!incNumber || !incDate || !DepartmentId) {
          const message = {
            type: 'editIntIncomingNumber',
            text: 'Входящий номер, дата и отдел должны быть указаны',
            messageType: 'error'
          }
          return message
        } else {
          const year = moment(incDate).get('year').toString()
          const start = `${year}-01-01T00:00:00.000Z`
          const end = `${year}-12-31T23:59:59.999Z`
          const double = await Docs.IntIncomingNumber.findOne({
            where: {
              id: { [Op.ne]: id },
              incNumber,
              prefix,
              incDate: { [Op.gte]: start, [Op.lt]: end }
            }
          })
          if (double) {
            const message = {
              text: 'Входящий номер уже занят',
              messageType: 'error'
            }
            return message
          } else {
            candidate.incNumber = incNumber
            candidate.incDate = incDate
            candidate.prefix = iPrefix
            candidate.DepartmentId = DepartmentId
            candidate.IntIncomingId = IntIncomingId
          }
        }
        await candidate.save()
        const message = {
          type: 'editIntIncomingNumber',
          text: 'Входящий номер успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ intIncomingNumber: { incNumber, incDate, prefix, DepartmentId, IntIncomingId } })
        }
        pubsub.publish('INT_INCOMING_NUMBER_CHANGED', {
          intIncomingNumberChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editIntIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntIncomingNumber (root, { id }) {
    try {
      const candidate = await Docs.IntIncomingNumber.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteIntIncomingNumber',
        text: `Входящий номер успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('INT_INCOMING_NUMBER_CHANGED', {
        intIncomingNumberChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIntIncomingNumber () {
    try {
      return await Docs.IntIncomingNumber.findAll()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingNumber (root, { id }) {
    try {
      return await Docs.IntIncomingNumber.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingNumbers (root, { ids }) {
    try {
      return await Docs.IntIncomingNumber.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  }
}
