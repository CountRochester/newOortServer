import { buildModel } from '../../../common.js'

const fileModel = Sequelize => ({
  // ID
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  // Имя файла
  file: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

export const buildExtIncFileModel = buildModel('ExtIncFile', fileModel)
export const buildExtOutFileModel = buildModel('ExtOutFile', fileModel)
export const buildIntIncFileModel = buildModel('IntIncFile', fileModel)
export const buildIntOutFileModel = buildModel('IntOutFile', fileModel)
export const buildInternalFileModel = buildModel('InternalFile', fileModel)
