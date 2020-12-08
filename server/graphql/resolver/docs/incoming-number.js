/* eslint-disable no-useless-escape */
const _ = require('lodash')
const { Op } = require('sequelize')
const moment = require('moment')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIncomingNumber (root, { incomingNumber: { incNumber, incDate, prefix, DepartmentId, ExtIncomingId } }) {
    try {
      // const candidate = await Docs.IncomingNumber.findOne({ where: { incNumber, incDate, DepartmentId } })
      const year = moment(incDate).get('year').toString()
      const start = `${year}-01-01T00:00:00.000Z`
      const end = `${year}-12-31T23:59:59.999Z`
      const candidate = await Docs.IncomingNumber.findOne({
        where: {
          incNumber,
          prefix,
          incDate: { [Op.gte]: start, [Op.lt]: end }
        }
      })
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      if (candidate) {
        const message = {
          type: 'addIncomingNumber',
          text: 'Такой входящий номер уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.IncomingNumber.create({
          incNumber,
          incDate,
          prefix: iPrefix,
          DepartmentId,
          ExtIncomingId
        })
        const message = {
          type: 'addIncomingNumber',
          text: 'Входящий номер успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ incomingNumber: { incNumber, incDate, prefix, DepartmentId, ExtIncomingId } })
        }
        pubsub.publish('INCOMING_NUMBER_CHANGED', {
          incomingNumberChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIncomingNumber (root, { id, incomingNumber: { incNumber, incDate, prefix, DepartmentId, ExtIncomingId } }) {
    try {
      const candidate = await Docs.IncomingNumber.findByPk(id)
      const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
      if (!candidate) {
        const message = {
          type: 'editIncomingNumber',
          text: 'Входящий номер с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (!incNumber || !incDate || !DepartmentId) {
          const message = {
            type: 'editIncomingNumber',
            text: 'Входящий номер, дата и отдел должны быть указаны',
            messageType: 'error'
          }
          return message
        } else {
          const year = moment(incDate).get('year').toString()
          const start = `${year}-01-01T00:00:00.000Z`
          const end = `${year}-12-31T23:59:59.999Z`
          const double = await Docs.IncomingNumber.findOne({
            where: {
              id: { [Op.ne]: id },
              incNumber,
              prefix,
              incDate: { [Op.gte]: start, [Op.lt]: end }
            }
          })
          if (double) {
            const message = {
              type: 'editIncomingNumber',
              text: 'Входящий номер уже занят',
              messageType: 'error'
            }
            return message
          } else {
            candidate.incNumber = incNumber
            candidate.incDate = incDate
            candidate.prefix = iPrefix
            candidate.DepartmentId = DepartmentId
            candidate.ExtIncomingId = ExtIncomingId
          }
        }
        await candidate.save()
        const message = {
          type: 'editIncomingNumber',
          text: 'Входящий номер успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ incomingNumber: { incNumber, incDate, prefix, DepartmentId, ExtIncomingId } })
        }
        pubsub.publish('INCOMING_NUMBER_CHANGED', {
          incomingNumberChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      // console.log(message)
      return message
    }
  },

  async deleteIncomingNumber (root, { id }) {
    try {
      const candidate = await Docs.IncomingNumber.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteIncomingNumber',
        text: `Входящий номер успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('INCOMING_NUMBER_CHANGED', {
        incomingNumberChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteIncomingNumber',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIncomingNumber () {
    try {
      return await Docs.IncomingNumber.findAll()
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumber (root, { id }) {
    try {
      return await Docs.IncomingNumber.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumbers (root, { ids }) {
    try {
      return await Docs.IncomingNumber.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberDepartment (root, { id }) {
    try {
      const incomingNumber = await Docs.IncomingNumber.findByPk(id)
      return await incomingNumber.getDepartment()
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberExtIncoming (root, { id }) {
    try {
      const incomingNumber = await Docs.IncomingNumber.findByPk(id)
      return await incomingNumber.getExtIncoming()
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberByDepartment (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      return await department.getIncomingNumbers()
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberInDepartment (root, { id, depId }) {
    try {
      return await Docs.IncomingNumber.findOne({ where: { ExtIncomingId: id, DepartmentId: depId } })
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberByExtIncoming (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getIncomingNumbers()
    } catch (err) {
      throw err
    }
  }
}
