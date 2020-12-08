// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const IsSubj = dbOld.define('IsSubj', {
    // Номер подписанта
    NMESTONAH: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    DATT: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Подписант
    VXNOM: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    DVXO: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    Subject: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return IsSubj
}
