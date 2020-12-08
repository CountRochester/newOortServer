/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const keys = require('../../../keys')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addInternalFile (root, { internalFile: { file, InternalId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.InternalFile.findOne({ where: { file: iFile } })
      if (candidate) {
        const message = {
          type: 'addInternalFile',
          text: 'Такой файл уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.InternalFile.create({
          file: iFile,
          InternalId
        })
        const message = {
          type: 'addInternalFile',
          text: 'Файл успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ internalFile: { file, InternalId } })
        }
        pubsub.publish('INTERNAL_FILE_CHANGED', {
          internalFileChanged: {
            type: 'add',
            id: [newItem.id],
            item: [newItem]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addInternalFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editInternalFile (root, { id, internalFile: { file, InternalId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.InternalFile.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editInternalFile',
          text: 'Файла с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFile === '') {
          const message = {
            type: 'editInternalFile',
            text: 'Имя файла не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.file = iFile
          candidate.InternalId = InternalId
        }
        await candidate.save()
        const message = {
          type: 'editInternalFile',
          text: 'Файл успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ internalFile: { file, InternalId } })
        }
        pubsub.publish('INTERNAL_FILE_CHANGED', {
          internalFileChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [candidate]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editInternalFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteInternalFile (root, { id }) {
    try {
      const candidate = await Docs.InternalFile.findByPk(id)
      const message = {
        type: 'deleteInternalFile',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await fs.unlink(path.join(keys.STATIC_DIR, keys.INTERNAL_FILE_STORAGE, candidate.file), async (err) => {
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
            pubsub.publish('INTERNAL_FILE_CHANGED', {
              internalFileChanged: {
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
        type: 'deleteInternalFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteInternalFiles (root, { id }) {
    try {
      const message = {
        type: 'deleteInternalFiles',
        text: ``,
        messageType: 'success',
        id: id.join(',')
      }
      const goodIds = []
      for (const file of id) {
        const candidate = await Docs.InternalFile.findByPk(file)
        if (candidate) {
          await fs.unlink(path.join(keys.STATIC_DIR, keys.INTERNAL_FILE_STORAGE, candidate.file), async (err) => {
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
              goodIds.push(file)
            }
          })
        } else {
          message.text += `Файл c id = ${file} в базе отсутствует\n\r`
          message.messageType = 'error'
        }
      }
      if (goodIds.length) {
        pubsub.publish('INTERNAL_FILE_CHANGED', {
          internalFileChanged: {
            type: 'delete',
            id: goodIds
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteInternalFiles',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllInternalFile () {
    try {
      return await Docs.InternalFile.findAll()
    } catch (err) {
      throw err
    }
  },

  async getInternalFile (root, { id }) {
    try {
      return await Docs.InternalFile.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getInternalFiles (root, { ids }) {
    try {
      return await Docs.InternalFile.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async attachFilesToInternal (root, { fileIds, internalId }) {
    try {
      const internal = await Docs.Internal.findByPk(internalId)
      const goodIds = []
      const goodFiles = []
      if (!internal) {
        const message = {
          type: 'attachFilesToInternal',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachFilesToInternal',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        const internalPrefix = _.trim(_.replace(internal.docNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        const internalFiles = []
        if (fileIds.length) {
          for (const file of fileIds) {
            const internalFile = await Docs.InternalFile.findByPk(file)
            if (!internalFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              internalFiles.push(internalFile)
            }
          }
          for (const file of internalFiles) {
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            let moveOK = true
            await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.INTERNAL_FILE_STORAGE, `internalFile-${internalPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            if (moveOK) {
              file.file = `internalFile-${internalPrefix}-${file.id}.${fileExtention}`
              await file.save()
              await file.setInternal(internal)
              message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
              goodIds.push(file.id)
              goodFiles.push(file)
            }
          }
          if (goodIds.length) {
            pubsub.publish('INTERNAL_FILE_CHANGED', {
              internalFileChanged: {
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
        type: 'attachFilesToInternal',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
