import { buildModel } from '../../../common.js'

const positionModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Название должности
  posName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  // Название должности в дательном падеже
  posNameDat: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  // Может подписывать внешние документы
  canSignExtDocs: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    unique: false
  },
  // Может подписывать внутренние документы
  canSignIntDocs: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    unique: false
  }
})

export const buildPositionModel = buildModel('Position', positionModel)
