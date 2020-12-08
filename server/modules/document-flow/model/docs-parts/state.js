import { buildModel } from '../../../common.js'

const stateModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false
  }
})

export const buildStateModel = buildModel('State', stateModel)

