/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

module.exports = {
  async addTema (root, { tema: { name, ContractId } }) {
    try {
      const iName = _.trim(_.replace(name, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\/\\`\~]+/g, ''))
      const candidate = await Docs.Tema.findOne({ where: { name: iName } })
      if (candidate) {
        const message = {
          type: 'addTema',
          text: 'Такая тема уже существует',
          messageType: 'error'
        }
        return message
      } else {
        const newItem = await Docs.Tema.create({
          name: iName,
          ContractId
        })
        const message = {
          type: 'addTema',
          text: 'Новая тема успешно добавлена',
          messageType: 'success',
          id: newItem.id,
          item: JSON.stringify({ tema: { name, ContractId } })
        }
        pubsub.publish('TEMA_CHANGED', {
          temaChanged: {
            type: 'add',
            id: newItem.id,
            item: newItem
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'addTema',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editTema (root, { id, tema: { name, ContractId } }) {
    try {
      const iName = _.trim(_.replace(name, /[\[\]&\{\}\<\>#\$%\^\*\!\@+\/\\`\~]+/g, ''))
      const candidate = await Docs.Tema.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editTema',
          text: 'Темы с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iName === '') {
          const message = {
            type: 'editTema',
            text: 'Название темы не должно быть пустым',
            messageType: 'error'
          }
          return message
        } else {
          candidate.name = iName
        }
        await candidate.save()
        await candidate.setContract(ContractId)
        const message = {
          type: 'editTema',
          text: 'Данные темы успешно изменены',
          messageType: 'success',
          id,
          item: JSON.stringify({ tema: { name, ContractId } })
        }
        pubsub.publish('TEMA_CHANGED', {
          temaChanged: {
            type: 'edit',
            id: candidate.id,
            item: candidate
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editTema',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteTema (root, { id }) {
    try {
      const candidate = await Docs.Tema.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteTema',
        text: `Тема успешно удалена`,
        messageType: 'success',
        id
      }
      pubsub.publish('TEMA_CHANGED', {
        temaChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteTema',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllTema () {
    try {
      // return await Docs.Tema.findAll()
      const output = await Docs.Tema.findAll()
      // console.log(output)
      // const out = []
      // output.forEach((el) => {
      //   out.push(el.dataValues)
      // })
      // console.log(out)
      return output
    } catch (err) {
      throw err
    }
  },

  async getTema (root, { id }) {
    try {
      return await Docs.Tema.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getTemaContract (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getContract()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingsByTema (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getExtIncomings()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingByTema (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getExtOutgoings()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingByTema (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getIntOutgoings()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingByTema (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getIntIncomings()
    } catch (err) {
      throw err
    }
  },

  async getInternalByTema (root, { id }) {
    try {
      const tema = await Docs.Tema.findByPk(id)
      return await tema.getInternals()
    } catch (err) {
      throw err
    }
  }
}
