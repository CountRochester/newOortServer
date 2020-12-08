/* eslint-disable no-useless-escape */
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addInternalIncState (root, { internalIncState: { InternalId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.InternalIncState.findOne({ where: { InternalId, DepartmentId, StateId } })
      if (candidate) {
        const message = {
          type: 'addInternalIncState',
          text: 'Такое состояние для указанного документа в данном отделе уже существует',
          messageType: 'error'
        }
        return message
      } else if (!InternalId || !DepartmentId || !StateId) {
        const message = {
          type: 'addInternalIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const internal = await Docs.Internal.findByPk(InternalId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!internal) {
          const message = {
            type: 'addInternalIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addInternalIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addInternalIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const newItem = await Docs.InternalIncState.create({
            InternalId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addInternalIncState',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: newItem.id,
            item: JSON.stringify({ internalIncState: { InternalId, DepartmentId, StateId } })
          }
          pubsub.publish('INTERNAL_INC_STATE_CHANGED', {
            internalIncStateChanged: {
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
        type: 'addInternalIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editInternalIncState (root, { id, InternalIncState: { InternalId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.InternalIncState.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editInternalIncState',
          text: 'Состояния с таким id не существует',
          messageType: 'error'
        }
        return message
      } else if (!InternalId || !DepartmentId || !StateId) {
        const message = {
          type: 'editInternalIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const internal = await Docs.Internal.findByPk(InternalId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!internal) {
          const message = {
            type: 'editInternalIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'editInternalIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'editInternalIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          candidate.InternalId = InternalId
          candidate.DepartmentId = DepartmentId
          candidate.StateId = StateId
          await candidate.save()
          const message = {
            type: 'editInternalIncState',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id,
            item: JSON.stringify({ internalIncState: { InternalId, DepartmentId, StateId } })
          }
          pubsub.publish('INTERNAL_INC_STATE_CHANGED', {
            internalIncStateChanged: {
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
        type: 'editInternalIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteInternalIncState (root, { id }) {
    try {
      const candidate = await Docs.InternalIncState.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteInternalIncState',
        text: `Состояние успешно удалено`,
        messageType: 'success',
        id
      }
      pubsub.publish('INTERNAL_INC_STATE_CHANGED', {
        internalIncStateChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteInternalIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllInternalIncState () {
    try {
      return await Docs.InternalIncState.findAll()
    } catch (err) {
      throw err
    }
  },

  async getInternalIncState (root, { id }) {
    try {
      return await Docs.InternalIncState.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getInternalIncStates (root, { ids }) {
    try {
      return await Docs.InternalIncState.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async getInternalIncStateInDepartments (root, { id, depsId }) {
    try {
      const internalIncStates = []
      for (const dep of depsId) {
        internalIncStates.push(await Docs.InternalIncState.findOne({ where: { InternalId: id, DepartmentId: dep } }))
      }
      return internalIncStates
    } catch (err) {
      throw err
    }
  },

  async addInternalIncStateToDocument (root, { InternalId, DepartmentId, StateId }) {
    try {
      const candidate = await Docs.InternalIncState.findOne({ where: { InternalId, DepartmentId } })
      if (candidate) {
        await candidate.destroy()
      }
      if (!InternalId || !DepartmentId || !StateId) {
        const message = {
          type: 'addInternalIncStateToDocument',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const internal = await Docs.Internal.findByPk(InternalId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!internal) {
          const message = {
            type: 'addInternalIncStateToDocument',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addInternalIncStateToDocument',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addInternalIncStateToDocument',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const newItem = await Docs.InternalIncState.create({
            InternalId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addInternalIncStateToDocument',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: newItem.id,
            item: JSON.stringify({ internalIncState: { InternalId, DepartmentId, StateId } })
          }
          pubsub.publish('INTERNAL_INC_STATE_CHANGED', {
            internalIncStateChanged: {
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
        type: 'addInternalIncStateToDocument',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
