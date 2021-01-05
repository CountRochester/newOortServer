/* eslint-disable no-useless-escape */

import bcrypt from 'bcrypt'

import common from './common.js'
import { reduceArrayByKey, checkPermission } from '../../common.js'
import permissions from '../permissions.js'

function getNameAndPassword (name, password) {
  const iName = getValidName(name)
  const iPassword = getValidPassword(password)
  if (!iName || !iPassword) {
    throw new Error('Имя пользователя и пароль не должны быть пустыми')
  }
  return { iName, iPassword }
}

function getValidName (name) {
  return name.trim().replace(/[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '')
}

function getValidPassword (password) {
  return password.trim().replace(/[\'\"\[\ \~]+/g, '')
}

async function getEncryptedPassword (password) {
  const salt = await bcrypt.genSalt(10)
  const encryptedPassword = await bcrypt.hash(password, salt)
  return encryptedPassword
}

async function checkCandidate (name, User) {
  const candidate = await User.findOne({ where: { name } })
  if (candidate) {
    throw new Error('Пользователь с таким именем уже существует')
  }
}

async function getExistedUser (id, User) {
  const candidate = await User.findByPk(id)
  if (!candidate) {
    throw new Error(`Пользователь с id: ${id} не существует`)
  }
  return candidate
}

async function getEntitysByIds (entity, ids, Op) {
  const entitys = await entity.findAll(
    { where: { id: { [Op.in]: ids } } }
  )
  const foundIds = reduceArrayByKey(entitys, 'id')
  const notFoundIds = ids.filter(id => !foundIds.includes(id))
  return { entitys, notFoundIds }
}

async function getUsers (ids, User, Op) {
  const { users, notFoundIds } = await getEntitysByIds(User, ids, Op)
  if (notFoundIds.length) {
    throw new Error(`Пользователей с id: ${notFoundIds} не существует`)
  }
  return users
}

async function getGroups (ids, Group, Op) {
  const { groups, notFoundIds } = await getEntitysByIds(Group, ids, Op)
  if (notFoundIds.length) {
    throw new Error(`Групп с id: ${notFoundIds} не существует`)
  }
  return groups
}

async function addNewUser ({ name, password, employeeId }, fileMess, User) {
  const newUser = await User.create({
    name,
    password: await getEncryptedPassword(password),
    employeeId,
    avatar: fileMess ? fileMess.avatar : null
  })
  return newUser
}

async function addNewAvatarToUser (existedUser, avatar, { addAvatar }) {
  const fileMess = await addAvatar(avatar, existedUser.name)
  if (fileMess.messageType !== 'error') {
    existedUser.avatar = fileMess.avatar
  } else {
    throw new Error(fileMess.text)
  }
}

async function deleteUsersAvatar (existedUser, { deleteAvatar }) {
  const storedAvatar = existedUser.avatar
  await deleteAvatar(storedAvatar)
  existedUser.avatar = null
}

async function editUsersAvatar (existedUser, avatar, { addAvatar, deleteAvatar }) {
  const storedAvatar = existedUser.avatar
  await deleteAvatar(storedAvatar)
  const fileMess = await addAvatar(avatar, existedUser.name)

  if (fileMess.messageType !== 'error') {
    existedUser.avatar = fileMess.avatar
  } else {
    throw new Error(fileMess.text)
  }
}

async function handleAvatar (existedUser, avatar, { addAvatar, deleteAvatar }) {
  const storedAvatar = existedUser.avatar
  const needToAddNewAvatar = avatar && !storedAvatar
  const needToReplaceAvatar = storedAvatar && avatar && (avatar !== storedAvatar)

  if (needToAddNewAvatar) {
    await addNewAvatarToUser(existedUser, avatar, { addAvatar })
  } else if (needToReplaceAvatar) {
    await editUsersAvatar(existedUser, avatar, { addAvatar, deleteAvatar })
  } else {
    await deleteUsersAvatar(existedUser, { deleteAvatar })
  }
}

async function editExistedUser (existedUser, userInputs, commonFun) {
  const { addAvatar, deleteAvatar, deleteAvatarUpoad } = commonFun
  const { name, password, employeeId, avatar } = userInputs
  existedUser.name = name
  try {
    if (password !== '') {
      existedUser.password = await getEncryptedPassword(password)
    }

    if (employeeId) {
      existedUser.employeeId = employeeId
    }

    await handleAvatar(existedUser, avatar, { addAvatar, deleteAvatar })
  } catch (err) {
    if (avatar) {
      await deleteAvatarUpoad(avatar)
    }
    throw err
  }
}

function formSuccessAddMessage (message, newUser) {
  message.text = 'Пользователь успешно добавлен'
  message.id = newUser.id
  message.item = JSON.stringify({
    user: {
      name: newUser.name,
      employeeId: newUser.employeeId,
      avatar: newUser.avatar
    }
  })
}

function formSuccessEditMessage (message, existedUser) {
  message.text = 'Пользователь успешно изменён'
  message.id = existedUser.id
  message.item = JSON.stringify({
    user: {
      name: existedUser.name,
      employeeId: existedUser.employeeId,
      avatar: existedUser.avatar
    }
  })
}

function formSuccessLoginMessage (message, userId, token) {
  message.text = 'Вход успешен'
  message.token = token
  message.userId = userId
}

async function isAdminCheck (sessionStorage) {
  const decodedToken = await sessionStorage.getDecodedToken()
  const isAdmin = checkPermission(permissions.ADMIN, decodedToken)
  if (!isAdmin) {
    throw new Error('У вас нет прав для этой операции')
  }
}

export default (context, Auth) => {
  const {
    addAvatar, deleteAvatarUpoad, deleteAvatar, getUserById
  } = common(context, Auth)
  return {
    async addUser (root, { user: { name, password, employeeId, avatar } }, {
      authentication: { model: { User } },
      pubsub
    }) {
      const message = { type: 'addUser', messageType: 'success' }
      try {
        const { iName, iPassword } = getNameAndPassword(name, password)
        await checkCandidate(iName, User)

        let fileMess
        if (avatar) {
          fileMess = await addAvatar(avatar, name)
        }

        if (!avatar || fileMess.messageType === 'success') {
          const newUser = await addNewUser({
            name: iName,
            password: iPassword,
            employeeId
          }, fileMess, User)
          formSuccessAddMessage(message, newUser)

          pubsub.publish('USER_CHANGED', {
            userChanged: {
              type: 'add',
              id: [newUser.id],
              item: [await getUserById(newUser.id)]
            }
          })
        } else {
          await deleteAvatarUpoad(avatar)
          throw new Error(fileMess.text)
        }
      } catch (err) {
        message.messageType = 'error'
        message.text = `Ошибка: ${err}`
      }
      return message
    },

    async editUser (root, { id, user: { name, password, employeeId, avatar } }, {
      authentication: { model: { User }, sessionStorage },
      pubsub
    }) {
      const message = { type: 'editUser', messageType: 'success' }
      try {
        const decodedToken = await sessionStorage.getDecodedToken()
        const isAdmin = checkPermission(permissions.ADMIN, decodedToken)
        if (!isAdmin && decodedToken.userId.toString() !== id) {
          throw new Error('У вас нет прав для этой операции')
        }
        const { iName, iPassword } = getNameAndPassword(name, password)
        const existedUser = await getExistedUser(id, User)

        await editExistedUser(existedUser, {
          name: iName,
          password: iPassword,
          employeeId,
          avatar
        }, { addAvatar, deleteAvatar, deleteAvatarUpoad })

        await existedUser.save()
        formSuccessEditMessage(message, existedUser)

        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'edit',
            id: [existedUser.id],
            item: [await getUserById(existedUser.id)]
          }
        })
      } catch (err) {
        message.messageType = 'error'
        message.text = `Ошибка: ${err}`
      }
      return message
    },

    async login (root, { user: { name, password } }, {
      authentication: { sessionStorage }
    }) {
      const message = { type: 'login', messageType: 'success', token: null }
      try {
        const { iName, iPassword } = getNameAndPassword(name, password)
        const { token, userId } = await sessionStorage
          .createNewSession(iName, iPassword)

        formSuccessLoginMessage(message, userId, token)
      } catch (err) {
        message.text = `Ошибка: ${err}`
        message.messageType = 'error'
      }
      return message
    },

    async sessionUpdate (root, args, { authentication: { sessionStorage } }) {
      const message = { type: 'sessionUpdate', messageType: 'success', token: null }
      try {
        const decodedToken = await sessionStorage.getDecodedToken()
        const token = await sessionStorage.updateSessionToken()
        message.text = 'Сессия успешно продлена'
        message.token = token
        message.userId = decodedToken.userId
      } catch (err) {
        message.text = `Ошибка: ${err}`
        message.messageType = 'error'
      }
      return message
    },

    async logout (root, args, { authentication: { sessionStorage } }) {
      const message = {
        type: 'login',
        messageType: 'success',
        text: 'Вы успешно завершили сессию',
        token: null
      }
      try {
        message.userId = await sessionStorage.deleteSession()
      } catch (err) {
        message.text = `Ошибка: ${err}`
        message.messageType = 'error'
      }
      return message
    },

    async deleteUser (root, { id }, {
      authentication: { model: { User }, sessionStorage },
      pubsub
    }) {
      let message = {
        type: 'deleteUser',
        text: 'Пользователь успешно удалён',
        messageType: 'success',
        id
      }
      try {
        await isAdminCheck(sessionStorage)

        const candidate = await User.findByPk(id)
        if (candidate.avatar) {
          await deleteAvatar(candidate.avatar)
        }
        await candidate.destroy()
        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'delete',
            id: [id]
          }
        })
      } catch (err) {
        message = {
          type: 'deleteUser',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
      }
      return message
    },

    async addGroup (root, { group }, {
      authentication: { model: { Group }, sessionStorage }
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const iName = getValidName(group.name)
        const candidate = await Group.findOne({ where: { name: iName } })
        if (candidate) {
          throw new Error('Группа с таким названием уже существует')
        }
        const newItem = await Group.create({
          name: iName,
          permissions: +group.permissions
        })
        const message = {
          type: 'addGroup',
          text: 'Группа успешно добавлена',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({
            group: {
              name: group.name,
              permissions: group.permissions
            }
          })
        }
        return message
      } catch (err) {
        const message = {
          type: 'addGroup',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async editGroup (root, { id, group }, {
      authentication: { model: { Group }, sessionStorage }
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const iName = getValidName(group.name)
        const candidate = await Group.findByPk(id)
        if (!candidate) {
          throw new Error('Группы с таким id не существует')
        }
        candidate.name = iName
        candidate.permissions = +group.permissions
        await candidate.save()
        const message = {
          type: 'editGroup',
          text: 'Группа успешно изменена',
          messageType: 'success',
          id,
          item: JSON.stringify({
            group: {
              name: group.name,
              permissions: group.permissions
            }
          })
        }
        return message
      } catch (err) {
        const message = {
          type: 'editGroup',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async deleteGroup (root, { id }, {
      authentication: { model: { Group }, sessionStorage }
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const candidate = await Group.findByPk(id)
        if (!candidate) {
          throw new Error(`Группа с id: ${id} не найдена`)
        }
        await candidate.destroy()
        const message = {
          type: 'deleteGroup',
          text: 'Группа успешно удалена',
          messageType: 'success',
          id
        }
        return message
      } catch (err) {
        const message = {
          type: 'deleteGroup',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async assignUsersToGroup (root, { userIds, groupId }, {
      authentication: { model: { Group, User }, sessionStorage },
      Op,
      pubsub
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const group = await Group.findByPk(groupId)
        if (!group) {
          const message = {
            type: 'assignUsersToGroup',
            text: 'Группы с таким id не существует',
            messageType: 'error'
          }
          return message
        }
        const users = await getUsers(userIds, User, Op)
        await group.setUsers(users)
        const message = {
          type: 'assignUsersToGroup',
          text: 'Пользователи успешно добавлены в группу',
          messageType: 'success',
          id: userIds.join(',')
        }
        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'edit',
            id: userIds,
            item: await getUserById(userIds)
          }
        })
        return message
      } catch (err) {
        const message = {
          type: 'assignUsersToGroup',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async assignUserToGroups (root, { userId, groupIds }, {
      authentication: { model: { Group, User }, sessionStorage },
      Op,
      pubsub
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const user = await User.findByPk(userId)
        if (!user) {
          const message = {
            type: 'assignUserToGroups',
            text: 'Пользователя с таким id не существует',
            messageType: 'error'
          }
          return message
        }
        const groups = await getGroups(groupIds, Group, Op)
        await user.setGroups(groups)
        const message = {
          type: 'assignUserToGroups',
          text: 'Пользователь успешно добавлен в группы',
          messageType: 'success',
          id: userId
        }
        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'edit',
            id: [userId],
            item: [await getUserById(userId)]
          }
        })
        return message
      } catch (err) {
        const message = {
          type: 'assignUserToGroups',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async removeUsersFromGroup (root, { userIds, groupId }, {
      authentication: { model: { Group, User }, sessionStorage },
      Op,
      pubsub
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const group = await Group.findByPk(groupId)
        if (!group) {
          const message = {
            type: 'removeUsersFromGroup',
            text: 'Группы с таким id не существует',
            messageType: 'error'
          }
          return message
        }
        const users = await getUsers(userIds, User, Op)
        await group.removeUsers(users)
        const message = {
          type: 'removeUsersFromGroup',
          text: 'Пользователи успешно исключены из группы',
          messageType: 'success',
          id: userIds.join(',')
        }
        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'edit',
            id: userIds,
            item: await getUserById(userIds)
          }
        })
        return message
      } catch (err) {
        const message = {
          type: 'removeUsersFromGroup',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async removeUserFromAllGroups (root, { id }, {
      authentication: { model: { User }, sessionStorage },
      pubsub
    }) {
      try {
        await isAdminCheck(sessionStorage)

        const user = await User.findByPk(id)
        if (!user) {
          const message = {
            type: 'removeUserFromAllGroups',
            text: 'Пользователя с таким id не существует',
            messageType: 'error'
          }
          return message
        }
        const userGroups = await user.getGroups()
        await user.removeGroups(userGroups)
        const message = {
          type: 'removeUserFromAllGroups',
          text: 'Пользователь успешно исключён из всех групп',
          messageType: 'success',
          id
        }
        pubsub.publish('USER_CHANGED', {
          userChanged: {
            type: 'edit',
            id: [id],
            item: [await getUserById(id)]
          }
        })
        return message
      } catch (err) {
        const message = {
          type: 'removeUserFromAllGroups',
          text: `Ошибка: ${err}`,
          messageType: 'error'
        }
        return message
      }
    },

    async deleteUploadedFiles (root, { files }) {
      const message = {
        type: 'deleteUploadedFiles',
        text: '',
        messageType: 'success'
      }
      try {
        const promises = files.map(deleteAvatarUpoad)
        const deleteFilesResults = await Promise.allSettled(promises)
        deleteFilesResults.forEach((res) => {
          if (res.messageType === 'error') {
            message.messageType = res.messageType
            message.text += `${res.text}\n`
          }
        })
        if (message.messageType === 'success') {
          message.text = 'Все файлы успешно удалены'
        }
      } catch (err) {
        message.messageType = 'error'
        message.text = `Ошибка: ${err}`
      }
      return message
    }
  }
}
