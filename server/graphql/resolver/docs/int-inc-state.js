/* eslint-disable no-useless-escape */
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIntIncState (root, { intIncState: { IntIncomingId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.IntIncState.findOne({ where: { IntIncomingId, DepartmentId, StateId } })
      if (candidate) {
        const message = {
          type: 'addIntIncState',
          text: 'Такое состояние для указанного документа в данном отделе уже существует',
          messageType: 'error'
        }
        return message
      } else if (!IntIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'addIntIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const intIncoming = await Docs.IntIncoming.findByPk(IntIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!intIncoming) {
          const message = {
            type: 'addIntIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addIntIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addIntIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const newItem = await Docs.IntIncState.create({
            IntIncomingId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addIntIncState',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: newItem.id,
            item: JSON.stringify({ intIncState: { IntIncomingId, DepartmentId, StateId } })
          }
          pubsub.publish('INT_INC_STATE_CHANGED', {
            intIncStateChanged: {
              type: 'add',
              id: newItem.id,
              item: newItem
            }
          })
          return message
        }
      }
    } catch (err) {
      const message = {
        type: 'addIntIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntIncState (root, { id, IntIncState: { IntIncomingId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.IntIncState.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editIntIncState',
          text: 'Состояния с таким id не существует',
          messageType: 'error'
        }
        return message
      } else if (!IntIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'editIntIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const intIncoming = await Docs.IntIncoming.findByPk(IntIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!intIncoming) {
          const message = {
            type: 'editIntIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'editIntIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'editIntIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          candidate.IntIncomingId = IntIncomingId
          candidate.DepartmentId = DepartmentId
          candidate.StateId = StateId
          await candidate.save()
          const message = {
            type: 'editIntIncState',
            text: 'Состояние успешно изменено',
            messageType: 'success',
            id,
            item: JSON.stringify({ intIncState: { IntIncomingId, DepartmentId, StateId } })
          }
          pubsub.publish('INT_INC_STATE_CHANGED', {
            intIncStateChanged: {
              type: 'edit',
              id: candidate.id,
              item: candidate
            }
          })
          return message
        }
      }
    } catch (err) {
      const message = {
        type: 'editIntIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntIncState (root, { id }) {
    try {
      const candidate = await Docs.IntIncState.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteIntIncState',
        text: `Состояние успешно удалено`,
        messageType: 'success',
        id
      }
      pubsub.publish('INT_INC_STATE_CHANGED', {
        intIncStateChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIntIncState () {
    try {
      return await Docs.IntIncState.findAll()
    } catch (err) {
      throw err
    }
  },

  async getIntIncState (root, { id }) {
    try {
      return await Docs.IntIncState.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntIncStates (root, { ids }) {
    try {
      return await Docs.IntIncState.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async getIntIncStateInDepartments (root, { id, depsId }) {
    try {
      const intIncStates = []
      for (const dep of depsId) {
        intIncStates.push(await Docs.IntIncState.findOne({ where: { IntIncomingId: id, DepartmentId: dep } }))
      }
      return intIncStates
    } catch (err) {
      throw err
    }
  },

  async addIntIncStateToDocument (root, { IntIncomingId, DepartmentId, StateId }) {
    try {
      const candidate = await Docs.IntIncState.findOne({ where: { IntIncomingId, DepartmentId } })
      if (candidate) {
        await candidate.destroy()
      }
      if (!IntIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'addIntIncStateToDocument',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const intIncoming = await Docs.IntIncoming.findByPk(IntIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!intIncoming) {
          const message = {
            type: 'addIntIncStateToDocument',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addIntIncStateToDocument',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addIntIncStateToDocument',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const newItem = await Docs.IntIncState.create({
            IntIncomingId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addIntIncStateToDocument',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: newItem.id,
            item: JSON.stringify({ intIncState: { IntIncomingId, DepartmentId, StateId } })
          }
          pubsub.publish('INT_INC_STATE_CHANGED', {
            intIncStateChanged: {
              type: 'attach',
              id: newItem.id,
              item: newItem
            }
          })
          return message
        }
      }
    } catch (err) {
      const message = {
        type: 'addIntIncStateToDocument',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
