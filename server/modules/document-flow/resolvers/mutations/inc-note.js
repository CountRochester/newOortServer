import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

const validateNoteInput = (entity, conf) => (args) => {
  const { text, departmentId } = args[entity]
  const iText = getValidValue(text, 'name')
  if (!iText.lenght) {
    throw new Error('Текст примечания не должен быть пустым')
  }
  const docIdOldName = conf[entity].renameOptions[0].oldName
  const docIdName = conf[entity].renameOptions[0].newName
  return {
    text: iText,
    [docIdOldName]: args[entity][docIdName],
    DepartmentId: departmentId
  }
}

const config = {}
config.extIncNote = {
  renameOptions: [
    {
      oldName: 'ExtIncomingId',
      newName: 'extIncomingId'
    },
    {
      oldName: 'DepartmentId',
      newName: 'departmentId'
    }
  ],
  validateInputs: validateNoteInput('extIncNote', config),
  setDoc: 'setExtIncoming'
}
config.intIncNote = {
  renameOptions: [
    {
      oldName: 'IntIncomingId',
      newName: 'intIncomingId'
    },
    {
      oldName: 'DepartmentId',
      newName: 'departmentId'
    }
  ],
  validateInputs: validateNoteInput('intIncNote', config),
  setDoc: 'setIntIncoming'
}
config.internalNote = {
  renameOptions: [
    {
      oldName: 'InternalId',
      newName: 'internalId'
    },
    {
      oldName: 'DepartmentId',
      newName: 'departmentId'
    }
  ],
  validateInputs: validateNoteInput('internalNote', config),
  setDoc: 'setInternal'
}

const editNoteFun = (entity) => async (candidate, args) => {
  const validatedParams = config[entity].validateInputs(args)
  const { text, DepartmentId } = validatedParams
  const docIdOldName = config[entity].renameOptions[0].oldName
  const docId = validatedParams[docIdOldName]
  const { setDoc } = config[entity]

  if (docId && docId !== candidate.docId) {
    await candidate[setDoc](docId)
  }
  if (DepartmentId && DepartmentId !== candidate.DepartmentId) {
    await candidate.setDepartment(DepartmentId)
  }
  candidate.text = text
}

export default {
  async addExtIncNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtIncNote',
      successText: 'Примечание успешно добавлено',
      subscriptionTypeName: 'extIncNoteChanged',
      subscriptionKey: 'EXT_INC_NOTE_CHANGED',
      getValidatedInputs: config.extIncNote.validateInputs,
      existErrorText: 'Такое примечание уже существует',
      uniqueFields: ['ExtIncomingId', 'DepartmentId'],
      fieldRenamer: config.extIncNote.renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editExtIncNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtIncNote',
      entityName: 'Примечание',
      successText: 'Примечание успешно изменено',
      subscriptionTypeName: 'extIncNoteChanged',
      subscriptionKey: 'EXT_INC_NOTE_CHANGED',
      editFunction: editNoteFun('extIncNote'),
      fieldRenamer: config.extIncNote.renameOptions
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteExtIncNotes (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'ExtIncNote',
      successText: 'Примечания успешно удалены',
      subscriptionTypeName: 'extIncNoteChanged',
      subscriptionKey: 'EXT_INC_NOTE_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  },

  async addIntIncNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'IntIncNote',
      successText: 'Примечание успешно добавлено',
      subscriptionTypeName: 'intIncNoteChanged',
      subscriptionKey: 'INT_INC_NOTE_CHANGED',
      getValidatedInputs: config.intIncNote.validateInputs,
      existErrorText: 'Такое примечание уже существует',
      uniqueFields: ['IntIncomingId', 'DepartmentId'],
      fieldRenamer: config.intIncNote.renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editIntIncNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'IntIncNote',
      entityName: 'Примечание',
      successText: 'Примечание успешно изменено',
      subscriptionTypeName: 'intIncNoteChanged',
      subscriptionKey: 'INT_INC_NOTE_CHANGED',
      editFunction: editNoteFun('intIncNote'),
      fieldRenamer: config.intIncNote.renameOptions
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteIntIncNotes (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'IntIncNote',
      successText: 'Примечания успешно удалены',
      subscriptionTypeName: 'intIncNoteChanged',
      subscriptionKey: 'INT_INC_NOTE_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  },

  async addInternalNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'InternalNote',
      successText: 'Примечание успешно добавлено',
      subscriptionTypeName: 'internalNoteChanged',
      subscriptionKey: 'INTERNAL_NOTE_CHANGED',
      getValidatedInputs: config.internalNote.validateInputs,
      existErrorText: 'Такое примечание уже существует',
      uniqueFields: ['InternalId', 'DepartmentId'],
      fieldRenamer: config.internalNote.renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editInternalNote (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'InternalNote',
      entityName: 'Примечание',
      successText: 'Примечание успешно изменено',
      subscriptionTypeName: 'internalNoteChanged',
      subscriptionKey: 'INTERNAL_NOTE_CHANGED',
      editFunction: editNoteFun('internalNote'),
      fieldRenamer: config.internalNote.renameOptions
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteInternalNotes (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'InternalNote',
      successText: 'Примечания успешно удалены',
      subscriptionTypeName: 'internalNoteChanged',
      subscriptionKey: 'INTERNAL_NOTE_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
