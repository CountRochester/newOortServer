// Модель внешнего входящего документа
import { buildModel } from '../../../common.js'

const extIncomingModel = Sequelize => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Краткое содержание
  subject: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Исходящий номер
  extNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Дата исходящего
  extDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  // Требуется ответ
  needAnswer: {
    type: Sequelize.BOOLEAN
  }
})

export const buildExtIncomingModel = buildModel('ExtIncoming', extIncomingModel)
