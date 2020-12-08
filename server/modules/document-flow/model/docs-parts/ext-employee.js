import { buildModel } from '../../../common.js'

const extEmployeeModel = Sequelize => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Имя
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Фамилия
  secondName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Фамилия в дательном падеже
  secondNameDat: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Отчество
  middleName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  phone1: {
    type: Sequelize.STRING
  },
  phone2: {
    type: Sequelize.STRING
  },
  fax: {
    type: Sequelize.STRING
  },
  email1: {
    type: Sequelize.STRING
  },
  email2: {
    type: Sequelize.STRING
  }
})

export const buildExtEmployeeModel = buildModel('ExtEmployee', extEmployeeModel)
