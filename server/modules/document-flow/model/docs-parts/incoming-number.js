import { buildModel } from '../../../common.js'

  const incomingNumberModel = Sequelize => ({
    // ID
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    // Номер входящего внешнего документа
    incNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    },
    // Дата входящего внешнего документа
    incDate: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: false
    },
    prefix: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    }
  })

export const buildIncomingNumberModel = buildModel('IncomingNumber', incomingNumberModel)
export const buildIntIncomingNumberModel = buildModel('IntIncomingNumber', incomingNumberModel)
export const buildInternalIncomingNumberModel = buildModel('InternalIncomingNumber', incomingNumberModel)
