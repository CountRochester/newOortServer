import fs from 'fs/promises'
import path from 'path'

import keys from '../../../keys/index.js'
import { reduceArrayByKey } from '../../common.js'

function getValidatedEmployee (employee = {}) {
  return {
    firstName: employee?.firstName || '',
    middleName: employee?.middleName || '',
    secondName: employee?.secondName || '',
    currentPositionsId: employee?.currentPositionsId || [],
    departmentsId: employee?.departmentsId || [],
    subdivisionsId: employee?.subdivisionsId || [],
  }
}

async function moveAvatarFileFromUpload (avatar, newFileName) {
  const fromPath = path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, avatar)
  const toPath = path.join(keys.STATIC_DIR, keys.AVATAR_STORAGE, newFileName)
  await fs.rename(fromPath, toPath)
}

export default (context, Auth) => {
  const { Op } = context
  const Docs = () => context.documentFlow.model

  const common = {}
  common.getUsers = async (id) => {
    const functionFind = id ? 'findOne' : 'findAll'
    const where = id ? { where: { id } } : {}
    const users = await Auth.User[functionFind]({
      attributes: [
        'id',
        'name',
        'employeeId',
        'avatar',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: Auth.Group,
          attributes: [
            'id'
          ],
          through: {
            attributes: []
          }
        }
      ],
      ...where
    })
    return users
  }

  common.formUser = (item, employees) => {
    const groupsId = reduceArrayByKey(item.Groups, 'id', true)
    const employee = getValidatedEmployee(employees[item.employeeId])
    return {
      id: item.id,
      name: item.name,
      employeeId: item.employeeId,
      firstName: employee.firstName,
      middleName: employee.middleName,
      secondName: employee.secondName,
      currentPositionsId: employee.currentPositionsId,
      departmentsId: employee.departmentsId,
      subdivisionsId: employee.subdivisionsId,
      groupsId,
      avatar: item.avatar,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }

  common.formEmployees = async (ids) => {
    const employees = await common.getEmployees(ids)
    const employeesIndexed = []
    employees.forEach((el) => {
      let subdivisionsId = []
      const departmentsId = []
      const currentPositionsId = []

      const formDepsAndCurPos = (element) => {
        currentPositionsId.push(element.id)
        const currentSubdivId = reduceArrayByKey(element.Subdivisions, 'id', true)
        subdivisionsId = [...subdivisionsId, ...currentSubdivId]
        departmentsId.push(element.Department.id)
      }
      el.CurrentPositions.forEach(formDepsAndCurPos)

      employeesIndexed[el.id] = {
        id: el.id,
        firstName: el.firstName,
        middleName: el.middleName,
        secondName: el.secondName,
        currentPositionsId,
        subdivisionsId,
        departmentsId
      }
    })
    return employeesIndexed
  }

  common.getEmployees = async (ids) => {
    if (!ids) { return false }
    // console.time('getEmployees')
    const employees = await Docs().Employee.findAll({
      where: {
        id: { [Op.in]: ids }
      },
      attributes: [
        'id',
        'firstName',
        'middleName',
        'secondName'
      ],
      include: [
        {
          model: Docs().CurrentPosition,
          attributes: ['id'],
          include: [
            {
              model: Docs().Subdivision,
              attributes: ['id']
            },
            {
              model: Docs().Department,
              attributes: ['id']
            }
          ]
        }
      ]
    })
    // console.timeEnd('getEmployees')
    if (!employees) { return false }
    return employees
  }

  common.addAvatar = async (avatar, userName) => {
    const message = { messageType: 'success' }
    const fileExtention = path.extname(avatar)
    const newFileName = `avatar-${userName}.${fileExtention}`

    try {
      await moveAvatarFileFromUpload(avatar, newFileName)
      message.text += `Прикрепление файла ${avatar} успешно \n\r`
      message.avatar = newFileName
    } catch (err) {
      message.text += `Ошибка при прикреплении файла ${avatar}: ${err}`
      message.messageType = 'error'
    }

    return message
  }

  common.deleteAvatarUpoad = async (fileName) => {
    const message = {}
    try {
      await fs.unlink(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, fileName))
    } catch (err) {
      message.text += `Файл ${fileName}, ошибка: ${err}\n\r`
      message.messageType = 'error'
    }
    return message
  }

  common.deleteAvatar = async (avatar) => {
    const message = {}
    try {
      await fs.unlink(path.join(keys.STATIC_DIR, keys.AVATAR_STORAGE, avatar))
      message.text = `Файл ${avatar} успешно удалён`
    } catch (err) {
      const uplMess = await common.deleteAvatarUpoad(avatar)
      if (uplMess.messageType === 'error') {
        message.text = uplMess.text
        message.messageType = uplMess.messageType
      }
    }
    return message
  }

  common.getUserById = async (id) => {
    const rawUser = await common.getUsers(id)
    const employees = await common.formEmployees([rawUser.employeeId])
    const user = common.formUser(rawUser, employees)
    return user
  }

  return common
}
