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
    async getAllUsers () {
      try {
        const users = await getUsers()
        const employeeIds = reduceArrayByKey(users, 'employeeId')
        const employees = await formEmployees(employeeIds)
        const output = users.map(el => formUser(el, employees))
        return output
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async getUser (root, { id }) {
      try {
        const user = await getUsers(id)
        const employees = await formEmployees([user.employeeId])
        return formUser(user, employees)
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async getAllGroups () {
      try {
        return await Auth.Group.findAll()
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async getGroup (root, { id }) {
      try {
        return await Auth.Group.findByPk(id)
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async getUserGroups (root, { id }) {
      try {
        const user = await Auth.User.findByPk(id)
        return await user.getGroups()
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async getUsersOfGroup (root, { id }) {
      try {
        const group = await Auth.Group.findByPk(id)
        return await group.getUsers()
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async userCheckPermission (root, { id, permission }) {
      try {
        const user = await Auth.User.findByPk(id)
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
        console.error(err)
        throw err
      }
    }
  }
}
