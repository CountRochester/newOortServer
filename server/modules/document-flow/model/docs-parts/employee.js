import { buildModel } from '../../../common.js'

const employeeModel = Sequelize => ({
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
    allowNull: false
  },
  // Отчество
  middleName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Табельный номер
  tabelNumber: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Телефон
  phone1: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Телефон
  phone2: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Телефон
  phone3: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Email
  email1: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Email
  email2: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

export const buildEmployeeModel = buildModel('Employee', employeeModel)
