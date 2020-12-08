/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const keys = require('../../../keys')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addExtOutFile (root, { extOutFile: { file, ExtOutgoingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtOutFile.findOne({ where: { file: iFile } })
      if (candidate) {
        const message = {
          type: 'addExtOutFile',
          text: 'Такой файл уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newfile = await Docs.ExtOutFile.create({
          file: iFile,
          ExtOutgoingId
        })
        const message = {
          type: 'addExtOutFile',
          text: 'Файл успешно добавлен',
          messageType: 'success',
          id: newfile.id,
          item: JSON.stringify({ extOutFile: { file, ExtOutgoingId } })
        }
        pubsub.publish('EXT_OUT_FILE_CHANGED', {
          extOutFileChanged: {
            type: 'add',
            id: [newfile.id],
            item: [newfile]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addExtOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtOutFile (root, { id, extOutFile: { file, ExtOutgoingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtOutFile.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtOutFile',
          text: 'Файла с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFile === '') {
          const message = {
            type: 'editExtOutFile',
            text: 'Имя файла не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.file = iFile
          candidate.ExtOutgoingId = ExtOutgoingId
        }
        await candidate.save()
        const message = {
          type: 'editExtOutFile',
          text: 'Файл успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ extOutFile: { file, ExtOutgoingId } })
        }
        pubsub.publish('EXT_OUT_FILE_CHANGED', {
          extOutFileChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [candidate]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editExtOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtOutFile (root, { id }) {
    try {
      const candidate = await Docs.ExtOutFile.findByPk(id)
      const message = {
        type: 'deleteExtOutFile',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await fs.unlink(path.join(keys.STATIC_DIR, keys.EXT_OUT_FILE_STORAGE, candidate.file), async (err) => {
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
            pubsub.publish('EXT_OUT_FILE_CHANGED', {
              extOutFileChanged: {
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
        type: 'deleteExtOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtOutFiles (root, { id }) {
    try {
      const badIds = []
      const goodIds = []
      const message = {
        type: 'deleteExtOutFiles',
        text: ``,
        messageType: 'success',
        id: id.join(',')
      }
      for (const file of id) {
        const candidate = await Docs.ExtOutFile.findByPk(file)
        if (candidate) {
          await fs.unlink(path.join(keys.STATIC_DIR, keys.EXT_OUT_FILE_STORAGE, candidate.file), async (err) => {
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
          badIds.push(file)
        }
      }
      id.forEach((el) => {
        if (!badIds.includes(el)) {
          goodIds.push(el)
        }
      })
      if (message.messageType === 'success') {
        pubsub.publish('EXT_OUT_FILE_CHANGED', {
          extOutFileChanged: {
            type: 'delete',
            id
          }
        })
      } else if (goodIds.length) {
        pubsub.publish('EXT_OUT_FILE_CHANGED', {
          extOutFileChanged: {
            type: 'delete',
            id: goodIds
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtOutFiles',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtOutFile () {
    try {
      return await Docs.ExtOutFile.findAll()
    } catch (err) {
      throw err
    }
  },

  async getExtOutFile (root, { id }) {
    try {
      return await Docs.ExtOutFile.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getExtOutFiles (root, { ids }) {
    try {
      return await Docs.ExtOutFile.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async attachFilesToExtOut (root, { fileIds, extOutId }) {
    try {
      const extOut = await Docs.ExtOutgoing.findByPk(extOutId)
      const goodIds = []
      const goodFiles = []
      if (!extOut) {
        const message = {
          type: 'attachFilesToExtOut',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachFilesToExtOut',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        const extOutPrefix = _.trim(_.replace(extOut.outNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        const extOutFiles = []
        if (fileIds.length) {
          for (const file of fileIds) {
            const extOutFile = await Docs.ExtOutFile.findByPk(file)
            if (!extOutFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              extOutFiles.push(extOutFile)
            }
          }
          for (const file of extOutFiles) {
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            let moveOK = true
            await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.EXT_OUT_FILE_STORAGE, `extOutFile-${extOutPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            if (moveOK) {
              file.file = `extOutFile-${extOutPrefix}-${file.id}.${fileExtention}`
              await file.save()
              await file.setExtOutgoing(extOut)
              message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
              goodIds.push(file.id)
              goodFiles.push(file)
            }
          }
          if (goodIds.length) {
            pubsub.publish('EXT_OUT_FILE_CHANGED', {
              extOutFileChanged: {
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
        type: 'attachFilesToExtOut',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
