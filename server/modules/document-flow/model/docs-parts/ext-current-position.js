import { buildModel } from '../../../common.js'

const extCurrentPositionModel = Sequelize => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Дата вступления в должность
  startDate: {
    type: Sequelize.DATE,
    allowNull: true,
    unique: false
  },
  // Дата перевода
  endDate: {
    type: Sequelize.DATE,
    allowNull: true,
    unique: false
  },
  // Ссылка на служащего
  ExtEmployeeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false
  },
  // Ссылка на должность
  PositionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false
  },
  // Ссылка на отдел
  OrganisationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false
  }
})

export const buildExtCurrentPositionModel = buildModel('ExtCurrentPosition', extCurrentPositionModel)
