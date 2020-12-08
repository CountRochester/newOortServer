import { buildModel } from '../../../common.js'
const intOutgoingModel = Sequelize =>  ({
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
    type: Sequelize.INTEGER,
    allowNull: true
  },
  // Дата исходящего
  outDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  // Краткое содержание
  subject: {
    type: Sequelize.STRING,
    allowNull: true
  },
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

export const buildIntOutgoingModel = buildModel('IntOutgoing', intOutgoingModel)
