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

async function finishCreating (newItem, { options, args, serverContext }) {
  // const item = fieldRenamer([newItem.dataValues], options.fieldRenamer)[0]
  const item = await formItem(newItem, { options, args, serverContext })
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

async function validate (options, args, serverContext) {
  const { documentFlow: { model } } = serverContext
  const validatedInputs = await options.getValidatedInputs(args, serverContext)

  if (options.existValidation) {
    await options.existValidation(args, serverContext)
  } else if (options.uniqueFields && options.uniqueFields.length) {
    const objToSearch = getObjToSearch(options.uniqueFields, validatedInputs)
    const candidate = await model[options.entity].findOne({ where: objToSearch })
    if (candidate) {
      throw new Error(options.existErrorText)
    }
  }
  return validatedInputs
}

async function formItem (candidate, { options, args, serverContext }) {
  let item
  if (options.formOutput) {
    item = await options.formOutput(candidate, args, serverContext)
  } else {
    item = fieldRenamer([candidate.dataValues], options.fieldRenamer)[0]
  }
  return item
}

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
    existValidation: Function(args, serverContext),
    afterCreate: Function(newItem, args, serverContext),
    formOutput: Function(candidate, args, serverContext)
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
    const validatedInputs = await validate()

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
    formOutput: Function(candidate, args, serverContext)
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

    const item = await formItem(candidate, { options, args, serverContext })

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
