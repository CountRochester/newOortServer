import { deleteEntitys, addEntity, editEntity } from './common.js'
import {
  getValidValue, formatDate, reduceArrayByKey,
  isClerkCheck, defaultErrorHandler, fieldRenamer
} from '../../../common.js'

const renameOptions = [
  {
    oldName: 'ExtIncomingId',
    newName: 'extIncomingId'
  },
  {
    oldName: 'IntIncomingId',
    newName: 'intIncomingId'
  },
  {
    oldName: 'InternalId',
    newName: 'internalId'
  }
]

function validateResolutionInput ({
  resolution: {
    text,
    expirationDate,
    extIncomingId,
    intIncomingId,
    internalId,
    authorId,
    complete
  }
}) {
  const resText = getValidValue(text, 'name')
  const resExpirationDate = expirationDate
    ? formatDate(expirationDate)
    : undefined
  if (!resText.length) {
    throw new Error('Резолюция не должна быть пустой')
  }
  const output = {
    text: resText,
    expirationDate: resExpirationDate,
    ExtIncomingId: extIncomingId,
    IntIncomingId: intIncomingId,
    InternalId: internalId,
    authorId,
    complete: !!complete
  }
  return output
}

async function afterCreateResolution (newItem, { executantIds }) {
  if (executantIds) {
    await newItem.setExecutant(executantIds)
  }
  const executants = await newItem.getExecutant({
    attributes: ['id'],
    raw: true
  })
  newItem.dataValues.executants = reduceArrayByKey(executants, 'id')
}

async function editResolutionFun (candidate, args) {
  const {
    text, expirationDate, ExtIncomingId,
    IntIncomingId, InternalId, authorId, complete
  } = validateResolutionInput(args)
  if (args.executantIds) {
    await candidate.setExecutant(args.executantIds)
  }
  candidate.text = text
  candidate.expirationDate = expirationDate
  candidate.ExtIncomingId = ExtIncomingId
  candidate.IntIncomingId = IntIncomingId
  candidate.InternalId = InternalId
  candidate.authorId = authorId
  candidate.complete = complete
}

export default {
  async addResolution (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Resolution',
      successText: 'Резолюция успешно добавлена',
      subscriptionTypeName: 'resolutionChanged',
      subscriptionKey: 'RESOLUTION_CHANGED',
      getValidatedInputs: validateResolutionInput,
      afterCreate: afterCreateResolution,
      fieldRenamer: renameOptions
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editResolution (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Resolution',
      entityName: 'Резолюция',
      successText: 'Резолюция успешно изменена',
      subscriptionTypeName: 'resolutionChanged',
      subscriptionKey: 'RESOLUTION_CHANGED',
      editFunction: editResolutionFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteResolutions (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Resolution',
      successText: 'Резолюции успешно удалены',
      subscriptionTypeName: 'resolutionChanged',
      subscriptionKey: 'RESOLUTION_CHANGED'
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  },

  async comleteResolution (_, args, serverContext) {
    const {
      authentication: { sessionStorage },
      documentFlow: { model: Resolution },
      core: { logger }, pubsub
    } = serverContext
    try {
      await isClerkCheck(sessionStorage)
      const resolution = await Resolution.findByPk(args.id)
      if (!resolution) {
        throw new Error(`Резолюции с id: ${args.id} не существует`)
      }

      resolution.complete = true
      await resolution.save()

      const item = fieldRenamer([resolution.dataValues], renameOptions)[0]
      const message = {
        type: 'comleteResolution',
        text: 'Резолюция успешно изменена',
        messageType: 'success',
        id: args.id,
        item: JSON.stringify(item)
      }
      pubsub.publish('RESOLUTION_CHANGED', {
        resolutionChanged: {
          type: 'edit',
          id: resolution.id,
          item
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err, logger, {
        functionName: 'comleteResolution'
      })
    }
  }
}
