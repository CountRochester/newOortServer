import { buildModel } from '../../../common.js'

const resolutionModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Резолюция
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Срок
  expirationDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  // Исполнена ли резолюция
  complete: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
})

export const buildResolutionModel = buildModel('Resolution', resolutionModel)

