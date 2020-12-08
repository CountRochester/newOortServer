/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const keys = require('../../../keys')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIntIncFile (root, { intIncFile: { file, IntIncomingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.IntIncFile.findOne({ where: { file: iFile } })
      if (candidate) {
        const message = {
          type: 'addIntIncFile',
          text: 'Такой файл уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newfile = await Docs.IntIncFile.create({
          file: iFile,
          IntIncomingId
        })
        const message = {
          type: 'addIntIncFile',
          text: 'Файл успешно добавлен',
          messageType: 'success',
          id: newfile.id,
          item: JSON.stringify({ intIncFile: { file, IntIncomingId } })
        }
        pubsub.publish('INT_INC_FILE_CHANGED', {
          intIncFileChanged: {
            type: 'add',
            id: [newfile.id],
            item: [newfile]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addIntIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntIncFile (root, { id, intIncFile: { file, IntIncomingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.IntIncFile.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editIntIncFile',
          text: 'Файла с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFile === '') {
          const message = {
            type: 'editIntIncFile',
            text: 'Имя файла не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.file = iFile
          candidate.IntIncomingId = IntIncomingId
        }
        await candidate.save()
        const message = {
          type: 'editIntIncFile',
          text: 'Файл успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ intIncFile: { file, IntIncomingId } })
        }
        pubsub.publish('INT_INC_FILE_CHANGED', {
          intIncFileChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [candidate]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editIntIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntIncFile (root, { id }) {
    try {
      const candidate = await Docs.IntIncFile.findByPk(id)
      const message = {
        type: 'deleteIntIncFile',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await fs.unlink(path.join(keys.STATIC_DIR, keys.INT_INC_FILE_STORAGE, candidate.file), async (err) => {
          if (err) {
            await fs.unlink(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, candidate.file), (err) => {
              if (err) {
                message.text += `Файл c id = ${id}, ошибка: ${err}\n\r`
                message.messageType = 'error'
              }
            })
          } else {
            await candidate.destroy()
            message.text = `Файл c id = ${id} успешно удалён`
            pubsub.publish('INT_INC_FILE_CHANGED', {
              intIncFileChanged: {
                type: 'delete',
                id: [id]
              }
            })
          }
        })
      } else {
        message.text += `Файл c id = ${id} в базе отсутствует`
        message.messageType = 'error'
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntIncFiles (root, { id }) {
    try {
      const message = {
        type: 'deleteIntIncFiles',
        text: ``,
        messageType: 'success',
        id: id.join(',')
      }
      const badIds = []
      const goodIds = []
      for (const file of id) {
        const candidate = await Docs.IntIncFile.findByPk(file)
        if (candidate) {
          await fs.unlink(path.join(keys.STATIC_DIR, keys.INT_INC_FILE_STORAGE, candidate.file), async (err) => {
            if (err) {
              await fs.unlink(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, candidate.file), (err) => {
                if (err) {
                  message.text += `Файл c id = ${file}, ошибка: ${err}\n\r`
                  message.messageType = 'error'
                }
              })
            } else {
              await candidate.destroy()
              message.text += `Файл c id = ${file} успешно удалён\n\r`
            }
          })
        } else {
          message.text += `Файл c id = ${file} в базе отсутствует\n\r`
          message.messageType = 'error'
        }
      }
      id.forEach((el) => {
        if (!badIds.includes(el)) {
          goodIds.push(el)
        }
      })
      if (message.messageType === 'success') {
        pubsub.publish('INT_INC_FILE_CHANGED', {
          intIncFileChanged: {
            type: 'delete',
            id
          }
        })
      } else if (goodIds.length) {
        pubsub.publish('INT_INC_FILE_CHANGED', {
          intIncFileChanged: {
            type: 'delete',
            id: goodIds
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntIncFiles',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIntIncFile () {
    try {
      return await Docs.IntIncFile.findAll()
    } catch (err) {
      throw err
    }
  },

  async getIntIncFile (root, { id }) {
    try {
      return await Docs.IntIncFile.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntIncFiles (root, { ids }) {
    try {
      return await Docs.IntIncFile.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async attachFilesToIntInc (root, { fileIds, intIncId }) {
    try {
      const intInc = await Docs.IntIncoming.findByPk(intIncId)
      const goodIds = []
      const goodFiles = []
      if (!intInc) {
        const message = {
          type: 'attachFilesToIntInc',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachFilesToIntInc',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        const intIncPrefix = _.trim(_.replace(intInc.extNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        const intIncFiles = []
        if (fileIds.length) {
          for (const file of fileIds) {
            const intIncFile = await Docs.IntIncFile.findByPk(file)
            if (!intIncFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              intIncFiles.push(intIncFile)
            }
          }
          for (const file of intIncFiles) {
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            let moveOK = true
            await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.INT_INC_FILE_STORAGE, `intIncFile-${intIncPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            if (moveOK) {
              file.file = `intIncFile-${intIncPrefix}-${file.id}.${fileExtention}`
              await file.save()
              await file.setIntIncoming(intInc)
              message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
              goodIds.push(file.id)
              goodFiles.push(file)
            }
          }
          if (goodIds.length) {
            pubsub.publish('INT_INC_FILE_CHANGED', {
              intIncFileChanged: {
                type: 'attach',
                id: goodIds,
                item: goodFiles
              }
            })
          }
        } else {
          message.text = 'Файлы не указаны'
          message.messageType = 'error'
          return message
        }
        if (message.messageType === 'success') {
          message.text = 'Все прикрепления успешно завершены'
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'attachFilesToIntInc',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },
  // Функция копирования и перепрекрепления файлов от внутреннего исходящего документа
  // к внутреннему входящему документу
  async attachIntOutFilesToIntInc (root, { fileIds, intIncId }) {
    try {
      // получение внутреннего входящего документа
      const intInc = await Docs.IntIncoming.findByPk(intIncId)
      const goodIds = []
      const goodFiles = []
      // Проверка на наличие ошибок
      // Проверка наличия документов
      if (!intInc) {
        const message = {
          type: 'attachIntOutFilesToIntInc',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachIntOutFilesToIntInc',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        // Создание префикса файлов внутреннего входящего документа
        // const intIncPrefix = _.trim(_.replace(intInc.extNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        const intIncPrefix = _.trim(_.replace(intInc.extNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        // Массив файлов внутреннего исходящего документа
        const IntOutFiles = []
        // Проверка на существование файлов и формирование массива
        // файлов внутреннего исходящего документа
        if (fileIds.length) {
          for (const file of fileIds) {
            const IntOutFile = await Docs.IntOutFile.findByPk(file)
            if (!IntOutFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              IntOutFiles.push(IntOutFile)
            }
          }
          // перепрекрепление файлов из массива файлов внутреннего исходящего документа
          // к внутреннему водящему документу
          for (const file of IntOutFiles) {
            // Определение имени и расширения файла
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            // значение переменной ошибок перемещения по умолчанию
            let moveOK = true
            // копирование файла внутреннего исходящего документа в папку с файлами внутренних входящих документов
            await fs.copyFile(path.join(keys.STATIC_DIR, keys.INT_OUT_FILE_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.INT_INC_FILE_STORAGE, `intIncFile-${intIncPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            // Если копирование успешно, то создаётся новая запись в БД с файлом внутреннего входящего документа
            if (moveOK) {
              // Формирование запроса
              const req = {
                intIncFile:
                {
                  file: `intIncFile-${intIncPrefix}-${file.id}.${fileExtention}`,
                  IntIncomingId: intIncId
                }
              }
              // создание файла внутреннего входящего документа
              const fileMes = await this.addIntIncFile(null, req)
              const newFile = await Docs.IntIncFile.findByPk(fileMes.id)
              if (fileMes.messageType === 'error') {
                message.text += fileMes.text
              } else {
                message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
                goodIds.push(newFile.id)
                goodFiles.push(newFile)
              }
            }
            if (goodIds.length) {
              pubsub.publish('INT_INC_FILE_CHANGED', {
                intIncFileChanged: {
                  type: 'newAttach',
                  id: goodIds,
                  item: goodFiles
                }
              })
            }
          }
        } else {
          message.text = 'Файлы не указаны'
          message.messageType = 'error'
          return message
        }
        if (message.messageType === 'success') {
          message.text = 'Все прикрепления успешно завершены'
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'attachIntOutFilesToIntInc',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
