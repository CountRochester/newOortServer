import { buildModel } from '../../../common.js'

const userModel = (Sequelize) => ({
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
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  employeeId: {
    allowNull: true,
    type: Sequelize.INTEGER
  },
  avatar: {
    allowNull: true,
    type: Sequelize.STRING
  }
})

export const buildUserModel = buildModel('User', userModel)

export default buildUserModel
