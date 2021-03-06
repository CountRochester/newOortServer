import common from './common.js'
import { reduceArrayByKey } from '../../common.js'

function calculatePermission (userPermissionStr, permissionStr) {
  let result = true
  for (let i = 0; i < 32; i++) {
    const item1 = permissionStr[permissionStr.length - i]
      ? permissionStr[permissionStr.length - i]
      : '0'
    const item2 = userPermissionStr[userPermissionStr.length - i]
      ? userPermissionStr[userPermissionStr.length - i]
      : '0'
    if (item1 > item2) {
      result = false
    }
  }

  return result
}

export default (context, Auth) => {
  const { formEmployees, getUsers, formUser } = common(context, Auth)
  return {
    async getAllUsers (root, args, { consola, core: { logger } }) {
      try {
        const users = await getUsers()
        const employeeIds = reduceArrayByKey(users, 'employeeId')
        const employees = await formEmployees(employeeIds)
        const output = users.map(el => formUser(el, employees))
        return output
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async getUser (root, { id }, { consola, core: { logger } }) {
      try {
        const user = await getUsers(id)
        const employees = await formEmployees([user.employeeId])
        return formUser(user, employees)
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async getAllGroups (root, args, {
      authentication: { model: { Group } },
      core: { logger },
      consola
    }) {
      try {
        return await Group.findAll()
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async getGroup (root, { id }, {
      authentication: { model: { Group } },
      core: { logger },
      consola
    }) {
      try {
        return await Group.findByPk(id)
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async getUserGroups (root, { id }, {
      authentication: { model: { User } },
      core: { logger },
      consola
    }) {
      try {
        const user = await User.findByPk(id)
        return await user.getGroups()
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async getUsersOfGroup (root, { id }, {
      authentication: { model: { Group } },
      core: { logger },
      consola
    }) {
      try {
        const group = await Group.findByPk(id)
        return await group.getUsers()
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    },

    async userCheckPermission (root, { id, permission }, {
      authentication: { model: { User } },
      core: { logger },
      consola
    }) {
      try {
        const user = await User.findByPk(id)
        if (!user) {
          return undefined
        }
        let userPermission = 0
        const groups = await this.getUserGroups({ id })
        groups.forEach((group) => {
          userPermission |= group.permissions
        })
        const userPermissionStr = userPermission.toString(2)
        const permissionStr = permission.toString(2)
        return calculatePermission(userPermissionStr, permissionStr)
      } catch (err) {
        logger.writeLog(err)
        consola.error(err)
        throw err
      }
    }
  }
}
