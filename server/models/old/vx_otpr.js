// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const VxOtpr = dbOld.define('VxOtpr', {
    // Номер подписанта
    NOTPR: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    OTPR: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    newExt: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    newIn: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return VxOtpr
}
