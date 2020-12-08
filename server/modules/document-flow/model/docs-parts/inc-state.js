import { buildModel } from '../../../common.js'

  const stateModel = Sequelize => ({
    // ID
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    }
  })

export const buildExtIncStateModel = buildModel('ExtIncState', stateModel)
export const buildIntIncStateModel = buildModel('IntIncState', stateModel)
export const buildInternalIncStateModel = buildModel('InternalIncState', stateModel)
