/* eslint-disable import/prefer-default-export */
import {
  isManagerCheck, defaultErrorHandler, fieldRenamer,
  isLoggedCheck, isClerkCheck, isAdminCheck, isDepHeadCheck
} from '../../../common.js'

const checks = {
  isLoggedCheck,
  isAdminCheck,
  isClerkCheck,
  isDepHeadCheck,
  isManagerCheck
}

const checkNames = ['isLoggedCheck', 'isAdminCheck', 'isClerkCheck',
  'isDepHeadCheck', 'isManagerCheck']

function getObjToSearch (uniqueFieldsArr, validatedInputs) {
  const output = {}
  uniqueFieldsArr.forEach((el) => {
    output[el] = validatedInputs[el]
  })
  return output
}

function finishCreating (newItem, options, serverContext) {
  const item = fieldRenamer([newItem.dataValues], options.fieldRenamer)[0]
  const message = {
    type: `add${options.entity}`,
    text: options.successText,
    messageType: 'success',
    id: newItem.id,
    item: JSON.stringify(item)
  }
  serverContext.pubsub.publish(options.subscriptionKey, {
    [options.subscriptionTypeName]: {
      type: 'add',
      id: newItem.id,
      item
    }
  })
  return message
}

// eslint-disable-next-line complexity
export async function addEntity (options, args, serverContext) {
  const {
    core: { logger },
    authentication: { sessionStorage },
    documentFlow: { model }
  } = serverContext
  /*
  options: {
    check: String,
    entity: String,
    successText: String,
    subscriptionKey: String,
    subscriptionTypeName: String,
    getValidatedInputs: Function(args),
    afterCreate: Function(newItem, args, serverContext),
    uniqueFields: [String],
    existErrorText: String
    fieldRenamer: [
      {
        oldName: String,
        newName: String
      }
    ]
  }
*/
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    const validatedInputs = await options.getValidatedInputs(args, serverContext)
    if (options.uniqueFields && options.uniqueFields.length) {
      const objToSearch = getObjToSearch(options.uniqueFields, validatedInputs)
      const candidate = await model[options.entity].findOne({ where: objToSearch })
      if (candidate) {
        throw new Error(options.existErrorText)
      }
    }

    const newItem = await model[options.entity].create(validatedInputs)
    if (options.afterCreate) {
      await options.afterCreate(newItem, args, serverContext)
    }

    return finishCreating(newItem, options, serverContext)
  } catch (err) {
    return defaultErrorHandler(err, logger, {
      functionName: `add${options.entity}`
    })
  }
}

export async function editEntity (options, args, serverContext) {
  const {
    core: { logger },
    authentication: { sessionStorage },
    documentFlow: { model },
    pubsub
  } = serverContext
  /*
  options: {
    check: String,
    entity: String,
    entityName: String,
    successText: String,
    subscriptionKey: String,
    subscriptionTypeName: String,
    editFunction: Function(candidate, args, serverContext) // save not needed
    fieldRenamer: [
      {
        oldName: String,
        newName: String
      }
    ]
  }
*/
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    const candidate = await model[options.entity].findByPk(args.id)
    if (!candidate) {
      throw new Error(`${options.entityName} с id: ${args.id} не существует`)
    }

    await options.editFunction(candidate, args, serverContext)

    await candidate.save()
    const item = fieldRenamer([candidate.dataValues], options.fieldRenamer)[0]
    const message = {
      type: `edit${options.entity}`,
      text: options.successText,
      messageType: 'success',
      id: args.id,
      item: JSON.stringify(item)
    }
    pubsub.publish(options.subscriptionKey, {
      [options.subscriptionTypeName]: {
        type: 'edit',
        id: candidate.id,
        item
      }
    })
    return message
  } catch (err) {
    return defaultErrorHandler(err, logger, {
      functionName: `edit${options.entity}`
    })
  }
}

export async function deleteEntitys (options, args, serverContext) {
  /*
    options: {
      check: String,
      entity: String,
      successText: String,
      subscriptionKey: String,
      subscriptionTypeName: String
      beforeDeleteFunction: Function (args, serverContext)
    }
  */
  const {
    core: { logger },
    authentication: { sessionStorage },
    documentFlow: { model },
    Op,
    pubsub
  } = serverContext
  const { ids } = args
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    if (!ids.length) {
      throw new Error('Не указаны id')
    }
    if (options.beforeDeleteFunction) {
      await options.beforeDeleteFunction(args, serverContext)
    }
    await model[options.entity].destroy({
      where: { id: { [Op.in]: ids } }
    })
    const message = {
      type: `delete${options.entity}s`,
      text: options.successText,
      messageType: 'success',
      ids
    }
    pubsub.publish(options.subscriptionKey, {
      [options.subscriptionTypeName]: {
        type: 'delete',
        ids
      }
    })
    return message
  } catch (err) {
    return defaultErrorHandler(err, logger, {
      functionName: `delete${options.entity}`
    })
  }
}
