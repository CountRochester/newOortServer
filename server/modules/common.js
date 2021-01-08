/* eslint-disable no-useless-escape */
import permissions from './authentication/permissions.js'

export { default as pubsub } from './pub-sub.js'

// eslint-disable-next-line max-len
export const buildModel = (modelName, modelFun) => (dBLink, Sequelize) => dBLink.define(modelName, modelFun(Sequelize))

export class ApplicationModule {
  // eslint-disable-next-line class-methods-use-this
  get moduleName () {
    throw new Error('Method not emplemented')
  }

  constructor () {
    this.dbModel = null
    this.dBlink = null
    this.context = {}
    this.publicModuleData = {}

    this.schema = ''
    this.resolvers = {
      Query: {},
      Mutation: {},
      Subscription: {}
    }
  }

  // eslint-disable-next-line class-methods-use-this, require-await
  async init () {
    throw new Error('Method not emplemented')
  }
}

export function reduceArrayByKey (arr, key, toSting) {
  if (toSting) {
    return arr.reduce((acc, item) => [...acc, item[key].toString()], [])
  }
  return arr.reduce((acc, item) => [...acc, item[key]], [])
}

export function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

export function checkPermission (permission, decodedToken) {
  return permission <= decodedToken.permission
}

export function getCallerName (depth = 0) {
  const { stack } = new Error()
  const parcedStack = stack.split('\n')
  const callerName = parcedStack[depth + 2]
    .trim()
    .split(' ')[1]
  return callerName
}

export function defaultErrorHandler (err, logger, callDepth = 1) {
  logger.writeLog(err)
  return {
    type: getCallerName(callDepth),
    messageType: 'error',
    text: `Ошибка: ${err}`
  }
}

export async function permissionGroupCheck (sessionStorage, groupName) {
  const decodedToken = await sessionStorage.getDecodedToken()
  const isOk = checkPermission(permissions[groupName], decodedToken)
  if (!isOk) {
    throw new Error('У вас нет прав для этой операции')
  }
}

export async function isAdminCheck (sessionStorage) {
  await permissionGroupCheck(sessionStorage, 'ADMIN')
}

export async function isClerkCheck (sessionStorage) {
  await permissionGroupCheck(sessionStorage, 'FILE_CLERK')
}

export async function isDepHeadCheck (sessionStorage) {
  await permissionGroupCheck(sessionStorage, 'DEPARTMENT_HEAD')
}

export async function isManagerCheck (sessionStorage) {
  await permissionGroupCheck(sessionStorage, 'SUBDIVISION_MANAGER')
}

export async function isLoggedCheck (sessionStorage) {
  await permissionGroupCheck(sessionStorage, 'EMPLOYEE')
}

export const regular = {
  name: /[\[\]&{}<>#$%^*!@+\/\\`~]+/g,
  password: /['"\[ \]~]+/g,
  contractNumber: /[\[\]&{}<>#$%^*!@+`~]+/g,
}

export function getValidValue (value, regularName) {
  return value.trim().replace(regular[regularName], '')
}

export function formatDate (inputDate) {
  const outputDate = new Date(inputDate)
  if (Number.isNaN(+outputDate)) {
    throw new TypeError('Указана неверная дата')
  }
  return outputDate
}
