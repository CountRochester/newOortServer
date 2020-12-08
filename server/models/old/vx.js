// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const Vx = dbOld.define('Vx', {
    // ID
    NOM: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    // Дата входящего
    DATT: {
      allowNull: false,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Тип документа
    TIP: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
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
    // Исходящий номер отправителя
    NISH: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дата исходящего номера отправителя
    DATISH: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Номер получателя
    NPOL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Получатель
    POL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дата резолюции
    DRESOL: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Ответ исх. №
    NASHIN: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дата ответа
    NASHDAT: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Текст резолюции
    DOP4: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Тема
    DOP5: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Исполнитель резолюции или документа
    DOP6: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // номер исполнителя резолюции
    NDOP6: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Входящий номер отдела
    NMESTONAH: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })
  return Vx
}
