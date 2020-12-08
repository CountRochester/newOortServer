// const EventEmitter = require('events')
const Op = require('sequelize').Op || {}
const Session = require('express-session')
const moment = require('moment')
const Auth = require('../models/auth')

const MAX_AGE = 4 * 60 * 60 * 1000

const sessionStore = new Session.Store()
sessionStore.expiration = (data) => {
  if (data.cookie && data.cookie.expires) {
    return data.cookie.expires
  }
  return new Date(Date.now() + MAX_AGE)
}
sessionStore.set = async (sid, session, callback) => {
  // This required method is used to upsert a session into the store given a session ID (sid) and session
  // (session) object.The callback should be called as callback(error) once the session has been set in the store.
  console.log('Создание сессии')
  let existedSession
  const userId = session?.cookie.userId
  if (userId) {
    existedSession = await Auth.session.findOne({ where: { [Op.or]: [{ sid }, { UserId: userId }] } })
  } else {
    existedSession = await Auth.session.findOne({ where: { sid } })
  }
  if (existedSession) {
    // const err = new Error('Сессия уже существует')
    // callback(err)
    // return err

    const stringData = JSON.stringify(session)
    const expires = this.expiration(session)
    const defaults = { data: stringData, expires }
    let changed = false
    Object.keys(defaults).forEach((key) => {
      if (key === 'data') {
        return
      }
      if (existedSession.dataValues[key] !== defaults[key]) {
        existedSession[key] = defaults[key]
        changed = true
      }
    })
    if (existedSession.data !== stringData) {
      existedSession.data = JSON.stringify(session)
      changed = true
    }
    if (changed) {
      existedSession.expires = expires
      return await existedSession.save()
    }
  }
  try {
    const ses = await Auth.session.create({
      sid,
      UserId: session?.cookie.userId || null,
      expires: session?.cookie.expires,
      data: JSON.stringify(session)
    })
    console.log(`Сессия успешно создана
    sid: ${sid}
    userId: ${session.cookie.userId}
    expires: ${session.cookie.expires}`)
    return ses
  } catch (err) {
    console.log(`ОШИБКА: создание сессии для sid: ${sid} не удалось: ${err}`)
    callback(err)
    return err
  }
}
sessionStore.destroy = async (sid, callback) => {
  // This required method is used to destroy/delete a session from the store given a session ID (sid).
  // The callback should be called as callback(error) once the session is destroyed.
  const candidate = await Auth.session.findOne({ where: { sid } })
  if (!candidate) {
    const err = new Error(`Сессия для sid ${sid} отсутствует`)
    callback(err)
    return err
  }
  try {
    await candidate.destroy()
  } catch (err) {
    console.log(`ОШИБКА: удаление сессии с sid: ${sid} не удалось: ${err}`)
    callback(err)
    return err
  }
}
sessionStore.get = async (sid, callback) => {
  // This required method is used to get a session from the store given a session ID (sid).
  // The callback should be called as callback(error, session).
  // The session argument should be a session if found, otherwise null or undefined if the session
  // was not found(and there was no error).
  // A special case is made when error.code === 'ENOENT' to act like callback(null, null).
  try {
    const candidate = await Auth.session.findOne({ where: { sid } })
    if (!candidate) {
      console.log(`Сессия для sid ${sid} отсутствует`)
      callback(null, null)
      return null
    }
    const output = JSON.parse(candidate.data)
    console.dir(output)
    callback(null, output)
  } catch (err) {
    console.log(`ОШИБКА: сессии с (sid: ${sid}): ${err}`)
    callback(err)
    return err
  }
}
sessionStore.touch = async (sid, data, fn) => {
  console.log('Обнновление сессии')
  const expires = sessionStore.expiration(data)
  const rows = await Auth.session.update({ expires }, { where: { sid } })
  return rows
}

module.exports = sessionStore
//
//

// const defaultOptions = {
//   checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions.
//   expiration: 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session. Used when cookie.expires is not set.
//   disableTouch: false, // When true, we will not update the db in the touch function call. Useful when you want more control over db writes.
//   modelKey: 'Session',
//   tableName: 'Sessions'
// }
// const defaultModel = Auth.session
// module.exports = function SessionInit (Store) {
//   class SessionStore extends Store {
//     constructor (options) {
//       super(options)
//       this.options = options = options || {}
//       console.log('Коструктор сессии')

//       if (!options.db) {
//         throw new Error('Не удалось подключиться к базе данных')
//       }

//       this.options = Object.assign(defaultOptions, this.options)

//       this.startExpiringSessions()

//       // Check if specific table should be used for DB connection
//       if (options.table) {
//         // Get Specifed Table from Sequelize Object
//         this.sessionModel =
//           options.db[options.table] || options.db.models[options.table]
//       } else {
//         // No Table specified, default to ./model
//         const modelKey = options.modelKey || 'Session'
//         this.sessionModel = options.db.define(modelKey, defaultModel, {
//           tableName: options.tableName || modelKey
//         })
//       }
//     }

//     async sync () {
//       console.log('Синхронизация сессии')
//       return await this.sessionModel.sync()
//     }

//     async get (sid, fn) {
//       console.log('Получение данных из сессии')
//       const session = await this.sessionModel.findOne({ where: { sid } })
//       if (!session) {
//         return null
//       }
//       return JSON.parse(session.data)
//     }

//     async set (sid, data, fn) {
//       console.log('Создание сессии')
//       const stringData = JSON.stringify(data)
//       const expires = this.expiration(data)
//       console.log(stringData)
//       let defaults = { data: stringData, expires }
//       if (this.options.extendDefaultFields) {
//         defaults = this.options.extendDefaultFields(defaults, data)
//       }
//       const session = await this.sessionModel.findCreateFind({
//         where: { sid },
//         defaults,
//         raw: false
//       })
//       // .spread(function sessionCreated (session) {
//       let changed = false
//       Object.keys(defaults).forEach(function (key) {
//         if (key === 'data') {
//           return
//         }
//         if (session.dataValues[key] !== defaults[key]) {
//           session[key] = defaults[key]
//           changed = true
//         }
//       })
//       if (session.data !== stringData) {
//         session.data = JSON.stringify(data)
//         changed = true
//       }
//       if (changed) {
//         session.expires = expires
//         return await session.save()
//       }
//       return session
//     }

//     async touch (sid, data, fn) {
//       console.log('Touch сессии')
//       if (this.options.disableTouch) {
//         return fn()
//       }
//       const expires = this.expiration(data)
//       const rows = await this.sessionModel.update({ expires }, { where: { sid } })
//       return rows
//     }

//     async destroy (sid, fn) {
//       const session = await this.sessionModel.findOne({ where: { sid }, raw: false })
//       // .then(function foundSession (session) {
//       // If the session wasn't found, then consider it destroyed already.
//       if (session === null) {
//         return null
//       }
//       return await session.destroy()
//       // })
//     }

//     async length () {
//       return await this.sessionModel.count()
//     }

//     async clearExpiredSessions () {
//       return await this.sessionModel.destroy({ where: { expires: { [Op.lt || 'lt']: new Date() } } })
//     }

//     startExpiringSessions () {
//       // Don't allow multiple intervals to run at once.
//       this.stopExpiringSessions()
//       if (this.options.checkExpirationInterval > 0) {
//         this._expirationInterval = setInterval(
//           this.clearExpiredSessions.bind(this),
//           this.options.checkExpirationInterval
//         )
//         // allow to terminate the node process even if this interval is still running
//         this._expirationInterval.unref()
//       }
//     }

//     stopExpiringSessions () {
//       if (this._expirationInterval) {
//         clearInterval(this._expirationInterval)
//         // added as a sanity check for testing
//         this._expirationInterval = null
//       }
//     }

//     expiration (data) {
//       if (data.cookie && data.cookie.expires) {
//         return data.cookie.expires
//       }
//       return new Date(Date.now() + this.options.expiration)
//     }
//   }

//   return SessionStore
// }
