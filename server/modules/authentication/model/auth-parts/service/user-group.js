import { buildModel } from '../../../../common.js'

const userGroupModel = (Sequelize) => ({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  }
})

export const buildUserGroupModel = buildModel('userGroup', userGroupModel)
