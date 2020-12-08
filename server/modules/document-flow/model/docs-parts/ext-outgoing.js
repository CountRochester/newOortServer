import { buildModel } from '../../../common.js'

const extOutgoingModel = Sequelize => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Исходящий номер
  outNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Дата исходящего
  outDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  // Краткое содержание
  subject: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Префикс
  prefix: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  },
  // Примечание
  note: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false
  }
})

export const buildExtOutgoingModel = buildModel('ExtOutgoing', extOutgoingModel)
