import keys from '../../keys/index.js'
import { reduceArrayByKey } from '../common.js'

const SESSION_DURATION = convertDuration(keys.JWT_EXPIRES_IN)
const ERROR_NO_AUTH = () => new Error('Пользователь не авторизован')
const ERROR_USER_NOT_FOUND =
  () => new Error('Пользователь с таким именем или паролем не найден')
const ERROR_SESSION_EXPIRED = () => new Error('Сессия устарела')

function convertDuration (str) {
  const parsedStr = str.split('')
  const units = parsedStr[parsedStr.length - 1]
  if (!Number.isNaN(+units)) {
    return +str
  }
  const unitCoefficient = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }
  const duration = +parsedStr.slice(0, parsedStr.length - 1).join('')
  return unitCoefficient[units] * duration
}

function getNewExpirationDate () {
  return new Date(Date.now() + SESSION_DURATION)
}

async function getUserPermission (user) {
  const groups = await user.getGroups()
  const permissions = reduceArrayByKey(groups, 'permissions')
  return Math.max.apply(null, permissions)
}

export class SessionStorage {
  constructor (context, model) {
    this.context = context
    this.sessionDB = model.Session
    this.userDB = model.User
    this.groupDB = model.Group
  }

  formToken (payload) {
    const { jwt } = this.context
    const options = { expiresIn: SESSION_DURATION }
    return new Promise((resolve, reject) => {
      jwt.sign(payload, keys.JWT, options, (err, token) => {
        if (err) { reject(err) }
        resolve(token)
      })
    })
  }

  decodeAndVerifyToken (token) {
    const { jwt } = this.context
    return new Promise((resolve, reject) => {
      jwt.verify(token, keys.JWT, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            this.deleteSession()
              .then(reject(ERROR_SESSION_EXPIRED()))
          } else {
            reject(err)
          }
        }
        resolve(decoded)
      })
    })
  }

  async getNewTokenAndStoreSession (user, data = {}) {
    try {
      const { uuidv4 } = this.context
      const { id, employeeId, name } = user
      const sid = uuidv4()
      const permission = await getUserPermission(user)
      const payload = {
        sid,
        name,
        userId: id,
        permission,
        employeeId
      }
      const token = await this.formToken(payload)
      const stringData = JSON.stringify({ ...data, token, permission })

      const session = {
        sid,
        expires: getNewExpirationDate(),
        employeeId,
        data: stringData
      }
      const newSession = await this.sessionDB.create(session)
      await newSession.setUser(user)
      return token
    } catch (err) {
      throw new Error(`Ошибка создания сессии: ${err.message}`)
    }
  }

  getToken () {
    const { token } = this.context.req.headers
    if (!token) {
      throw ERROR_NO_AUTH()
    }
    return token
  }

  async createNewSession (name, password) {
    const candidate = await this.userDB.findOne({ where: { name } })
    if (!candidate) {
      throw ERROR_USER_NOT_FOUND()
    }
    const isPasswordCorrect = await this.context.bcrypt
      .compare(password, candidate.password)
    if (!isPasswordCorrect) {
      throw ERROR_USER_NOT_FOUND()
    }
    const existedSession = await candidate.getSession()
    if (existedSession) {
      const storedToken = JSON.parse(existedSession.data).token
      return { token: storedToken, userId: candidate.id }
    }

    const token = await this.getNewTokenAndStoreSession(candidate)
    return { token, userId: candidate.id }
  }

  async getSession () {
    const { session } = await this.getDecodedToken(true)
    return session
  }

  async getDecodedToken (sessionNeeded) {
    const token = this.getToken()
    const decoded = await this.decodeAndVerifyToken(token)
    const session = await this.sessionDB.findByPk(decoded.sid)
    if (!session) {
      throw ERROR_SESSION_EXPIRED()
    }
    if (sessionNeeded) {
      return { decodedToken: decoded, session }
    }
    return decoded
  }

  async deleteSession () {
    const session = await this.getSession()
    const { UserId } = session
    await session.destroy()
    return UserId
  }

  async updateSessionToken () {
    const { decodedToken, session } = await this.getDecodedToken(true)
    delete decodedToken.exp
    delete decodedToken.iat
    const token = await this.formToken(decodedToken)
    session.expires = getNewExpirationDate()
    await session.save()
    return token
  }
}

export default SessionStorage
