/* eslint-disable no-useless-escape */
const _ = require('lodash')
// const { PubSub } = require('graphql-subscriptions')
const Docs = require('../../../models/docs')
// const subscriptionKeys = require('../subscription-keys')
const pubsub = require('../../pubsub').getInstance()

// const pubsub = new PubSub()

module.exports = {
  async addContract (root, { contract: { number, date } }) {
    try {
      const contractNumber = _.trim(_.replace(number, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\`\~]+/g, ''))
      const candidate = await Docs.Contract.findOne({ where: { number: contractNumber } })
      if (candidate) {
        const message = {
          type: 'addContract',
          text: 'Такой контракт уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.Contract.create({
          number: contractNumber,
          date
        })
        const message = {
          type: 'addContract',
          text: 'Контракт успешно добавлен',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ contract: { number, date } })
        }
        pubsub.publish('CONTRACT_CHANGED', {
          contractChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addContract',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editContract (root, { id, contract: { number, date } }) {
    try {
      const contractNumber = _.trim(_.replace(number, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\`\~]+/g, ''))
      const candidate = await Docs.Contract.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editContract',
          text: 'Контракт с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (contractNumber === '') {
          const message = {
            type: 'editContract',
            text: 'Номер контракта не должен быть пустым',
            messageType: 'error'
          }
          return message
        } else if (date === '') {
          candidate.number = contractNumber
        } else {
          candidate.number = contractNumber
          candidate.date = date
        }
        await candidate.save()
        const message = {
          type: 'editContract',
          text: 'Контракт успешно изменён',
          messageType: 'success',
          id,
          item: JSON.stringify({ contract: { number, date } })
        }
        pubsub.publish('CONTRACT_CHANGED', {
          contractChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editContract',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteContract (root, { id }) {
    try {
      const candidate = await Docs.Contract.findByPk(id)
      const temas = await candidate.getTemas()
      for (const tema of temas) {
        await tema.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteContract',
        text: `Контракт успешно удалён`,
        messageType: 'success',
        id
      }
      pubsub.publish('CONTRACT_CHANGED', {
        contractChanged: {
          type: 'delete',
          id: candidate.id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteContract',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllContract () {
    try {
      return await Docs.Contract.findAll()
    } catch (err) {
      throw err
    }
  },
  async getContract (root, { id }) {
    try {
      return await Docs.Contract.findByPk(id)
    } catch (err) {
      throw err
    }
  }
}
