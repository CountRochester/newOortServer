import {
  isLoggedCheck, isAdminCheck, isClerkCheck,
  isDepHeadCheck, isManagerCheck, fieldRenamer
} from '../../../common.js'

/*
  options: {
    check: String,
    entity: String,
    fieldRenamer: [
      {
        oldName: String,
        newName: String
      }
    ]
  }
*/

const checks = {
  isLoggedCheck,
  isAdminCheck,
  isClerkCheck,
  isDepHeadCheck,
  isManagerCheck
}
const checkNames = ['isLoggedCheck', 'isAdminCheck', 'isClerkCheck',
  'isDepHeadCheck', 'isManagerCheck']

export async function getAllEntitys (options, args, {
  authentication: { sessionStorage },
  documentFlow: { model },
  core: { logger },
  consola
}) {
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    const entitys = await model[options.entity].findAll({ raw: true })
    if (!options.fieldRenamer) {
      return entitys
    }
    return fieldRenamer(entitys, options.fieldRenamer)
  } catch (err) {
    logger.writeLog(err)
    consola.error(err)
    throw err
  }
}

export async function getEntity (options, { id }, {
  authentication: { sessionStorage },
  documentFlow: { model },
  core: { logger },
  consola
}) {
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    const entity = await model[options.entity].findByPk(id, { raw: true })
    if (!options.fieldRenamer) {
      return entity
    }
    return fieldRenamer([entity], options.fieldRenamer)[0]
  } catch (err) {
    logger.writeLog(err)
    consola.error(err)
    throw err
  }
}

async function formResult (entity, { options, args, serverContext }) {
  let result
  if (!options.fieldRenamer) {
    result = entity
  } else if (options.multiple) {
    result = fieldRenamer(entity, options.fieldRenamer)
  } else {
    // eslint-disable-next-line prefer-destructuring
    result = fieldRenamer([entity], options.fieldRenamer)[0]
  }

  if (options.afterRequest) {
    result = await options.afterRequest(result, args, serverContext)
  }
  return result
}

export async function getEntityByRequest (options, args, serverContext) {
  /*
    options: {
      check: String,
      entity: String,
      request: Object | Function(beforeRequestResult),
      multiple: Boolean,
      beforeRequest: Function(args, serverContext),
      afterRequest: Function(result, args, serverContext),
      fieldRenamer: [
        {
          oldName: String,
          newName: String
        }
      ]
    }
  */
  const {
    authentication: { sessionStorage },
    documentFlow: { model },
    core: { logger },
    consola
  } = serverContext
  try {
    if (options.check && checkNames.includes(options.check)) {
      await checks[options.check](sessionStorage)
    }
    let beforeRequestResult
    if (options.beforeRequest) {
      beforeRequestResult = await options.beforeRequest(args, serverContext)
    }
    const funName = options.multiple
      ? 'findAll'
      : 'findOne'
    const request = Object.prototype.toString
      .call(options.request) === '[object Function]'
      ? options.request(beforeRequestResult)
      : options.request
    // request.raw = true
    const entity = await model[options.entity][funName](request)
    const resultOptions = { options, args, serverContext }
    return await formResult(entity, resultOptions)
  } catch (err) {
    logger.writeLog(err)
    consola.error(err)
    throw err
  }
}
