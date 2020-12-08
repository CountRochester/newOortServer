// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const IsIspol = dbOld.define('IsIspol', {
    // Адресат
    ISPOL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    newIsp: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return IsIspol
}
