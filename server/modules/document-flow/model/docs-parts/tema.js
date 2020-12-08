import { buildModel } from '../../../common.js'

const temaModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Название темы
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

export const buildTemaModel = buildModel('Tema', temaModel)
