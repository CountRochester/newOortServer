import { buildModel } from '../../../common.js'

const contractModel = (Sequelize) => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Номер контракта
  number: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  // Дата контракта
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

export const buildContractModel = buildModel('Contract', contractModel)
