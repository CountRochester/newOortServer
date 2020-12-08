// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const IsPol = dbOld.define('IsPol', {
    // Адресат
    POL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    NewInt: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    NewExt: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  })
  return IsPol
}
