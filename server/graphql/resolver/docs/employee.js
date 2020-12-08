/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

moment.locale('ru')

async function getEmployeeData (idArr) {
  let employees
  if (idArr) {
    employees = await Docs.Employee.findAll({
      where: {
        id: { [Op.in]: idArr }
      },
      include: [
        {
          model: Docs.CurrentPosition,
          attributes: ['id'],
          include: [
            {
              model: Docs.Subdivision,
              attributes: ['id']
            }
          ]
        }
      ]
    }) || []
  } else {
    employees = await Docs.Employee.findAll({
      include: [
        {
          model: Docs.CurrentPosition,
          attributes: ['id'],
          include: [
            {
              model: Docs.Subdivision,
              attributes: ['id']
            }
          ]
        }
      ]
    }) || []
  }
  return employees
}

function formEmployee (item) {
  const positionsId = []
  const subdivisionsId = []
  if (item.CurrentPositions.length) {
    item.CurrentPositions.forEach((el) => {
      positionsId.push(el.id)
      if (el.Subdivisions.length) {
        el.Subdivisions.forEach((sub) => {
          subdivisionsId.push(sub.id)
        })
      }
    })
  }
  return {
    id: item.id,
    firstName: item.firstName,
    secondName: item.secondName || '',
    secondNameDat: item.secondNameDat || '',
    middleName: item.middleName || '',
    tabelNumber: item.tabelNumber,
    phone1: item.phone1,
    phone2: item.phone2,
    phone3: item.phone3,
    email1: item.email1,
    email2: item.email2,
    Positions: positionsId,
    Subdivisions: subdivisionsId,
    createdAt: moment(item.createdAt),
    updatedAt: moment(item.updatedAt)
  }
}

module.exports = {
  async addEmployee (root, { employee: { firstName, secondName, secondNameDat, middleName, tabelNumber, phone1, phone2, phone3, email1, email2, Positions } }) {
    try {
      const iFirstName = _.trim(_.replace(firstName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondName = _.trim(_.replace(secondName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondNameDat = _.trim(_.replace(secondNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iMiddleName = _.trim(_.replace(middleName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone1 = _.trim(_.replace(phone1, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone2 = _.trim(_.replace(phone2, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone3 = _.trim(_.replace(phone3, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail1 = _.trim(_.replace(email1, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iEmail2 = _.trim(_.replace(email2, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iTabelNumber = _.trim(_.replace(tabelNumber, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.Employee.findOne({ where: { firstName: iFirstName, secondName: iSecondName, middleName: iMiddleName } })
      if (candidate) {
        const message = {
          type: 'addEmployee',
          text: 'Такой работник уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newEmployee = await Docs.Employee.create({
          firstName: iFirstName,
          secondName: iSecondName,
          secondNameDat: iSecondNameDat,
          middleName: iMiddleName,
          tabelNumber: iTabelNumber,
          phone1: iPhone1,
          phone2: iPhone2,
          phone3: iPhone3,
          email1: iEmail1,
          email2: iEmail2
        })
        Positions = Positions || []
        if (Positions.length) {
          await newEmployee.setCurrentPositions(Positions)
        }
        const message = {
          type: 'addEmployee',
          text: 'Новый работник успешно добавлен',
          messageType: 'success',
          id: newEmployee.id,
          item: JSON.stringify({ employee: { firstName, secondName, secondNameDat, middleName, tabelNumber, phone1, phone2, phone3, email1, email2, Positions } })
        }
        const employeesArr = await getEmployeeData([newEmployee.id])
        const newEmpl = formEmployee(employeesArr[0].dataValues)
        pubsub.publish('EMPLOYEE_CHANGED', {
          employeeChanged: {
            type: 'add',
            id: newEmpl.id,
            item: newEmpl
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editEmployee (root, { id, employee: { firstName, secondName, secondNameDat, middleName, tabelNumber, phone1, phone2, phone3, email1, email2, Positions } }) {
    try {
      const iFirstName = _.trim(_.replace(firstName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondName = _.trim(_.replace(secondName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondNameDat = _.trim(_.replace(secondNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iMiddleName = _.trim(_.replace(middleName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone1 = _.trim(_.replace(phone1, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone2 = _.trim(_.replace(phone2, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone3 = _.trim(_.replace(phone3, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail1 = _.trim(_.replace(email1, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iEmail2 = _.trim(_.replace(email2, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iTabelNumber = _.trim(_.replace(tabelNumber, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.Employee.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editEmployee',
          text: 'Работника с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFirstName === '' || iSecondName === '' || iMiddleName === '') {
          const message = {
            type: 'editEmployee',
            text: 'Фамилия, имя и отчество не должны быть пустыми',
            messageType: 'error'
          }
          return message
        } else {
          candidate.firstName = iFirstName
          candidate.secondName = iSecondName
          candidate.secondNameDat = iSecondNameDat
          candidate.middleName = iMiddleName
          candidate.tabelNumber = iTabelNumber
          candidate.phone1 = iPhone1
          candidate.phone2 = iPhone2
          candidate.phone3 = iPhone3
          candidate.email1 = iEmail1
          candidate.email2 = iEmail2
        }
        await candidate.save()
        if (Positions) {
          if (Positions.length) {
            await candidate.setCurrentPositions(Positions)
          }
        }
        const message = {
          type: 'editEmployee',
          text: 'Данные работника успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ employee: { firstName, secondName, secondNameDat, middleName, tabelNumber, phone1, phone2, phone3, email1, email2, Positions } })
        }
        const employeesArr = await getEmployeeData([candidate.id])
        const newEmpl = formEmployee(employeesArr[0].dataValues)
        pubsub.publish('EMPLOYEE_CHANGED', {
          employeeChanged: {
            type: 'edit',
            id: newEmpl.id,
            item: newEmpl
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteEmployee (root, { id }) {
    try {
      const candidate = await Docs.Employee.findByPk(id)
      const curPos = await candidate.getCurrentPositions() || []
      for (const item of curPos) {
        await item.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteEmployee',
        text: `Работник успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('EMPLOYEE_CHANGED', {
        employeeChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllEmployee () {
    try {
      const employees = await getEmployeeData()
      const output = []
      if (employees.length) {
        console.time('Forming employees array')
        for (let i = 0; i < employees.length; i++) {
          const item = employees[i].dataValues
          output[i] = formEmployee(item)
        }
        console.timeEnd('Forming employees array')
        return output
      } else {
        return []
      }
    } catch (err) {
      throw err
    }
  },

  async getEmployee (root, { id }) {
    try {
      if (id) {
        const employees = await getEmployeeData([id])
        const item = employees[0].dataValues
        return formEmployee(item)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getEmployeeDepartments (root, { id }) {
    try {
      if (id) {
        const candidate = await this.getEmployee(root, { id })
        return await candidate.getDepartment()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getEmployeeAllPosition (root, { id }) {
    try {
      if (id) {
        const candidate = await this.getEmployee({ id })
        return await candidate.getCurrentPositions()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getEmployeeSubdivisions (root, { id }) {
    try {
      if (id) {
        const candidate = await this.getEmployee({ id })
        return await candidate.getSubdivisions()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  }
}
