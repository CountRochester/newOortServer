// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const IsOtprav = dbOld.define('IsOtprav', {
    // Адресат
    OTPRAV: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    newOtpr: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return IsOtprav
}
