/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addSubdivision (root, { subdivision: { name, fullName, DepartmentId } }) {
    try {
      const iName = _.trim(_.replace(name, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
      const iFullName = _.trim(_.replace(fullName, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
      const candidate = await Docs.Subdivision.findOne({ where: { name: iName } })
      if (candidate) {
        const message = {
          type: 'addSubdivision',
          text: 'Такое подразделение уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const subdivision = await Docs.Subdivision.create({
          name: iName,
          fullName: iFullName,
          DepartmentId
        })
        const message = {
          type: 'addSubdivision',
          text: 'Подразделение успешно добавлено',
          messageType: 'success',
          id: subdivision.id,
          item: JSON.stringify({ subdivision: { name, fullName, DepartmentId } })
        }
        pubsub.publish('SUBDIVISION_CHANGED', {
          subdivisionChanged: {
            type: 'add',
            id: subdivision.id,
            item: subdivision
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addSubdivision',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editSubdivision (root, { id, subdivision: { name, fullName, DepartmentId } }) {
    try {
      const iName = _.trim(_.replace(name, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
      const iFullName = _.trim(_.replace(fullName, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
      const candidate = await Docs.Subdivision.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editSubdivision',
          text: 'Подразделение с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iName === '') {
          const message = {
            type: 'editSubdivision',
            text: 'Название подразделения не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else if (DepartmentId === '') {
          candidate.name = iName
          candidate.fullName = iFullName
        } else {
          candidate.name = iName
          candidate.fullName = iFullName
          candidate.DepartmentId = DepartmentId
        }
        await candidate.save()
        const message = {
          type: 'editSubdivision',
          text: 'Подразделение успешно изменено',
          messageType: 'success',
          id,
          item: JSON.stringify({ subdivision: { name, fullName, DepartmentId } })
        }
        pubsub.publish('SUBDIVISION_CHANGED', {
          subdivisionChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editSubdivision',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteSubdivision (root, { id }) {
    try {
      const candidate = await Docs.Subdivision.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteSubdivision',
        text: `Подразделение успешно удалено`,
        messageType: 'success',
        id
      }
      pubsub.publish('SUBDIVISION_CHANGED', {
        subdivisionChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteSubdivision',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllSubdivision () {
    try {
      return await Docs.Subdivision.findAll()
    } catch (err) {
      throw err
    }
  },
  async getSubdivision (root, { id }) {
    try {
      return await Docs.Subdivision.findByPk(id)
    } catch (err) {
      throw err
    }
  }
}
