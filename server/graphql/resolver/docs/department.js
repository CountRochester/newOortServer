/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()
// const subscriptionKeys = require('../subscription-keys')

module.exports = {
  async addDepartment (root, { department: { depName, depNumber, shortName, depPrefix, parentDepartmentId } }) {
    try {
      const iDepName = _.trim(_.replace(depName, /[&{}<>#$%^*!@+`~\/\\\[\]]+/g, ''))
      const iShortName = _.trim(_.replace(shortName, /[&{}<>#$%^*!@+`~\/\\\[\]]+/g, ''))
      const iDepPrefix = _.trim(_.replace(depPrefix, /[&{}<>#$%^*!@+`~\[\]]+/g, ''))
      const candidate = await Docs.Department.findOne({ where: { depName: iDepName } })
      if (candidate) {
        const message = {
          type: 'addDepartment',
          text: 'Такой отдел уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const department = await Docs.Department.create({
          depName: iDepName,
          depNumber,
          shortName: iShortName,
          depPrefix: iDepPrefix
        })
        if (parentDepartmentId) {
          if (parentDepartmentId !== 'undefined' && parentDepartmentId.length && parentDepartmentId !== 'null' && parentDepartmentId !== '') {
            await department.setParentDepartment(parentDepartmentId)
          } else {
            department.setParentDepartment(null)
          }
        }
        const message = {
          type: 'addDepartment',
          text: 'Новый отдел успешно добавлен',
          messageType: 'success',
          id: department.id,
          item: JSON.stringify({ department: { depName, depNumber, shortName, depPrefix, parentDepartmentId } })
        }
        pubsub.publish('DEPARTMENT_CHANGED', {
          departmentChanged: {
            type: 'add',
            id: department.id,
            item: department
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addDepartment',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editDepartment (root, { id, department: { depName, depNumber, shortName, depPrefix, parentDepartmentId } }) {
    try {
      const iDepName = _.trim(_.replace(depName, /[&{}<>#$%^*!@+`~\/\\\[\]]+/g, ''))
      const iShortName = _.trim(_.replace(shortName, /[&{}<>#$%^*!@+`~\/\\\[\]]+/g, ''))
      const iDepPrefix = _.trim(_.replace(depPrefix, /[&{}<>#$%^*!@+`~\[\]]+/g, ''))
      const candidate = await Docs.Department.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editDepartment',
          text: 'Отдела с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iDepName === '') {
          const message = {
            type: 'editDepartment',
            text: 'Название отдела не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.depName = iDepName
          candidate.depNumber = depNumber
          candidate.shortName = iShortName
          candidate.depPrefix = iDepPrefix
        }
        await candidate.save()
        if (parentDepartmentId) {
          if (parentDepartmentId !== 'undefined' || parentDepartmentId !== 'null') {
            await candidate.setParentDepartment(parentDepartmentId)
          }
        }
        const message = {
          type: 'editDepartment',
          text: 'Данные отдела успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ department: { depName, depNumber, shortName, depPrefix, parentDepartmentId } })
        }
        pubsub.publish('DEPARTMENT_CHANGED', {
          departmentChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editDepartment',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteDepartment (root, { id }) {
    try {
      const candidate = await Docs.Department.findByPk(id)
      await Docs.ExtIncNote.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.IncomingNumber.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.ExtIncState.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.IntIncomingNumber.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.IntIncState.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.InternalIncState.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.InternalIncomingNumber.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await Docs.Subdivision.destroy({
        where: {
          DepartmentId: candidate.id
        }
      })
      await candidate.destroy()
      const message = {
        type: 'deleteDepartment',
        text: `Отдел успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('DEPARTMENT_CHANGED', {
        departmentChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteDepartment',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllDepartment () {
    try {
      return await Docs.Department.findAll()
    } catch (err) {
      throw err
    }
  },

  async getDepartment (root, { id }) {
    try {
      if (id) {
        return await Docs.Department.findByPk(id)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllChildDepartment (root, { id }) {
    try {
      if (id) {
        return await Docs.Department.findAll({ where: { parentDepartmentId: id } })
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getParentDepartment (root, { id }) {
    try {
      if (id) {
        const candidate = await Docs.Department.findByPk(id)
        return await Docs.Department.findOne({ where: { id: candidate.parentDepartmentId } })
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDepartmentEmployees (root, { id, date }) {
    try {
      if (id) {
        const department = await Docs.Department.findByPk(id)
        const currentPositions = await department.getCurrentPositions()
        const employees = []
        const d = date || Date.now()
        if (date === '1900-01-01') {
          for (const item of currentPositions) {
            const employee = await item.getEmployee()
            if (employee) {
              employees.push(employee)
            }
          }
        } else {
          for (const item of currentPositions) {
            if ((item.startDate <= d || !item.startDate) && (item.endDate > d || !item.endDate)) {
              const employee = await item.getEmployee()
              if (employee) {
                employees.push(employee)
              }
            }
          }
        }
        return employees
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDepartmentAndSubdivisionEmployees (root, { id }) {
    try {
      if (id) {
        const department = await Docs.Department.findByPk(id)
        if (department) {
          const subdivisions = await Docs.Department.findAll({ where: { depNumber: department.depNumber } })
          if (subdivisions) {
            const employees = []
            for (const subdivision of subdivisions) {
              const emps = await subdivision.getEmployees()
              for (const employee of emps) {
                employees.push(employee)
              }
            }
            return employees
          } else {
            return this.getAllDepartmentEmployees({ id })
          }
        } else {
          return null
        }
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async editDepartmentChilds (root, { id, parentId, childId }) {
    try {
      const dep = await Docs.Department.findByPk(id)
      const childDeps = await Docs.Department.findAll({ where: { parentDepartmentId: id } })
      const message = {
        text: ``,
        messageType: 'success'
      }
      if (!childDeps.length && !childId.length) {
        message.text = ``
      } else {
        for (const item of childDeps) {
          await item.setParentDepartment(null)
        }
        for (const item of childId) {
          const candidate = await Docs.Department.findByPk(item)
          if (!candidate) {
            message.text += `Отдела с id = ${item} не существует
            `
            message.messageType = 'error'
          } else {
            await candidate.setParentDepartment(id)
          }
        }
      }
      if (parentId === 'null' || parentId === 'undefined') {
        await dep.setParentDepartment(null)
      } else {
        await dep.setParentDepartment(parentId)
      }
      if (message.messageType === 'success') {
        message.text = 'Подчинённость отделов успешно изменена'
      }
      return message
    } catch (err) {
      const message = {
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
