import { buildModel } from '../../../common.js'

const sessionModel = (Sequelize) => ({
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  userId: Sequelize.INTEGER,
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000)
})

export const buildSessionModel = buildModel('Session', sessionModel)

export default buildSessionModel
