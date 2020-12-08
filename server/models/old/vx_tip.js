// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const VxTip = dbOld.define('VxTip', {
    // Номер подписанта
    TIP: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    newTip: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return VxTip
}
