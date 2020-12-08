/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const keys = require('../../../keys')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addExtIncFile (root, { extIncFile: { file, ExtIncomingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtIncFile.findOne({ where: { file: iFile } })
      if (candidate) {
        const message = {
          type: 'addExtIncFile',
          text: 'Такой файл уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newfile = await Docs.ExtIncFile.create({
          file: iFile,
          ExtIncomingId
        })
        const message = {
          type: 'addExtIncFile',
          text: 'Файл успешно добавлен',
          messageType: 'success',
          id: newfile.id,
          item: JSON.stringify({ extIncFile: { file, ExtIncomingId } })
        }
        pubsub.publish('EXT_INC_FILE_CHANGED', {
          extIncFileChanged: {
            type: 'add',
            id: [newfile.id],
            item: [newfile]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addExtIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtIncFile (root, { id, extIncFile: { file, ExtIncomingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.ExtIncFile.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtIncFile',
          text: 'Файла с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFile === '') {
          const message = {
            type: 'editExtIncFile',
            text: 'Имя файла не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.file = iFile
          candidate.ExtIncomingId = ExtIncomingId
        }
        await candidate.save()
        const message = {
          type: 'editExtIncFile',
          text: 'Файл успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ extIncFile: { file, ExtIncomingId } })
        }
        pubsub.publish('EXT_INC_FILE_CHANGED', {
          extIncFileChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [candidate]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editExtIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtIncFile (root, { id }) {
    try {
      const candidate = await Docs.ExtIncFile.findByPk(id)
      const message = {
        type: 'deleteExtIncFile',
        text: '',
        messageType: 'success',
        id
      }
      if (candidate) {
        await fs.unlink(path.join(keys.STATIC_DIR, keys.EXT_INC_FILE_STORAGE, candidate.file), async (err) => {
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
          }
        })
      } else {
        message.text += `Файл c id = ${id} в базе отсутствует`
        message.messageType = 'error'
      }
      if (message.messageType === 'success') {
        pubsub.publish('EXT_INC_FILE_CHANGED', {
          extIncFileChanged: {
            type: 'delete',
            id: [id]
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtIncFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtIncFiles (root, { id }) {
    try {
      const message = {
        type: 'deleteExtIncFiles',
        text: '',
        messageType: 'success',
        id: id.join(',')
      }
      const badIds = []
      const goodIds = []
      for (const file of id) {
        const candidate = await Docs.ExtIncFile.findByPk(file)
        if (candidate) {
          await fs.unlink(path.join(keys.STATIC_DIR, keys.EXT_INC_FILE_STORAGE, candidate.file), async (err) => {
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
        pubsub.publish('EXT_INC_FILE_CHANGED', {
          extIncFileChanged: {
            type: 'delete',
            id
          }
        })
      } else if (goodIds.length) {
        pubsub.publish('EXT_INC_FILE_CHANGED', {
          extIncFileChanged: {
            type: 'delete',
            id: goodIds
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtIncFiles',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtIncFile () {
    try {
      return await Docs.ExtIncFile.findAll()
    } catch (err) {
      throw err
    }
  },

  async getExtIncFile (root, { id }) {
    try {
      console.time('getExtIncFile')
      const output = await Docs.ExtIncFile.findByPk(id)
      console.timeEnd('getExtIncFile')
      return output
    } catch (err) {
      throw err
    }
  },

  async getExtIncFiles (root, { ids }) {
    try {
      console.time('getExtIncFiles')
      const output = await Docs.ExtIncFile.findAll({ where: { id: { [Op.in]: ids } } })
      console.timeEnd('getExtIncFiles')
      return output
    } catch (err) {
      throw err
    }
  },

  async attachFilesToExtInc (root, { fileIds, extIncId }) {
    try {
      const extInc = await Docs.ExtIncoming.findByPk(extIncId)
      const goodIds = []
      const goodFiles = []
      if (!extInc) {
        const message = {
          type: 'attachFilesToExtInc',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachFilesToExtInc',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        const extIncPrefix = _.trim(_.replace(extInc.extNumber, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '-'))
        const extIncFiles = []
        if (fileIds.length) {
          for (const file of fileIds) {
            const extIncFile = await Docs.ExtIncFile.findByPk(file)
            if (!extIncFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              extIncFiles.push(extIncFile)
            }
          }
          for (const file of extIncFiles) {
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            let moveOK = true
            await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.EXT_INC_FILE_STORAGE, `extIncFile-${extIncPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            if (moveOK) {
              file.file = `extIncFile-${extIncPrefix}-${file.id}.${fileExtention}`
              await file.save()
              await file.setExtIncoming(extInc)
              message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
              goodIds.push(file.id)
              goodFiles.push(file)
            }
          }
          if (goodIds.length) {
            pubsub.publish('EXT_INC_FILE_CHANGED', {
              extIncFileChanged: {
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
        type: 'attachFilesToExtInc',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }

}
