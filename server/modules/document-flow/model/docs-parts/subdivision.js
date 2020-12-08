import { buildModel } from '../../../common.js'

const subdivisionModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Название должности
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  }
})

export const buildSubdivisionModel = buildModel('Subdivision', subdivisionModel)

