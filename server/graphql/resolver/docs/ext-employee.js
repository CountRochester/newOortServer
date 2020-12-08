/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

async function getExtEmployeeData (idArr) {
  let extEmployees
  if (idArr) {
    extEmployees = await Docs.ExtEmployee.findAll({
      where: {
        id: { [Op.in]: idArr }
      },
      include: [
        {
          model: Docs.ExtCurrentPosition,
          attributes: ['id']
        }
      ]
    }) || []
  } else {
    extEmployees = await Docs.ExtEmployee.findAll({
      include: [
        {
          model: Docs.ExtCurrentPosition,
          attributes: ['id']
        }
      ]
    }) || []
  }
  return extEmployees
}

function formExtEmployee (item) {
  const output = {}
  const tmp = item.dataValues
  const keys = Object.keys(tmp)
  keys.forEach((key) => {
    output[key] = tmp[key]
  })
  output.extCurrentPositionsId = tmp.ExtCurrentPositions.reduce((acc, curVal, index) => { acc[index] = curVal.id; return acc }, [])
  delete output.ExtCurrentPositions
  return output
}

module.exports = {
  async addExtEmployee (root, { extEmployee: {
    firstName,
    secondName,
    secondNameDat,
    middleName,
    phone1,
    phone2,
    fax,
    email1,
    email2
  } }) {
    try {
      const iFirstName = _.trim(_.replace(firstName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondName = _.trim(_.replace(secondName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondNameDat = _.trim(_.replace(secondNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iMiddleName = _.trim(_.replace(middleName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone1 = _.trim(_.replace(phone1, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone2 = _.trim(_.replace(phone2, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iFax = _.trim(_.replace(fax, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail1 = _.trim(_.replace(email1, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iEmail2 = _.trim(_.replace(email2, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtEmployee.findOne({ where: { firstName: iFirstName, secondName: iSecondName, middleName: iMiddleName } })
      if (candidate) {
        const message = {
          type: 'addExtEmployee',
          text: 'Такой работник уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const extEmp = await Docs.ExtEmployee.create({
          firstName: iFirstName,
          secondName: iSecondName,
          secondNameDat: iSecondNameDat,
          middleName: iMiddleName,
          phone1: iPhone1,
          phone2: iPhone2,
          fax: iFax,
          email1: iEmail1,
          email2: iEmail2
        })
        const data = await getExtEmployeeData([extEmp.id])
        const extEmployee = formExtEmployee(data[0])
        const message = {
          type: 'addExtEmployee',
          text: 'Новый работник успешно добавлен',
          messageType: 'success',
          id: extEmployee.id,
          item: JSON.stringify({
            extEmployee: {
              firstName,
              secondName,
              secondNameDat,
              middleName,
              phone1,
              phone2,
              fax,
              email1,
              email2
            }
          })
        }
        pubsub.publish('EXT_EMPLOYEE_CHANGED', {
          extEmployeeChanged: {
            type: 'add',
            id: extEmployee.id,
            item: extEmployee
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addExtEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtEmployee (root, { id, extEmployee: {
    firstName,
    secondName,
    secondNameDat,
    middleName,
    phone1,
    phone2,
    fax,
    email1,
    email2
  } }) {
    try {
      const iFirstName = _.trim(_.replace(firstName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondName = _.trim(_.replace(secondName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iSecondNameDat = _.trim(_.replace(secondNameDat, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iMiddleName = _.trim(_.replace(middleName, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone1 = _.trim(_.replace(phone1, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iPhone2 = _.trim(_.replace(phone2, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iFax = _.trim(_.replace(fax, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iEmail1 = _.trim(_.replace(email1, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const iEmail2 = _.trim(_.replace(email2, /[\[\]&{}<>#$%^*!+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtEmployee.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtEmployee',
          text: 'Работника с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFirstName === '' || iSecondName === '') {
          const message = {
            type: 'editExtEmployee',
            text: 'Фамилия и имя не должны быть пустыми',
            messageType: 'error'
          }
          return message
        } else {
          candidate.firstName = iFirstName
          candidate.secondName = iSecondName
          candidate.secondNameDat = iSecondNameDat
          candidate.middleName = iMiddleName
          candidate.phone1 = iPhone1
          candidate.phone2 = iPhone2
          candidate.fax = iFax
          candidate.email1 = iEmail1
          candidate.email2 = iEmail2
        }
        await candidate.save()
        const data = await getExtEmployeeData([candidate.id])
        const extEmployee = formExtEmployee(data[0])
        const message = {
          type: 'editExtEmployee',
          text: 'Данные работника успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({
            extEmployee: {
              firstName,
              secondName,
              secondNameDat,
              middleName,
              phone1,
              phone2,
              fax,
              email1,
              email2
            }
          })
        }
        pubsub.publish('EXT_EMPLOYEE_CHANGED', {
          extEmployeeChanged: {
            type: 'edit',
            id: extEmployee.id,
            item: extEmployee
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editExtEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtEmployee (root, { id }) {
    try {
      const candidate = await Docs.ExtEmployee.findByPk(id)
      const positions = await candidate.getExtCurrentPositions()
      for (const item of positions) {
        await item.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteExtEmployee',
        text: `Работник успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('EXT_EMPLOYEE_CHANGED', {
        extEmployeeChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtEmployee',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtEmployee () {
    try {
      // return await Docs.ExtEmployee.findAll()
      const extEmpls = await getExtEmployeeData()
      const output = extEmpls.map(formExtEmployee)
      return output
    } catch (err) {
      throw err
    }
  },

  async getExtEmployee (root, { id }) {
    try {
      // return await Docs.ExtEmployee.findByPk(id)
      const extEmpls = await getExtEmployeeData([id])
      const output = formExtEmployee(extEmpls[0])
      return output
    } catch (err) {
      throw err
    }
  },

  async getExtEmployeeOrganisation (root, { id }) {
    try {
      const candidate = await Docs.ExtEmployee.findByPk(id)
      return await candidate.getOrganisation()
    } catch (err) {
      throw err
    }
  }
}
