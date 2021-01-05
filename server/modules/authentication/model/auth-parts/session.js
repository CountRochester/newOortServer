import { buildModel } from '../../../common.js'

const sessionModel = (Sequelize) => ({
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  expires: {
    type: Sequelize.DATE,
    allowNull: false
  },
  employeeId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  data: Sequelize.STRING(50000)
})

export const buildSessionModel = buildModel('Session', sessionModel)

export default buildSessionModel
