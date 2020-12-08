import { buildModel } from '../../../common.js'

const typeModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Имя типа документа
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

export const buildTypeModel = buildModel('Type', typeModel)

