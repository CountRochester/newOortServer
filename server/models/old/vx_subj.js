// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const VxSubj = dbOld.define('VxSubj', {
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
    NISH: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    DATISH: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    subject: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return VxSubj
}
