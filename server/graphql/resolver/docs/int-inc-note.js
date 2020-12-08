/* eslint-disable no-useless-escape */
// const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIntIncNote (root, { intIncNote: { text, IntIncomingId, DepartmentId } }) {
    try {
      // const iText = _.trim(_.replace(text, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.IntIncNote.findOne({ where: { IntIncomingId, DepartmentId } })
      if (candidate) {
        const message = {
          type: 'addIntIncNote',
          text: 'Такое примечание уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.IntIncNote.create({
          text,
          IntIncomingId,
          DepartmentId
        })
        const message = {
          type: 'addIntIncNote',
          text: 'Примечание успешно добавлено',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ intIncNote: { text, IntIncomingId, DepartmentId } })
        }
        pubsub.publish('INT_INC_NOTE_CHANGED', {
          intIncNoteChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addIntIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntIncNote (root, { id, intIncNote: { text, IntIncomingId, DepartmentId } }) {
    try {
      const candidate = await Docs.IntIncNote.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editIntIncNote',
          text: 'Примечания с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (text === '') {
          const message = {
            type: 'editIntIncNote',
            text: 'Текст примечания не должен быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.text = text
          candidate.IntIncomingId = IntIncomingId
          candidate.DepartmentId = DepartmentId
        }
        await candidate.save()
        const message = {
          type: 'editIntIncNote',
          text: 'Примечание успешно изменено',
          messageType: 'success',
          id,
          item: JSON.stringify({ intIncNote: { text, IntIncomingId, DepartmentId } })
        }
        pubsub.publish('INT_INC_NOTE_CHANGED', {
          intIncNoteChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editIntIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntIncNote (root, { id }) {
    try {
      const candidate = await Docs.IntIncNote.findByPk(id)
      const message = {
        type: 'deleteIntIncNote',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await candidate.destroy()
        message.text = `Примечание c id = ${id} успешно удалено`
        pubsub.publish('INT_INC_NOTE_CHANGED', {
          intIncNoteChanged: {
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
        type: 'deleteIntIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getIntIncNote (root, { id }) {
    try {
      return await Docs.IntIncNote.findByPk(id)
    } catch (err) {
      throw err
    }
  }
}
