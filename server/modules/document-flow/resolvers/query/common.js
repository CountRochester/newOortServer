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
