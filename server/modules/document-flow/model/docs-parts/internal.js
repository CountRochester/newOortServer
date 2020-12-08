// Модель внутреннего документа
import { buildModel } from '../../../common.js'

const internalModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Входящий номер по учёту
  incNumber: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  // Дата входящего
  incDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  // Входящий номер по учёту
  docNumber: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Дата входящего
  docDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  // Краткое содержание
  subject: {
    type: Sequelize.STRING,
    allowNull: true
  },
  docNumberPrefix: {
    type: Sequelize.STRING,
    allowNull: true
  }
})
  
export const buildInternalModel = buildModel('Internal', internalModel)
