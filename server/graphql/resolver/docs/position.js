/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addPosition (root, { position: { posName, posNameDat, canSignExtDocs, canSignIntDocs } }) {
    try {
      const name = _.trim(_.replace(posName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const nameDat = _.trim(_.replace(posNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.Position.findOne({ where: { posName: name } })
      if (candidate) {
        const message = {
          type: 'addPosition',
          text: 'Такая должность уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.Position.create({
          posName: name,
          posNameDat: nameDat,
          canSignExtDocs: !!canSignExtDocs,
          canSignIntDocs: !!canSignIntDocs
        })
        const message = {
          type: 'addPosition',
          text: 'Должность успешно добавлена',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ position: { posName, posNameDat, canSignExtDocs, canSignIntDocs } })
        }
        pubsub.publish('POSITION_CHANGED', {
          positionChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editPosition (root, { id, position: { posName, posNameDat, canSignExtDocs, canSignIntDocs } }) {
    try {
      const name = _.trim(_.replace(posName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const nameDat = _.trim(_.replace(posNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.Position.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editPosition',
          text: 'Должность с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (name === '') {
          const message = {
            type: 'editPosition',
            text: 'Название должности не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.posName = name
          candidate.posNameDat = nameDat
          candidate.canSignExtDocs = !!canSignExtDocs
          candidate.canSignIntDocs = !!canSignIntDocs
        }
        await candidate.save()
        const message = {
          type: 'editPosition',
          text: 'Должность успешно изменена',
          messageType: 'success',
          id,
          item: JSON.stringify({ position: { posName, posNameDat, canSignExtDocs, canSignIntDocs } })
        }
        pubsub.publish('POSITION_CHANGED', {
          positionChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deletePosition (root, { id }) {
    try {
      const candidate = await Docs.Position.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deletePosition',
        text: `Должность успешно удалена`,
        messageType: 'success',
        id
      }
      pubsub.publish('POSITION_CHANGED', {
        positionChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deletePosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllPosition () {
    try {
      return await Docs.Position.findAll()
    } catch (err) {
      throw err
    }
  },
  async getPosition (root, { id }) {
    try {
      return await Docs.Position.findByPk(id)
    } catch (err) {
      throw err
    }
  },
  async getPositionEmployees (root, { id }) {
    try {
      const position = await this.getPosition({ id })
      return position.getEmployees()
    } catch (err) {
      throw err
    }
  }
}
