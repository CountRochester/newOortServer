
import {
  isManagerCheck, defaultErrorHandler,
  getValidValue, isClerkCheck, formatDate
} from '../../../common.js'

export default {
  async addContract (root, { contract: { number, date } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Contract } },
    core: { logger },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)

      const contractNumber = getValidValue(number, 'contractNumber')
      const candidate = await Contract.findOne({ where: { number: contractNumber } })
      if (candidate) {
        throw new Error('Такой контракт уже существует')
      }
      const iDate = formatDate(date)
      const newItem = await Contract.create({
        number: contractNumber,
        date: iDate
      })

      const message = {
        type: 'addContract',
        text: 'Контракт успешно добавлен',
        messageType: 'success',
        id: newItem.id,
        item: JSON.stringify({ contract: { number: contractNumber, date: iDate } })
      }
      pubsub.publish('CONTRACT_CHANGED', {
        contractChanged: {
          type: 'add',
          id: newItem.id,
          item: newItem
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err, logger)
    }
  },

  async editContract (root, { id, contract: { number, date } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Contract } },
    core: { logger },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)

      const contractNumber = getValidValue(number, 'contractNumber')
      const candidate = await Contract.findByPk(id)

      if (!candidate) {
        throw new Error(`Контракт с id: ${id} не существует`)
      }
      if (!contractNumber) {
        throw new Error('Номер контракта не должен быть пустым')
      }

      if (date) {
        candidate.date = formatDate(date)
      }
      candidate.number = contractNumber
      await candidate.save()

      const message = {
        type: 'editContract',
        text: 'Контракт успешно изменён',
        messageType: 'success',
        id,
        item: JSON.stringify({
          contract: {
            number: contractNumber,
            date: +candidate.date
          }
        })
      }
      pubsub.publish('CONTRACT_CHANGED', {
        contractChanged: {
          type: 'edit',
          id: candidate.id,
          item: candidate
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err, logger)
    }
  },

  async deleteContracts (root, { ids }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Contract } },
    core: { logger },
    Op,
    pubsub
  }) {
    try {
      await isClerkCheck(sessionStorage)
      if (!ids.length) {
        throw new Error('Не указаны id')
      }
      await Contract.destroy({
        where: { id: { [Op.in]: ids } }
      })
      const message = {
        type: 'deleteContract',
        text: 'Контракты успешно удалены',
        messageType: 'success',
        ids
      }
      pubsub.publish('CONTRACT_CHANGED', {
        contractChanged: {
          type: 'delete',
          ids
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err, logger)
    }
  }
}
