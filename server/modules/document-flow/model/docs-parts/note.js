import { buildModel } from '../../../common.js'

  const noteModel = Sequelize => ({
    // ID
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    // Примечание
    text: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false
    }
  })

export const buildExtIncNoteModel = buildModel('ExtIncNote', noteModel)
export const buildIntIncNoteModel = buildModel('IntIncNote', noteModel)
export const buildInternalNoteModel = buildModel('InternalNote', noteModel)
