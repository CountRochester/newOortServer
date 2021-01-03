import { buildModel } from '../../../common.js'

const groupModel = (Sequelize) => ({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING
  },
  permissions: {
    allowNull: true,
    unique: false,
    type: Sequelize.INTEGER
  }
})

export const buildGroupModel = buildModel('Group', groupModel)

export default buildGroupModel
