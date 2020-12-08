/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addType (root, { type: { name } }) {
    try {
      const typeName = _.trim(_.replace(name, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\/\\`\~]+/g, ''))
      const candidate = await Docs.Type.findOne({ where: { name: typeName } })
      if (candidate) {
        const message = {
          type: 'addType',
          text: 'Такой тип документа уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.Type.create({
          name: typeName
        })
        const message = {
          type: 'addType',
          text: 'Новый тип документа успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ type: { name } })
        }
        pubsub.publish('TYPE_CHANGED', {
          typeChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addType',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editType (root, { id, type: { name } }) {
    try {
      const typeName = _.trim(_.replace(name, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\/\\`\~]+/g, ''))
      const candidate = await Docs.Type.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editType',
          text: 'Тип документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (typeName === '') {
          const message = {
            type: 'editType',
            text: 'Название типа документа не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.name = typeName
        }
        await candidate.save()
        const message = {
          type: 'editType',
          text: 'Данные типа документа успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ type: { name } })
        }
        pubsub.publish('TYPE_CHANGED', {
          typeChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editType',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteType (root, { id }) {
    try {
      const candidate = await Docs.Type.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteType',
        text: `Тип документа успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('TYPE_CHANGED', {
        typeChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteType',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllType () {
    try {
      return await Docs.Type.findAll()
    } catch (err) {
      throw err
    }
  },

  async getType (root, { id }) {
    try {
      return await Docs.Type.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingsByType (root, { id }) {
    try {
      const type = await Docs.Type.findByPk(id)
      return await type.getExtIncomings()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingsByType (root, { id }) {
    try {
      const type = await Docs.Type.findByPk(id)
      return await type.getExtOutgoings()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingsByType (root, { id }) {
    try {
      const type = await Docs.Type.findByPk(id)
      return await type.getIntIncomings()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingsByType (root, { id }) {
    try {
      const type = await Docs.Type.findByPk(id)
      return await type.getIntOutgoings()
    } catch (err) {
      throw err
    }
  },

  async getInternalsByType (root, { id }) {
    try {
      const type = await Docs.Type.findByPk(id)
      return await type.getInternals()
    } catch (err) {
      throw err
    }
  }
}
