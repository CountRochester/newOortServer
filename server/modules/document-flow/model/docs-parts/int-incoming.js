// Модель внутреннего входящего документа
import { buildModel } from '../../../common.js'

const intIncomingModel = Sequelize =>  ({
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
    type: Sequelize.INTEGER,
    allowNull: true
  },
  extNumberPrefix: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Дата исходящего
  extDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  // Требуется ответ
  needAnswer: {
    type: Sequelize.BOOLEAN
  }
})

export const buildIntIncomingModel = buildModel('IntIncoming', intIncomingModel)
