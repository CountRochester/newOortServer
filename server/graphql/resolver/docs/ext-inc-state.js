/* eslint-disable no-useless-escape */
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addExtIncState (root, { extIncState: { ExtIncomingId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.ExtIncState.findOne({ where: { ExtIncomingId, DepartmentId, StateId } })
      if (candidate) {
        const message = {
          type: 'addExtIncState',
          text: 'Такое состояние для указанного документа в данном отделе уже существует',
          messageType: 'error'
        }
        return message
      } else if (!ExtIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'addExtIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const extIncoming = await Docs.ExtIncoming.findByPk(ExtIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!extIncoming) {
          const message = {
            type: 'addExtIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addExtIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addExtIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const candidate = await Docs.ExtIncState.create({
            ExtIncomingId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addExtIncState',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: candidate.id,
            item: JSON.stringify({ extIncState: { ExtIncomingId, DepartmentId, StateId } })
          }
          pubsub.publish('EXT_INC_STATE_CHANGED', {
            extIncStateChanged: {
              type: 'add',
              id: candidate.id,
              item: candidate
            }
          })
          return message
        }
      }
    } catch (err) {
      const message = {
        type: 'addExtIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtIncState (root, { id, extIncState: { ExtIncomingId, DepartmentId, StateId } }) {
    try {
      const candidate = await Docs.ExtIncState.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtIncState',
          text: 'Состояния с таким id не существует',
          messageType: 'error'
        }
        return message
      } else if (!ExtIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'editExtIncState',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const extIncoming = await Docs.ExtIncoming.findByPk(ExtIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!extIncoming) {
          const message = {
            type: 'editExtIncState',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'editExtIncState',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'editExtIncState',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          candidate.ExtIncomingId = ExtIncomingId
          candidate.DepartmentId = DepartmentId
          candidate.StateId = StateId
          await candidate.save()
          const message = {
            type: 'editExtIncState',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id,
            item: JSON.stringify({ extIncState: { ExtIncomingId, DepartmentId, StateId } })
          }
          pubsub.publish('EXT_INC_STATE_CHANGED', {
            extIncStateChanged: {
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
        type: 'editExtIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtIncState (root, { id }) {
    try {
      const candidate = await Docs.ExtIncState.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteExtIncState',
        text: `Состояние успешно удалено`,
        messageType: 'success',
        id
      }
      pubsub.publish('EXT_INC_STATE_CHANGED', {
        extIncStateChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtIncState',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtIncState () {
    try {
      return await Docs.ExtIncState.findAll()
    } catch (err) {
      throw err
    }
  },

  async getExtIncState (root, { id }) {
    try {
      return await Docs.ExtIncState.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getExtIncStates (root, { ids }) {
    try {
      return await Docs.ExtIncState.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncStateByExtIncoming (root, { id }) {
    try {
      return await Docs.ExtIncState.findAll({ where: { ExtIncomingId: id } })
    } catch (err) {
      throw err
    }
  },

  async getExtIncStateInDepartments (root, { id, depsId }) {
    try {
      // const extIncoming = await Docs.ExtIncoming.findByPk(id)
      const extIncStates = []
      for (const dep of depsId) {
        extIncStates.push(await Docs.ExtIncState.findOne({ where: { ExtIncomingId: id, DepartmentId: dep } }))
      }
      return extIncStates
    } catch (err) {
      throw err
    }
  },

  async addExtIncStateToDocument (root, { ExtIncomingId, DepartmentId, StateId }) {
    try {
      const candidate = await Docs.ExtIncState.findOne({ where: { ExtIncomingId, DepartmentId } })
      if (candidate) {
        await candidate.destroy()
      }
      if (!ExtIncomingId || !DepartmentId || !StateId) {
        const message = {
          type: 'addExtIncStateToDocument',
          text: 'Необходимо обязательно указать документ, отдел и состояние',
          messageType: 'error'
        }
        return message
      } else {
        const extIncoming = await Docs.ExtIncoming.findByPk(ExtIncomingId)
        const department = await Docs.Department.findByPk(DepartmentId)
        const state = await Docs.State.findByPk(StateId)
        if (!extIncoming) {
          const message = {
            type: 'addExtIncStateToDocument',
            text: 'Такой внешний входящий документ не существует',
            messageType: 'error'
          }
          return message
        } else if (!department) {
          const message = {
            type: 'addExtIncStateToDocument',
            text: 'Такой отдел не существует',
            messageType: 'error'
          }
          return message
        } else if (!state) {
          const message = {
            type: 'addExtIncStateToDocument',
            text: 'Такое состояние не существует',
            messageType: 'error'
          }
          return message
        } else {
          const extIncState = await Docs.ExtIncState.create({
            ExtIncomingId,
            DepartmentId,
            StateId
          })
          const message = {
            type: 'addExtIncStateToDocument',
            text: 'Состояние успешно добавлено',
            messageType: 'success',
            id: extIncState.id,
            item: JSON.stringify({ extIncState: { ExtIncomingId, DepartmentId, StateId } })

          }
          pubsub.publish('EXT_INC_STATE_CHANGED', {
            extIncStateChanged: {
              type: 'attach',
              id: extIncState.id,
              item: extIncState
            }
          })
          return message
        }
      }
    } catch (err) {
      const message = {
        type: 'addExtIncStateToDocument',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
