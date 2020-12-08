/* eslint-disable no-useless-escape */
// const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addExtIncNote (root, { extIncNote: { text, ExtIncomingId, DepartmentId } }) {
    try {
      // const iText = _.trim(_.replace(text, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtIncNote.findOne({ where: { ExtIncomingId, DepartmentId } })
      if (candidate) {
        const message = {
          type: 'addExtIncNote',
          text: 'Такое примечание уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const candidate = await Docs.ExtIncNote.create({
          text,
          ExtIncomingId,
          DepartmentId
        })
        const message = {
          type: 'addExtIncNote',
          text: 'Примечание успешно добавлено',
          messageType: 'success',
          id: candidate.id,
          item: JSON.stringify({ extIncNote: { text, ExtIncomingId, DepartmentId } })
        }
        pubsub.publish('EXT_INC_NOTE_CHANGED', {
          extIncNoteChanged: {
            type: 'add',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addExtIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtIncNote (root, { id, extIncNote: { text, ExtIncomingId, DepartmentId } }) {
    try {
      const candidate = await Docs.ExtIncNote.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtIncNote',
          text: 'Примечания с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (text === '') {
          const message = {
            type: 'editExtIncNote',
            text: 'Текст примечания не должен быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.text = text
          candidate.ExtIncomingId = ExtIncomingId
          candidate.DepartmentId = DepartmentId
        }
        await candidate.save()
        const message = {
          type: 'editExtIncNote',
          text: 'Примечание успешно изменено',
          messageType: 'success',
          id,
          item: JSON.stringify({ extIncNote: { text, ExtIncomingId, DepartmentId } })
        }
        pubsub.publish('EXT_INC_NOTE_CHANGED', {
          extIncNoteChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editExtIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtIncNote (root, { id }) {
    try {
      const candidate = await Docs.ExtIncNote.findByPk(id)
      const message = {
        type: 'deleteExtIncNote',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await candidate.destroy()
        message.text = `Примечание c id = ${id} успешно удалено`
        pubsub.publish('EXT_INC_NOTE_CHANGED', {
          extIncNoteChanged: {
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
        type: 'deleteExtIncNote',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getExtIncNote (root, { id }) {
    try {
      return await Docs.ExtIncNote.findByPk(id)
    } catch (err) {
      throw err
    }
  }
}
