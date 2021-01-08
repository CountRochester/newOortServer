import path from 'path'
import fsVanilla from 'fs'
import fs from 'fs/promises'
import zlib from 'zlib'

import keys from '../../keys/index.js'
import { isArray } from '../common.js'

const LOG_EXTENTION = '.json'
const ARCHIVE_EXTENTION = '.gz.b64'
const ARCHIVE_FOLDER = 'archive'

// @TODO просмотреть логи за интервал времени (не архивные)
// @TODO разархивировать лог за конкретный день

/*
  .logs
    | - 07-01-2021.json
    | - 08-01-2021.json
    | - archive
        | - 06-01-2021.gz.b64
        | - 05-01-2021.gz.b64
        ...
*/

const formFileStat = (file) => (stat) => ({ file, stat })

function getToken (context) {
  if (!context || !context.req || !context.req.headers) {
    return undefined
  }
  return context.req.headers.token
}

function getTrailingZero (num) {
  if (num < 10) {
    return `0${num}`
  }
  return num.toString()
}

function getFileName (isArchive) {
  const now = new Date()
  const extention = isArchive ? ARCHIVE_EXTENTION : LOG_EXTENTION
  const folder = isArchive ? `${ARCHIVE_FOLDER}/` : ''
  const currentDay = getTrailingZero(now.getDate())
  const currentMonth = getTrailingZero(now.getMonth() + 1)
  const currentYear = now.getFullYear()
  return `${folder}${currentDay}-${currentMonth}-${currentYear}${extention}`
}

function convertFileNameToDate (fileName) {
  const parcedFileName = fileName
    .slice(0, 10)
    .split('-')
  const datePreObj = {
    day: +parcedFileName[0],
    month: +parcedFileName[1] - 1,
    year: +parcedFileName[2]
  }
  return new Date(datePreObj.year, datePreObj.month, datePreObj.day)
}

function getToday () {
  const now = new Date()
  const day = now.getDate()
  const month = now.getMonth()
  const year = now.getFullYear()
  return new Date(year, month, day)
}

async function listFileNames (folderPath) {
  const logFiles = await fs.readdir(folderPath)
  const statsPromises = []
  logFiles.forEach((file) => {
    const filePath = path.join(folderPath, file)
    statsPromises.push(fs.lstat(filePath)
      .then(formFileStat(file)))
  })

  const fileStats = await Promise.all(statsPromises)

  const files = fileStats
    .filter(el => !el.stat.isDirectory())
    .map(el => el.file)

  return files
}

function filterFilesOutOfDate (arr, days) {
  const currentDay = getToday()
  return arr.filter(
    (file) => {
      const delta = currentDay - convertFileNameToDate(file)
      const deltaDays = Math.floor(delta / 1000 / 60 / 60 / 24)
      return deltaDays >= days
    }
  )
}

async function deleteFile (rootFolder, fileName) {
  const filePath = path.join(rootFolder, fileName)
  await fs.unlink(filePath)
}

async function deleteFiles (rootFolder, fileNames) {
  if (isArray(fileNames)) {
    const deletePromises = fileNames
      .map((element) => (deleteFile(rootFolder, element)))
    const results = await Promise.allSettled(deletePromises)
    const fails = results.filter(result => result.status === 'rejected')
    if (fails.length) {
      const reasons = fails.map(el => el.reason)
      throw new Error(`Ошибка удаления файлов: ${reasons}`)
    }
  } else {
    try {
      await deleteFile(rootFolder, fileNames)
    } catch (err) {
      err.message = `Ошибка удаления файла: ${err.message}`
      throw err
    }
  }
}

class Logger {
  constructor () {
    this.logPath = path.resolve(keys.LOG_PATH)
    this.archiveLogPath = path.join(this.logPath, ARCHIVE_FOLDER)
    this.daysToArchive = keys.LOG_ARCHIVE_DAYS
    this.daysToDelete = keys.LOG_ARCHIVE_MAX_DAYS
  }

  async init (context) {
    try {
      this.context = context
      try {
        await fs.access(
          this.archiveLogPath,
          fsVanilla.constants.F_OK |
          fsVanilla.constants.R_OK |
          fsVanilla.constants.W_OK
        )
      } catch (err) {
        console.log('Создание папки', ARCHIVE_FOLDER)
        await fs.mkdir(this.archiveLogPath)
      }
    } catch (err) {
      throw new Error(`Ошибка инициализации модуля логирования ошибок: ${err.stack}`)
    }
  }

  async handleArchiveLogs () {
    try {
      await this.archiveLogs()
      await this.removeOldLogs()
    } catch (err) {
      console.error(err)
    }
  }

  async archiveLogs () {
    const logFiles = await this.getLogFileNames()
    const needToArchive = filterFilesOutOfDate(logFiles, this.daysToArchive)
    const archivePromises = needToArchive.map((file) => (this.archiveLog(file)))
    await Promise.all(archivePromises)
    await this.deleteLog(needToArchive)
  }

  async removeOldLogs () {
    try {
      const fileNames = await this.getArchiveLogFilesNames()
      const needToDelete = filterFilesOutOfDate(fileNames, this.daysToDelete)
      await this.deleteArchiveLog(needToDelete)
    } catch (err) {
      console.error(err)
    }
  }

  async archiveLog (file) {
    const sourceFilePath = path.join(this.logPath, file)
    const sourceContent = await fs.readFile(sourceFilePath)
    const fileExtention = path.extname(file)
    const fileName = path.basename(file, fileExtention)
    const destFileName = fileName + ARCHIVE_EXTENTION
    const destPath = path.join(this.archiveLogPath, destFileName)

    const destFile = await fs.open(destPath, 'wx')

    const errorHandler = (reject) => (err) => {
      reject(new Error(`Ошибка архивации: ${err}`))
    }

    await new Promise((resolve, reject) => {
      zlib.gzip(sourceContent, (err, buffer) => {
        if (err || !buffer) {
          reject(new Error(`Error compressing the log: ${err}`))
        } else {
          fs.writeFile(destFile, buffer.toString('base64'))
            .then(resolve(true))
            .catch(errorHandler(reject))
        }
      })
    })
    await destFile.close()
  }

  async getLogFileNames () {
    const fileNames = await listFileNames(this.logPath)
    return fileNames
  }

  async getArchiveLogFilesNames () {
    const fileNames = await listFileNames(this.archiveLogPath)
    return fileNames
  }

  formLog (err) {
    const now = new Date()
    return {
      pid: process.pid,
      message: err.message,
      stack: err.stack,
      code: err.code,
      token: getToken(this.context),
      date: +now,
      localDate: now.toLocaleDateString(),
      localTime: now.toLocaleTimeString()
    }
  }

  async writeLog (error) {
    try {
      const fileName = getFileName()
      const filePath = path.join(this.logPath, fileName)
      const logfile = await fs.open(filePath, 'a')
      const log = this.formLog(error)
      const newLogContent = `${JSON.stringify(log)}\n`
      await fs.writeFile(logfile, newLogContent)
      await logfile.close()
    } catch (err) {
      console.error(err)
    }
  }

  async deleteLog (file) {
    try {
      await deleteFiles(this.logPath, file)
    } catch (err) {
      console.error(err)
    }
  }

  async deleteArchiveLog (file) {
    try {
      await deleteFiles(this.archiveLogPath, file)
    } catch (err) {
      console.error(err)
    }
  }
}

const logger = new Logger()
// const context = {
//   req: {
//     headers: {
// eslint-disable-next-line max-len
//       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI4OGRiMzA4MS1mMGM2LTQ3MTgtOGE1ZS1jYjg4ZjAzMGZiMjQiLCJuYW1lIjoiR3VzZXZBbmRyZXkiLCJ1c2VySWQiOjIsInBlcm1pc3Npb24iOjMxLCJlbXBsb3llZUlkIjoyLCJpYXQiOjE2MDk4NzU3NjMsImV4cCI6MTYyNDI3NTc2M30._Z6Gwnt9T674Xwe5Bfef1k2CSVan0I7J2mPr_2-W5cA'
//     }
//   }
// }
// logger.init(context)

// const test1 = new Error('This is the test error1')
// const test2 = new Error('This is the test error2')

// logger.writeLog(test1)
//   .then(() => {
//     logger.writeLog(test2)
//   })

export default logger
