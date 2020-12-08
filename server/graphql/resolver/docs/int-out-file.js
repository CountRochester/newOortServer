/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { Op } = require('sequelize')
const Docs = require('../../../models/docs')
const keys = require('../../../keys')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addIntOutFile (root, { intOutFile: { file, IntOutgoingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.IntOutFile.findOne({ where: { file: iFile } })
      if (candidate) {
        const message = {
          type: 'addIntOutFile',
          text: 'Такой файл уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newfile = await Docs.IntOutFile.create({
          file: iFile,
          IntOutgoingId
        })
        const message = {
          type: 'addIntOutFile',
          text: 'Файл успешно добавлен',
          messageType: 'success',
          id: newfile.id,
          item: JSON.stringify({ intOutFile: { file, IntOutgoingId } })
        }
        pubsub.publish('INT_OUT_FILE_CHANGED', {
          intOutFileChanged: {
            type: 'add',
            id: [newfile.id],
            item: [newfile]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addIntOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntOutFile (root, { id, intOutFile: { file, IntOutgoingId } }) {
    try {
      const iFile = _.trim(_.replace(file, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.IntOutFile.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editIntOutFile',
          text: 'Файла с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iFile === '') {
          const message = {
            type: 'editIntOutFile',
            text: 'Имя файла не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.file = iFile
          candidate.IntOutgoingId = IntOutgoingId
        }
        await candidate.save()
        const message = {
          type: 'editIntOutFile',
          text: 'Файл успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ intOutFile: { file, IntOutgoingId } })
        }
        pubsub.publish('INT_OUT_FILE_CHANGED', {
          intOutFileChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [candidate]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editIntOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntOutFile (root, { id }) {
    try {
      const candidate = await Docs.IntOutFile.findByPk(id)
      const message = {
        type: 'deleteIntOutFile',
        text: ``,
        messageType: 'success',
        id
      }
      if (candidate) {
        await fs.unlink(path.join(keys.STATIC_DIR, keys.INT_OUT_FILE_STORAGE, candidate.file), async (err) => {
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
            pubsub.publish('INT_OUT_FILE_CHANGED', {
              intOutFileChanged: {
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
        type: 'deleteIntOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteIntOutFiles (root, { id }) {
    try {
      const message = {
        type: 'deleteIntOutFile',
        text: ``,
        messageType: 'success',
        id: id.join(',')
      }
      const badIds = []
      const goodIds = []
      for (const file of id) {
        const candidate = await Docs.IntOutFile.findByPk(file)
        if (candidate) {
          await fs.unlink(path.join(keys.STATIC_DIR, keys.INT_OUT_FILE_STORAGE, candidate.file), async (err) => {
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
        pubsub.publish('INT_OUT_FILE_CHANGED', {
          intOutFileChanged: {
            type: 'delete',
            id
          }
        })
      } else if (goodIds.length) {
        pubsub.publish('INT_OUT_FILE_CHANGED', {
          intOutFileChanged: {
            type: 'delete',
            id: goodIds
          }
        })
      }
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntOutFile',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIntOutFile () {
    try {
      return await Docs.IntOutFile.findAll()
    } catch (err) {
      throw err
    }
  },

  async getIntOutFile (root, { id }) {
    try {
      return await Docs.IntOutFile.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntOutFiles (root, { ids }) {
    try {
      return await Docs.IntOutFile.findAll({ where: { id: { [Op.in]: ids } } })
    } catch (err) {
      throw err
    }
  },

  async attachFilesToIntOut (root, { fileIds, intOutId }) {
    try {
      const intOut = await Docs.IntOutgoing.findByPk(intOutId)
      const goodIds = []
      const goodFiles = []
      if (!intOut) {
        const message = {
          type: 'attachFilesToIntOut',
          text: 'Документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        const message = {
          type: 'attachFilesToIntOut',
          text: '',
          messageType: 'success',
          id: fileIds.join(',')
        }
        const author = await Docs.CurrentPosition.findByPk(intOut.authorId) || null
        const dep = author
          ? await Docs.Department.findByPk(author.DepartmentId) || null
          : null
        let intOutPrefix = dep ? dep.depPrefix + '-' + intOut.outNumber : '-' + intOut.outNumber
        intOutPrefix = _.replace(intOutPrefix, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, '')
        const intOutFiles = []
        if (fileIds.length) {
          for (const file of fileIds) {
            const intOutFile = await Docs.IntOutFile.findByPk(file)
            if (!intOutFile) {
              message.text += `Файла с id = ${file} не существует \n\r`
              message.messageType = 'error'
            } else {
              intOutFiles.push(intOutFile)
            }
          }
          for (const file of intOutFiles) {
            const filename = file.file.split('.')
            let fileExtention
            if (filename.length > 1) {
              fileExtention = filename[filename.length - 1]
            } else {
              fileExtention = ''
            }
            let moveOK = true
            await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, file.file),
              path.join(keys.STATIC_DIR, keys.INT_OUT_FILE_STORAGE, `intOutFile-${intOutPrefix}-${file.id}.${fileExtention}`),
              (err) => {
                if (err) {
                  message.text += `Ошибка при прикреплении файла с id = ${file.id}: ${err}`
                  message.messageType = 'error'
                  moveOK = false
                }
              })
            if (moveOK) {
              file.file = `intOutFile-${intOutPrefix}-${file.id}.${fileExtention}`
              await file.save()
              await file.setIntOutgoing(intOut)
              message.text += `Прикрепление файла с id = ${file.id} успешно \n\r`
              goodIds.push(file.id)
              goodFiles.push(file)
            }
          }
          if (goodIds.length) {
            pubsub.publish('INT_OUT_FILE_CHANGED', {
              intOutFileChanged: {
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
        type: 'attachFilesToIntOut',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  }
}
