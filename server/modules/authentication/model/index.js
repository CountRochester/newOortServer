import Sequelize from 'sequelize'
import { buildUserModel } from './auth-parts/user.js'
import { buildGroupModel } from './auth-parts/group.js'
import { buildSessionModel } from './auth-parts/session.js'

// ----------------------------------------------------------------------------------
// Подключение вспомогательных моделей
import { buildUserGroupModel } from './auth-parts/service/user-group.js'

export const buildAuthModel = (authDBLink) => {
  const User = buildUserModel(authDBLink, Sequelize)
  const Group = buildGroupModel(authDBLink, Sequelize)
  const session = buildSessionModel(authDBLink, Sequelize)
  const userGroup = buildUserGroupModel(authDBLink, Sequelize)

  // Пользователь может принадлежать к нескольким группам
  User.belongsToMany(Group, { through: userGroup })
  // Вкаждой группе может находиться несколько пользователей
  Group.belongsToMany(User, { through: userGroup })

  // У пользователя может быть одна сессия
  User.hasOne(session)
  // Каждая сессия принадлежит пользователю
  session.belongsTo(User)

  return { User, Group, session }
}

export default buildAuthModel
