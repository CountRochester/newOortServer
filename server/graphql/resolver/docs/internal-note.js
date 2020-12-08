/* eslint-disable no-useless-escape */
// const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addInternalNote (root, { internalNote: { text, InternalId, DepartmentId } }) {
    try {
      // const iText = _.trim(_.replace(text, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.InternalNote.findOne({ where: { InternalId, DepartmentId } })
      if (candidate) {
        const message = {
          type: 'addInternalNote',
          text: 'Такое примечание уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.InternalNote.create({
          text,
          InternalId,
          DepartmentId
        })
        const message = {
          type: 'addInternalNote',
          text: 'Примечание успешно добавлено',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ internalNote: { text, InternalId, DepartmentId } })
        }
        pubsub.publish('INTERNAL_NOTE_CHANGED', {
          internalNoteChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addInternalNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editInternalNote (root, { id, internalNote: { text, InternalId, DepartmentId } }) {
    try {
      const candidate = await Docs.InternalNote.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editInternalNote',
          text: 'Примечания с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (text === '') {
          const message = {
            type: 'editInternalNote',
            text: 'Текст примечания не должен быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.text = text
          candidate.InternalId = InternalId
          candidate.DepartmentId = DepartmentId
        }
        await candidate.save()
        const message = {
          type: 'editInternalNote',
          text: 'Примечание успешно изменено',
          messageType: 'success',
          id,
          item: JSON.stringify({ internalNote: { text, InternalId, DepartmentId } })
        }
        pubsub.publish('INTERNAL_NOTE_CHANGED', {
          internalNoteChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editInternalNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteInternalNote (root, { id }) {
    try {
      const candidate = await Docs.InternalNote.findByPk(id)
      const message = {
        type: 'deleteInternalNote',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await candidate.destroy()
        message.text = `Примечание c id = ${id} успешно удалено`
        pubsub.publish('INTERNAL_NOTE_CHANGED', {
          internalNoteChanged: {
            type: 'delete',
            id
          }
        })
      } else {
        message.text += `Примечание c id = ${id} в базе отсутствует`
        message.messageType = 'error'
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteInternalNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getInternalNote (root, { id }) {
    try {
      return await Docs.InternalNote.findByPk(id)
    } catch (err) {
      throw err
    }
  }
}
