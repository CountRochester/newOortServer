import { buildModel } from '../../../common.js'

const organisationModel = Sequelize =>  ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Название организации
  orgName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Почтовый индекс
  postNumber: {
    type: Sequelize.STRING
  },
  // Город
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Область
  region: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Улица
  street: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Номер дома
  building: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Телефон
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Факс
  fax: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // Email
  email: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

export const buildOrganisationModel = buildModel('Organisation', organisationModel)
