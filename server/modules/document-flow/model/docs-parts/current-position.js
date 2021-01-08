import { buildModel } from '../../../common.js'

const currentPositionModel = (Sequelize) => ({
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
  EmployeeId: {
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
  DepartmentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false
  },
  // Допоплнительный префикс во внешнем документе
  extPrefix: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  },
  // Допоплнительный префикс во внутреннем документе
  intPrefix: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  }
})

export const buildCurrentPositionModel = buildModel('CurrentPosition', currentPositionModel)
