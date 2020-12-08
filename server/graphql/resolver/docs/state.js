/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addState (root, { state: { name, type, parentStateId } }) {
    try {
      const stateName = _.trim(_.replace(name, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iType = _.trim(_.replace(type, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.State.findOne({ where: { name: stateName, type: iType } })
      if (parentStateId) {
        const candidate2 = await Docs.State.findOne({ where: { parentStateId } })
        if (candidate2) {
          const message = {
            type: 'addState',
            text: 'Предшествующее состояние уже назначено',
            messageType: 'error'
          }
          return message
        }
      }
      if (candidate) {
        const message = {
          type: 'addState',
          text: 'Такое состояние уже существует',
          messageType: 'error'
        }
        return message
      } else {
        let newItem
        if (parentStateId) {
          newItem = await Docs.State.create({
            name: stateName,
            type: iType,
            parentStateId
          })
        } else {
          newItem = await Docs.State.create({
            name: stateName,
            type: iType
          })
        }
        const message = {
          type: 'addState',
          text: 'Состояние успешно добавлено',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ state: { name, type, parentStateId } })
        }
        pubsub.publish('STATE_CHANGED', {
          stateChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editState (root, { id, state: { name, type, parentStateId } }) {
    try {
      const stateName = _.trim(_.replace(name, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iType = _.trim(_.replace(type, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.State.findByPk(id)
      if (parentStateId) {
        const candidate2 = await Docs.State.findOne({ where: { parentStateId } })
        if (candidate2) {
          const message = {
            type: 'editState',
            text: 'Предшествующее состояние уже назначено',
            messageType: 'error'
          }
          return message
        }
      }
      if (!candidate) {
        const message = {
          type: 'editState',
          text: 'Состояние с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (stateName === '') {
          const message = {
            type: 'editState',
            text: 'Название состояния не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.name = stateName
          candidate.type = iType
        }
        await candidate.save()
        if (parentStateId) {
          if (parentStateId === '0') {
            await candidate.setParentState(null)
          } else {
            await candidate.setParentState(parentStateId)
          }
        }
        const message = {
          type: 'editState',
          text: 'Данные состояния успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ state: { name, type, parentStateId } })
        }
        pubsub.publish('STATE_CHANGED', {
          stateChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteState (root, { id }) {
    try {
      const candidate = await Docs.State.findByPk(id)
      const extIncStates = await candidate.getExtIncStates()
      const intIncStates = await candidate.getIntIncStates()
      const internalIncStates = await candidate.getInternalIncStates()
      for (let i = 0; i < extIncStates.length; i++) {
        await extIncStates[i].destroy()
      }
      for (let i = 0; i < intIncStates.length; i++) {
        await intIncStates[i].destroy()
      }
      for (let i = 0; i < internalIncStates.length; i++) {
        await internalIncStates[i].destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteState',
        text: `Состояние успешно удалено`,
        messageType: 'success',
        id
      }
      pubsub.publish('STATE_CHANGED', {
        stateChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllState () {
    try {
      return await Docs.State.findAll()
    } catch (err) {
      throw err
    }
  },

  async getState (root, { id }) {
    try {
      if (id) {
        return await Docs.State.findByPk(id)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingsByState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getExtIncomings()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingsByState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getExtOutgoings()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingsByState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getIntIncomings()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingsByState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getIntOutgoings()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getInternalsByState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getInternals()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getParentState (root, { id }) {
    try {
      if (id) {
        const state = await Docs.State.findByPk(id)
        return await state.getParentState()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getNextState (root, { id }) {
    try {
      if (id) {
        return await Docs.State.findOne({ where: { parentStateId: id } })
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  }
}
