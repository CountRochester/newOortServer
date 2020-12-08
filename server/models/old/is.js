// Модель группы
// ----------------------------------------------
// Подключение модулей
// const Sequelize = require('sequelize')
// const dbOld = require('../../db/old')

// ----------------------------------------------
module.exports = (dbOld, DataTypes) => {
  const Is = dbOld.define('Is', {
    // ID
    NOMIS: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    // Дата исходящего
    DATT: {
      allowNull: false,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // ответ на вх.
    VXNOM: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дата вх.
    DVXO: {
      allowNull: true,
      unique: false,
      type: DataTypes.DATEONLY
    },
    // Тип документа
    TIP: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
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
    // Номер подписанта
    NOTPRAV: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Подписант
    OTPRAV: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Номер исполнителя
    NISPOL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Исполнитель
    ISPOL: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Исходящий номер
    NMESTONAH: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Тема
    NAMDOK: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Номер дополнительного получателя
    NDOPPOL1: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дополнительный получатель
    DOPPOL1: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Номер дополнительного получателя
    NDOPPOL2: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дополнительный получатель
    DOPPOL2: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Номер дополнительного получателя
    NDOPPOL3: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дополнительный получатель
    DOPPOL3: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Номер дополнительного получателя
    NDOPPOL4: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    },
    // Дополнительный получатель
    DOPPOL4: {
      allowNull: true,
      unique: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })
  return Is
}
