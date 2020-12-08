import { buildModel } from '../../../common.js'

const departmentModel = (Sequelize) => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  depName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  depNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shortName: {
    type: Sequelize.STRING
  },
  depPrefix: {
    type: Sequelize.STRING,
    allowNull: false
  },
  parentDepartmentId: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
})

export const buildDepartmentModel = buildModel('Department', departmentModel)
