import {
  isManagerCheck, defaultErrorHandler,
  getValidValue, isClerkCheck, fieldRenamer
} from '../../../common.js'

const renameOptions = [
  {
    oldName: 'ContractId',
    newName: 'contractId'
  }
]

export default {
  async addTema (_, { tema: { name, contractId } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Tema } },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)
      const temaName = getValidValue(name, 'name')
      const candidate = await Tema.findOne({ where: { name: temaName } })
      if (candidate) {
        throw new Error('Такая тема уже существует')
      }
      const newItem = await Tema.create({
        name: temaName,
        ContractId: contractId
      })
      const message = {
        type: 'addTema',
        text: 'Новая тема успешно добавлена',
        messageType: 'success',
        id: newItem.id,
        item: JSON.stringify({ tema: { name: temaName, contractId } })
      }
      pubsub.publish('TEMA_CHANGED', {
        typeChanged: {
          type: 'add',
          id: newItem.id,
          item: fieldRenamer([newItem.dataValues], renameOptions)[0]
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  },

  async editTema (_, { id, tema: { name, contractId } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Tema } },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)
      const temaName = getValidValue(name, 'name')
      const candidate = await Tema.findByPk(id)
      if (!candidate) {
        throw new Error(`Темы с id: ${id} не существует`)
      }
      if (temaName === '') {
        throw new Error('Название темы не должно быть пустым')
      }
      candidate.name = temaName

      await candidate.save()
      await candidate.setContract(contractId)
      const message = {
        type: 'editTema',
        text: 'Данные темы успешно изменены',
        messageType: 'success',
        id,
        item: JSON.stringify({ type: { name: temaName, contractId } })
      }
      pubsub.publish('TEMA_CHANGED', {
        typeChanged: {
          type: 'edit',
          id: candidate.id,
          item: fieldRenamer([candidate.dataValues], renameOptions)[0]
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  },

  async deleteTemas (_, { ids }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Tema } },
    Op,
    pubsub
  }) {
    try {
      await isClerkCheck(sessionStorage)
      if (!ids.length) {
        throw new Error('Не указаны id')
      }
      await Tema.destroy({
        where: { id: { [Op.in]: ids } }
      })

      const message = {
        type: 'deleteTemas',
        text: 'Темы успешно удалены',
        messageType: 'success',
        ids
      }
      pubsub.publish('TEMA_CHANGED', {
        typeChanged: {
          type: 'delete',
          ids
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  }
}
